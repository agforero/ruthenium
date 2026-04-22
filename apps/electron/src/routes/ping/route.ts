import type { IpcMain } from "electron";
import { pingController } from "./controller.js";

export function registerPingRoute(ipcMain: IpcMain): void {
  ipcMain.handle("ruthenium:ping", () => pingController());
}
