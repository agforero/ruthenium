import { projectGraphSchema, type ProjectGraph } from "@ruthenium/shared";
import { apiUrl } from "@/lib/api-client";

export async function postProjectGraph(rootPath: string): Promise<ProjectGraph> {
  const res = await fetch(apiUrl("/api/project-graph"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rootPath }),
  });

  const json: unknown = await res.json();

  if (!res.ok) {
    const parsed = projectGraphSchema.safeParse(json);
    if (parsed.success) {
      throw new Error(parsed.data.errors.map((e) => e.message).join("\n"));
    }
    throw new Error(`Request failed (${res.status})`);
  }

  return projectGraphSchema.parse(json);
}
