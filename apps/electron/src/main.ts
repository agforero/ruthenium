import { app, BrowserWindow, ipcMain } from "electron";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { registerRoutes } from "./routes/index.js";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const preloadPath = path.join(rootDir, "preload.cjs");
const windowIconPath = path.join(rootDir, "assets", "app-icon.png");
const windowIcon = fs.existsSync(windowIconPath) ? windowIconPath : undefined;

function createWindow(): void {
  const win = new BrowserWindow({
    width: 960,
    height: 640,
    ...(windowIcon !== undefined ? { icon: windowIcon } : {}),
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(rootDir, "../web/dist/index.html"));
  } else {
    win.loadURL("http://localhost:5173");
  }
}

registerRoutes(ipcMain);

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
