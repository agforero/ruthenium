import { HealthStatus } from "@/features/health";

export function App() {
  return (
    <main style={{ padding: "1.5rem", maxWidth: 720 }}>
      <h1 style={{ marginTop: 0 }}>Ruthenium</h1>
      <p>TypeScript + React (renderer) with an Express API.</p>
      <HealthStatus />
    </main>
  );
}
