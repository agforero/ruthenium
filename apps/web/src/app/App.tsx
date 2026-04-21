import { HealthStatus } from "@/features/health";
import { DesignDemo } from "@/features/design-demo";
import { ProjectScanPanel } from "@/features/project-scan";

export function App() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Ruthenium</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Local desktop app with a preload IPC allowlist into Electron main
          (ping, folder picker, project graph). No separate HTTP server and no
          uploads.
        </p>
      </header>
      <DesignDemo />
      <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
        <HealthStatus />
      </section>
      <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
        <ProjectScanPanel />
      </section>
    </main>
  );
}
