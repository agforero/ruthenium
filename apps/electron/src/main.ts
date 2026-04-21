import path from "node:path";
import { fileURLToPath } from "node:url";
import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { buildProjectGraph } from "@ruthenium/project-graph";
import {
  healthResponseSchema,
  projectGraphRequestSchema,
  projectGraphSchema,
} from "@ruthenium/shared";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const preloadPath = path.join(rootDir, "preload.cjs");

function registerIpc(): void {
  ipcMain.handle("ruthenium:ping", () => {
    return healthResponseSchema.parse({
      ok: true as const,
      service: "ruthenium-main",
      time: new Date().toISOString(),
    });
  });

  ipcMain.handle("ruthenium:scanProject", (_event, payload: unknown) => {
    const parsedReq = projectGraphRequestSchema.safeParse(payload);
    if (!parsedReq.success) {
      return projectGraphSchema.parse({
        rootPath: "",
        tsconfigPath: null,
        nodes: [],
        edges: [],
        errors: [{ message: parsedReq.error.message }],
      });
    }
    try {
      return buildProjectGraph(parsedReq.data.rootPath);
    } catch (err) {
      return projectGraphSchema.parse({
        rootPath: parsedReq.data.rootPath,
        tsconfigPath: null,
        nodes: [],
        edges: [],
        errors: [
          {
            message:
              err instanceof Error
                ? err.message
                : "Failed to build project graph",
          },
        ],
      });
    }
  });

  ipcMain.handle("ruthenium:selectProjectDirectory", async () => {
    const win =
      BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0];
    const result = await dialog.showOpenDialog(win ?? undefined, {
      properties: ["openDirectory"],
    });
    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }
    return result.filePaths[0];
  });
}

function createWindow(): void {
  const win = new BrowserWindow({
    width: 960,
    height: 640,
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

registerIpc();

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
