import { ipcMain, BrowserWindow, dialog, app } from "electron";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
let localApi;
ipcMain.handle("desktop:print", async (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (!window) return false;
  return new Promise((resolve) => {
    window.webContents.print(
      { silent: false, printBackground: true },
      (success) => resolve(success)
    );
  });
});
ipcMain.handle(
  "desktop:export-pdf",
  async (event, requestedPath, requestedPageSize) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return null;
    let filePath = requestedPath;
    if (!filePath) {
      const result = await dialog.showSaveDialog(window, {
        title: "Save document as PDF",
        defaultPath: "Yenkasa-Invoice.pdf",
        filters: [{ name: "PDF document", extensions: ["pdf"] }]
      });
      if (result.canceled || !result.filePath) return null;
      filePath = result.filePath;
    }
    const pdf = await window.webContents.printToPDF({
      printBackground: true,
      pageSize: requestedPageSize?.startsWith("A5") ? "A5" : requestedPageSize?.startsWith("Letter") ? "Letter" : requestedPageSize?.startsWith("80 mm") ? { width: 8e4, height: 2e5 } : "A4",
      margins: { marginType: "none" }
    });
    await writeFile(filePath, pdf);
    return filePath;
  }
);
function startLocalApi() {
  const isPackaged = app.isPackaged;
  const servicePath = isPackaged ? join(process.resourcesPath, "local-api") : join(__dirname, "../../../..", "services/local-api");
  const developmentPython = join(servicePath, ".venv", "bin", "python");
  const python = isPackaged ? join(servicePath, "local-api") : process.env.PYTHON ?? (existsSync(developmentPython) ? developmentPython : "python3");
  const args = isPackaged ? [] : [
    "-m",
    "uvicorn",
    "app.main:app",
    "--host",
    "127.0.0.1",
    "--port",
    "8765"
  ];
  if (isPackaged && !existsSync(python)) return;
  localApi = spawn(python, args, {
    cwd: servicePath,
    env: {
      ...process.env,
      LOCAL_API_HOST: "127.0.0.1",
      LOCAL_API_PORT: "8765"
    },
    stdio: ["ignore", "pipe", "pipe"]
  });
  localApi.on(
    "error",
    (error) => console.error("[local-api] failed to start", error.message)
  );
  localApi.stdout?.on(
    "data",
    (chunk) => console.log(`[local-api] ${String(chunk).trim()}`)
  );
  localApi.stderr?.on(
    "data",
    (chunk) => console.error(`[local-api] ${String(chunk).trim()}`)
  );
}
function stopLocalApi() {
  if (localApi && !localApi.killed) localApi.kill();
  localApi = void 0;
}
async function createWindow() {
  const window = new BrowserWindow({
    width: 1586,
    height: 992,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: "#f8fafc",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      // The preload exposes only the narrow print/PDF bridge below. Keeping
      // Node integration disabled and context isolation enabled preserves the
      // renderer boundary while allowing Electron's preload IPC to load in
      // both development and packaged builds.
      sandbox: false,
      preload: join(__dirname, "../preload/index.mjs")
    }
  });
  if (process.env.ELECTRON_RENDERER_URL) {
    await window.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    await window.loadFile(join(__dirname, "../renderer/index.html"));
  }
}
app.whenReady().then(async () => {
  startLocalApi();
  await createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) void createWindow();
  });
});
app.on("before-quit", stopLocalApi);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
