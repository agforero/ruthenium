const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ruthenium", {
  platform: process.platform,
  selectProjectDirectory: () => ipcRenderer.invoke("dialog:openDirectory"),
});
