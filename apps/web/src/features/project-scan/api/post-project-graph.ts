import { projectGraphSchema, type ProjectGraph } from "@ruthenium/shared";

export async function postProjectGraph(rootPath: string): Promise<ProjectGraph> {
  if (typeof window.ruthenium?.scanProjectGraph !== "function") {
    throw new Error("Run inside Electron (npm run dev) for the local shell.");
  }
  const json: unknown = await window.ruthenium.scanProjectGraph(rootPath);
  return projectGraphSchema.parse(json);
}
