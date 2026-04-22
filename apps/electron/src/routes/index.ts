import type { IpcMain } from "electron";
import { registerPingRoute } from "./ping/route.js";
import { registerScanProjectRoute } from "./scan-project/route.js";
import { registerSelectProjectDirectoryRoute } from "./select-project-directory/route.js";

export function registerRoutes(ipcMain: IpcMain): void {
  registerPingRoute(ipcMain);
  registerScanProjectRoute(ipcMain);
  registerSelectProjectDirectoryRoute(ipcMain);
}
