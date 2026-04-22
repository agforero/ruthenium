import type { IpcMain } from "electron";
import { scanProjectController } from "./controller.js";

export function registerScanProjectRoute(ipcMain: IpcMain): void {
  ipcMain.handle("ruthenium:scanProject", (_event, payload: unknown) =>
    scanProjectController(payload),
  );
}
