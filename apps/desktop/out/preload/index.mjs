import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("desktopBridge", {
  platform: process.platform,
  version: "0.1.0",
  print: () => ipcRenderer.invoke("desktop:print"),
  exportPdf: (requestedPath, pageSize) => ipcRenderer.invoke("desktop:export-pdf", requestedPath, pageSize)
});
