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
    };
  }
}
