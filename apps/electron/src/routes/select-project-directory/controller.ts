import { selectProjectDirectory } from "./service.js";

export async function selectProjectDirectoryController(): Promise<string | null> {
  return selectProjectDirectory();
}
