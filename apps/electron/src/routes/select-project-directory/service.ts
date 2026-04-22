import { pickDirectoryWithDialog } from "./repository.js";

export async function selectProjectDirectory(): Promise<string | null> {
  return pickDirectoryWithDialog();
}
