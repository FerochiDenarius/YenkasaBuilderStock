import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("desktopBridge", {
  platform: process.platform,
  version: "0.1.0",
  print: () => ipcRenderer.invoke("desktop:print"),
  exportPdf: (requestedPath, pageSize) => ipcRenderer.invoke("desktop:export-pdf", requestedPath, pageSize),
  cloud: {
    getConfig: () => ipcRenderer.invoke("cloud:get-config"),
    testConfig: (payload) => ipcRenderer.invoke("cloud:test-config", payload),
    saveConfig: (payload) => ipcRenderer.invoke("cloud:save-config", payload)
  }
});
