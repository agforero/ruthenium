import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NewProjectPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">New Project</h1>
        <p className="text-sm text-muted-foreground">
          This is the new project page placeholder. We can wire the creation
          flow here next.
        </p>
      </header>
      <div className="rounded-xl border border-border bg-card p-5 shadow-panel">
        <p className="text-sm text-muted-foreground">
          Start configuring your project settings in this view.
        </p>
      </div>
      <div>
        <Link to="/">
          <Button variant="outline">Back home</Button>
        </Link>
      </div>
    </main>
  );
}
