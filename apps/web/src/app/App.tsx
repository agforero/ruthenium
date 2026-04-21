import darkLogo from "@ruthenium/brand-assets/logo-black.png";
import lightLogo from "@ruthenium/brand-assets/logo.png";
import { ProjectScanPanel } from "@/features/project-scan";

export function App() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <header className="w-full">
        <div className="grid w-full min-w-0 justify-items-start">
          <img
            src={lightLogo}
            alt="Ruthenium"
            className="col-start-1 row-start-1 h-auto w-auto max-w-full object-contain dark:hidden"
          />
          <img
            src={darkLogo}
            alt="Ruthenium"
            className="col-start-1 row-start-1 hidden h-auto w-auto max-w-full object-contain dark:block"
          />
        </div>
      </header>
      <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
        <ProjectScanPanel />
      </section>
    </main>
  );
}
