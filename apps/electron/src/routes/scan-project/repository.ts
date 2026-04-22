import { buildProjectGraph } from "@ruthenium/project-graph";
import type { ProjectGraph } from "@ruthenium/shared";

export function buildGraphFromRoot(rootPath: string): ProjectGraph {
  return buildProjectGraph(rootPath);
}
