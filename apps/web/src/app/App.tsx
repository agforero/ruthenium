import { HealthStatus } from "@/features/health";
import { ProjectScanPanel } from "@/features/project-scan";

export function App() {
  return (
    <main style={{ padding: "1.5rem", maxWidth: 960 }}>
      <h1 style={{ marginTop: 0 }}>Ruthenium</h1>
      <p>
        Local desktop app: the renderer talks to a small API on this machine only. Project scanning
        reads folders you choose on disk—nothing is uploaded.
      </p>
      <HealthStatus />
      <ProjectScanPanel />
    </main>
  );
}
