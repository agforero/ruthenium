import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { postProjectGraph } from "./api/post-project-graph";

function isElectronShell(): boolean {
  return (
    typeof window.ruthenium?.ping === "function" &&
    typeof window.ruthenium?.scanProjectGraph === "function" &&
    typeof window.ruthenium?.selectProjectDirectory === "function"
  );
}

export function ProjectScanPanel() {
  const [rootPath, setRootPath] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const scanMutation = useMutation({
    mutationFn: postProjectGraph,
  });
  const { mutateAsync } = scanMutation;

  const runScan = useCallback(
    async (pathToScan: string) => {
      const trimmed = pathToScan.trim();
      if (!trimmed) {
        setClientError("Choose a project folder first.");
        return;
      }
      setClientError(null);
      try {
        await mutateAsync(trimmed);
      } catch {
        // Error is handled by scanMutation.error in render.
      }
    },
    [mutateAsync],
  );

  const chooseAndScan = useCallback(async () => {
    const picked = await window.ruthenium?.selectProjectDirectory?.();
    if (!picked) {
      return;
    }
    setRootPath(picked);
    await runScan(picked);
  }, [runScan]);

  const electronUa =
    typeof navigator !== "undefined" &&
    navigator.userAgent.includes("Electron");

  if (!isElectronShell()) {
    return (
      <section style={{ marginTop: "2rem" }}>
        <h2 style={{ marginTop: 0 }}>Project graph</h2>
        {electronUa ? (
          <p
            style={{
              color: "#9a3412",
              background: "#ffedd5",
              padding: "0.75rem 1rem",
              borderRadius: 6,
              fontSize: "0.9rem",
            }}
          >
            This window is Electron, but the <strong>preload bridge</strong> did
            not attach (<code>window.ruthenium</code> is missing). Check the
            devtools console; the app expects <code>dist/preload.cjs</code> to
            load from the main process.
          </p>
        ) : null}
        <p style={{ color: "#475569" }}>
          Ruthenium runs inside <strong>Electron</strong>: privileged work
          (folder picker, project graph) goes over a small{" "}
          <strong>IPC allowlist</strong> to the main process—there is no local
          HTTP API. From the repo root, run{" "}
          <code
            style={{
              background: "#e2e8f0",
              padding: "0.1rem 0.35rem",
              borderRadius: 4,
            }}
          >
            npm run dev
          </code>{" "}
          (or{" "}
          <code
            style={{
              background: "#e2e8f0",
              padding: "0.1rem 0.35rem",
              borderRadius: 4,
            }}
          >
            npm run dev:stack
          </code>{" "}
          for Vite only in a browser).
        </p>
      </section>
    );
  }

  return (
    <section style={{ marginTop: "2rem" }}>
      <h2 style={{ marginTop: 0 }}>Project graph</h2>
      <p style={{ color: "#475569", fontSize: "0.95rem" }}>
        Uses TypeScript&apos;s program and module resolution for the folder you
        pick (same family of rules as <code>tsc</code>). The graph is built in
        the <strong>main process</strong> over IPC; nothing is uploaded.
      </p>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          disabled={scanMutation.isPending}
          onClick={() => void chooseAndScan()}
        >
          {scanMutation.isPending ? "Scanning…" : "Choose project folder…"}
        </button>
        {rootPath ? (
          <span
            style={{
              fontSize: "0.9rem",
              color: "#334155",
              wordBreak: "break-all",
            }}
          >
            {rootPath}
          </span>
        ) : null}
        {rootPath ? (
          <button
            type="button"
            disabled={scanMutation.isPending}
            onClick={() => void runScan(rootPath)}
          >
            Rescan
          </button>
        ) : null}
      </div>
      {clientError || scanMutation.error ? (
        <p style={{ color: "#b91c1c", marginTop: "0.75rem" }}>
          {clientError ??
            (scanMutation.error instanceof Error
              ? scanMutation.error.message
              : "Scan failed")}
        </p>
      ) : null}
      {scanMutation.data ? (
        <div style={{ marginTop: "1rem" }}>
          <p>
            <strong>{scanMutation.data.nodes.length}</strong> files ·{" "}
            <strong>{scanMutation.data.edges.length}</strong> internal edges
            {scanMutation.data.tsconfigPath ? (
              <>
                {" "}
                · tsconfig <code>{scanMutation.data.tsconfigPath}</code>
              </>
            ) : null}
          </p>
          {scanMutation.data.errors.length > 0 ? (
            <ul>
              {scanMutation.data.errors.map((e, i) => (
                <li key={i}>{e.message}</li>
              ))}
            </ul>
          ) : null}
          <details>
            <summary>Raw JSON</summary>
            <pre
              style={{
                maxHeight: 360,
                overflow: "auto",
                background: "#0f172a",
                color: "#e2e8f0",
                padding: "0.75rem",
                borderRadius: 6,
                fontSize: "0.8rem",
              }}
            >
              {JSON.stringify(scanMutation.data, null, 2)}
            </pre>
          </details>
        </div>
      ) : null}
    </section>
  );
}
