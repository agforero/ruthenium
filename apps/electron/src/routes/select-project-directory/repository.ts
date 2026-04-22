import { BrowserWindow, dialog } from "electron";

export async function pickDirectoryWithDialog(): Promise<string | null> {
  const focusedWindow =
    BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0];
  const result = await dialog.showOpenDialog(focusedWindow ?? undefined, {
    properties: ["openDirectory"],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
}
