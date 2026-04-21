import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ruthenium", {
  platform: process.platform,
  ping: () => ipcRenderer.invoke("ruthenium:ping"),
  scanProjectGraph: (rootPath: string) =>
    ipcRenderer.invoke("ruthenium:scanProject", { rootPath }),
  selectProjectDirectory: () =>
    ipcRenderer.invoke("ruthenium:selectProjectDirectory"),
});
