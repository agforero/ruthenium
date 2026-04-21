import { HealthStatus } from "@/features/health";
import { ProjectScanPanel } from "@/features/project-scan";

export function App() {
  return (
    <main style={{ padding: "1.5rem", maxWidth: 960 }}>
      <h1 style={{ marginTop: 0 }}>Ruthenium</h1>
      <p>
        Local desktop app: the renderer uses a small <strong>preload IPC allowlist</strong> into
        the main process (ping, folder picker, project graph). No separate HTTP server; nothing is
        uploaded.
      </p>
      <HealthStatus />
      <ProjectScanPanel />
    </main>
  );
}
