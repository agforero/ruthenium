import {
  projectGraphSchema,
  projectGraphRequestSchema,
  type ProjectGraph,
} from "@ruthenium/shared";
import { buildGraphFromRoot } from "./repository.js";

function graphError(rootPath: string, message: string): ProjectGraph {
  return projectGraphSchema.parse({
    rootPath,
    tsconfigPath: null,
    nodes: [],
    edges: [],
    errors: [{ message }],
  });
}

export function scanProject(payload: unknown): ProjectGraph {
  const parsedRequest = projectGraphRequestSchema.safeParse(payload);
  if (!parsedRequest.success) {
    return graphError("", parsedRequest.error.message);
  }

  try {
    return buildGraphFromRoot(parsedRequest.data.rootPath);
  } catch (error) {
    return graphError(
      parsedRequest.data.rootPath,
      error instanceof Error ? error.message : "Failed to build project graph",
    );
  }
}
