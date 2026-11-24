export {};

declare global {
  interface Window {
    desktopBridge?: {
      platform: string;
      version: string;
      apiBaseUrl: string;
      print: () => Promise<boolean>;
      exportPdf: (
        requestedPath?: string,
        pageSize?: string,
      ) => Promise<string | null>;
      cloud: {
        getConfig: () => Promise<{
          projectUrl: string;
          projectRef: string;
          databaseHost: string;
          databasePort: number;
          databaseName: string;
          databaseUser: string;
          passwordConfigured: boolean;
        }>;
        testConfig: (payload: {
          projectUrl: string;
          projectRef: string;
          databaseHost: string;
          databasePort: number;
          databaseName: string;
          databaseUser: string;
          databasePassword?: string;
          ownerSession?: string;
        }) => Promise<{ ok: boolean }>;
        saveConfig: (payload: {
          projectUrl: string;
          projectRef: string;
          databaseHost: string;
          databasePort: number;
          databaseName: string;
          databaseUser: string;
          databasePassword?: string;
          ownerSession?: string;
        }) => Promise<{ ok: boolean; passwordConfigured: boolean }>;
      };
    };
  }
}
