import type { IpcMain } from "electron";
import { selectProjectDirectoryController } from "./controller.js";

export function registerSelectProjectDirectoryRoute(ipcMain: IpcMain): void {
  ipcMain.handle("ruthenium:selectProjectDirectory", () =>
    selectProjectDirectoryController(),
  );
}
