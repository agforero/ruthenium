import { Button } from "@/components/ui/button";
import darkLogo from "@ruthenium/brand-assets/logo-black.png";
import lightLogo from "@ruthenium/brand-assets/logo.png";
import { FileInput, FilePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function App() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-10 items-center justify-center">
      <header className="w-full">
        <div className="grid w-full min-w-0 justify-items-start">
          <img
            src={lightLogo}
            alt="Ruthenium"
            className="col-start-1 row-start-1 h-auto max-w-sm object-contain dark:hidden"
          />
          <img
            src={darkLogo}
            alt="Ruthenium"
            className="col-start-1 row-start-1 h-auto max-w-sm object-contain hidden dark:block"
          />
        </div>
      </header>
      <div className="w-full grid grid-cols-2 gap-4">
        <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              Start
            </h3>
            <Button
              type="button"
              variant="outline"
              className="w-fit gap-2"
              onClick={() => navigate("/projects/new")}
            >
              <FilePlus className="h-4 w-4 shrink-0" aria-hidden />
              New project
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-fit gap-2"
              onClick={() => undefined}
            >
              <FileInput className="h-4 w-4 shrink-0" aria-hidden />
              Open project
            </Button>
          </div>
        </section>
        <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            Recent
          </h3>
          <p className="text-sm text-muted-foreground">No recent projects.</p>
        </section>
      </div>
    </main>
  );
}
