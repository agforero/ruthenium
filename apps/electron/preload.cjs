const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("ruthenium", {
  platform: process.platform,
});
