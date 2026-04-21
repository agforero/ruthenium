import fs from "node:fs";
import path from "node:path";
import type { ProjectGraph } from "@ruthenium/shared";
import * as ts from "typescript";

function normalizeFsPath(p: string): string {
  return path.resolve(path.normalize(p));
}

function isUnderRoot(fileName: string, root: string): boolean {
  const f = normalizeFsPath(fileName);
  const r = normalizeFsPath(root);
  return f === r || f.startsWith(r + path.sep);
}

function isInsideNodeModules(fileName: string): boolean {
  const sep = path.sep;
  return fileName.includes(`${sep}node_modules${sep}`);
}

function isProjectSourceFile(fileName: string, root: string): boolean {
  const f = normalizeFsPath(fileName);
  if (!isUnderRoot(f, root)) return false;
  if (isInsideNodeModules(f)) return false;
  return /\.(tsx?|jsx?|mjs|cjs)$/i.test(f);
}

type EdgeDraft = {
  from: string;
  to: string | null;
  specifier: string;
  kind: "static" | "dynamic" | "require";
  typeOnly?: boolean;
  external?: boolean;
};

function visitForImports(
  node: ts.Node,
  cb: (specifier: string, kind: EdgeDraft["kind"], typeOnly: boolean) => void,
): void {
  if (ts.isImportDeclaration(node)) {
    if (ts.isStringLiteralLike(node.moduleSpecifier)) {
      cb(
        node.moduleSpecifier.text,
        "static",
        node.importClause?.isTypeOnly ?? false,
      );
    }
  } else if (ts.isExportDeclaration(node)) {
    if (node.moduleSpecifier && ts.isStringLiteralLike(node.moduleSpecifier)) {
      cb(node.moduleSpecifier.text, "static", false);
    }
  } else if (ts.isImportEqualsDeclaration(node)) {
    if (ts.isExternalModuleReference(node.moduleReference)) {
      const expr = node.moduleReference.expression;
      if (ts.isStringLiteralLike(expr)) {
        cb(expr.text, "require", false);
      }
    }
  } else if (
    ts.isCallExpression(node) &&
    node.expression.kind === ts.SyntaxKind.ImportKeyword
  ) {
    const arg = node.arguments[0];
    if (arg && ts.isStringLiteralLike(arg)) {
      cb(arg.text, "dynamic", false);
    }
  } else if (ts.isCallExpression(node)) {
    if (
      ts.isIdentifier(node.expression) &&
      node.expression.text === "require"
    ) {
      const arg = node.arguments[0];
      if (arg && ts.isStringLiteralLike(arg)) {
        cb(arg.text, "require", false);
      }
    }
  }
  ts.forEachChild(node, (child) => visitForImports(child, cb));
}

function edgeKey(e: EdgeDraft): string {
  return `${e.from}\0${e.to ?? ""}\0${e.specifier}\0${e.kind}\0${e.typeOnly ?? false}`;
}

export function buildProjectGraph(rootPathInput: string): ProjectGraph {
  const errors: ProjectGraph["errors"] = [];
  const rootPath = normalizeFsPath(rootPathInput);

  if (!fs.existsSync(rootPath)) {
    return {
      rootPath,
      tsconfigPath: null,
      nodes: [],
      edges: [],
      errors: [{ message: `Path does not exist: ${rootPath}` }],
    };
  }

  if (!fs.statSync(rootPath).isDirectory()) {
    return {
      rootPath,
      tsconfigPath: null,
      nodes: [],
      edges: [],
      errors: [{ message: `Path is not a directory: ${rootPath}` }],
    };
  }

  const configPath =
    ts.findConfigFile(rootPath, ts.sys.fileExists, "tsconfig.json") ??
    ts.findConfigFile(rootPath, ts.sys.fileExists, "jsconfig.json");

  if (!configPath) {
    return {
      rootPath,
      tsconfigPath: null,
      nodes: [],
      edges: [],
      errors: [
        {
          message:
            "No tsconfig.json or jsconfig.json found for this directory (search includes parent folders).",
        },
      ],
    };
  }

  const readResult = ts.readConfigFile(configPath, ts.sys.readFile);
  if (readResult.error) {
    const msg = ts.flattenDiagnosticMessageText(
      readResult.error.messageText,
      "\n",
    );
    errors.push({ message: msg, file: readResult.error.file?.fileName });
  }

  const parsed = ts.parseJsonConfigFileContent(
    readResult.config,
    ts.sys,
    path.dirname(configPath),
    undefined,
    configPath,
  );

  for (const d of parsed.errors) {
    errors.push({
      message: ts.flattenDiagnosticMessageText(d.messageText, "\n"),
      file: d.file?.fileName,
    });
  }

  if (parsed.fileNames.length === 0) {
    return {
      rootPath,
      tsconfigPath: normalizeFsPath(configPath),
      nodes: [],
      edges: [],
      errors:
        errors.length > 0
          ? errors
          : [{ message: "TypeScript project contains no input files." }],
    };
  }

  const program = ts.createProgram({
    rootNames: parsed.fileNames,
    options: parsed.options,
    projectReferences: parsed.projectReferences,
    configFileParsingDiagnostics: parsed.errors,
  });

  const bindDiagnostics = program.getOptionsDiagnostics();
  for (const d of bindDiagnostics) {
    errors.push({
      message: ts.flattenDiagnosticMessageText(d.messageText, "\n"),
      file: d.file?.fileName,
    });
  }

  const options = program.getCompilerOptions();
  const nodePaths = new Set<string>();
  const edgeDrafts: EdgeDraft[] = [];
  const seenEdge = new Set<string>();

  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile) {
      continue;
    }
    if (!isProjectSourceFile(sourceFile.fileName, rootPath)) {
      continue;
    }

    const from = normalizeFsPath(sourceFile.fileName);
    nodePaths.add(from);

    visitForImports(sourceFile, (specifier, kind, typeOnly) => {
      const resolved = ts.resolveModuleName(
        specifier,
        sourceFile.fileName,
        options,
        ts.sys,
      );
      const resolvedFileName = resolved.resolvedModule?.resolvedFileName;
      const toPath = resolvedFileName
        ? normalizeFsPath(resolvedFileName)
        : null;

      const external =
        toPath !== null &&
        (isInsideNodeModules(toPath) || !isUnderRoot(toPath, rootPath));

      const internalTarget =
        toPath !== null && isProjectSourceFile(toPath, rootPath)
          ? toPath
          : null;

      if (internalTarget) {
        nodePaths.add(internalTarget);
      }

      const draft: EdgeDraft = {
        from,
        to: internalTarget,
        specifier,
        kind,
        typeOnly: typeOnly || undefined,
        external:
          internalTarget === null && (external || toPath === null)
            ? true
            : undefined,
      };

      const key = edgeKey(draft);
      if (seenEdge.has(key)) return;
      seenEdge.add(key);
      edgeDrafts.push(draft);
    });
  }

  const nodes = [...nodePaths].sort().map((p) => ({ path: p }));

  const edges = edgeDrafts
    .sort((a, b) => {
      const af = a.from.localeCompare(b.from);
      if (af !== 0) return af;
      return a.specifier.localeCompare(b.specifier);
    })
    .map(({ from, to, specifier, kind, typeOnly, external }) => ({
      from,
      to,
      specifier,
      kind,
      typeOnly,
      external,
    }));

  return {
    rootPath,
    tsconfigPath: normalizeFsPath(configPath),
    nodes,
    edges,
    errors,
  };
}
