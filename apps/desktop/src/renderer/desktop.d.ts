export {};

declare global {
  interface Window {
    desktopBridge?: {
      platform: string;
      version: string;
      print: () => Promise<boolean>;
      exportPdf: (
        requestedPath?: string,
        pageSize?: string,
      ) => Promise<string | null>;
      cloud: {
        getConfig: () => Promise<{
          projectUrl: string;
          projectRef: string;
          databaseUrl: string;
          passwordConfigured: boolean;
        }>;
        testConfig: (payload: {
          projectUrl: string;
          projectRef: string;
          databaseUrl: string;
          databasePassword?: string;
        }) => Promise<{ ok: boolean }>;
        saveConfig: (payload: {
          projectUrl: string;
          projectRef: string;
          databaseUrl: string;
          databasePassword?: string;
        }) => Promise<{ ok: boolean; passwordConfigured: boolean }>;
      };
    };
  }
}
