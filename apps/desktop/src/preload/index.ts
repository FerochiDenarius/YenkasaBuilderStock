import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('desktopBridge', {
  platform: process.platform,
  version: '0.1.0',
  apiBaseUrl: `http://127.0.0.1:${process.env.LOCAL_API_PORT ?? '8765'}`,
  print: () => ipcRenderer.invoke('desktop:print'),
  exportPdf: (requestedPath?: string, pageSize?: string) =>
    ipcRenderer.invoke('desktop:export-pdf', requestedPath, pageSize),
  cloud: {
    getConfig: () => ipcRenderer.invoke('cloud:get-config'),
    testConfig: (payload: {
      projectUrl: string;
      projectRef: string;
      databaseHost: string;
      databasePort: number;
      databaseName: string;
      databaseUser: string;
      databasePassword?: string;
      ownerSession?: string;
    }) => ipcRenderer.invoke('cloud:test-config', payload),
    saveConfig: (payload: {
      projectUrl: string;
      projectRef: string;
      databaseHost: string;
      databasePort: number;
      databaseName: string;
      databaseUser: string;
      databasePassword?: string;
      ownerSession?: string;
    }) => ipcRenderer.invoke('cloud:save-config', payload),
  },
});
