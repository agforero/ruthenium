import type { ProjectGraph } from "@ruthenium/shared";
import { scanProject } from "./service.js";

export function scanProjectController(payload: unknown): ProjectGraph {
  return scanProject(payload);
}
