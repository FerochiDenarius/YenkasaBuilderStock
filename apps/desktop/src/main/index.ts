import { app, BrowserWindow, dialog, ipcMain, safeStorage } from 'electron';
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

let localApi: ChildProcess | undefined;

type CloudConfigInput = {
  projectUrl: string;
  projectRef: string;
  databaseHost: string;
  databasePort: number;
  databaseName: string;
  databaseUser: string;
  databasePassword?: string;
};

type StoredCloudConfig = {
  projectUrl: string;
  projectRef: string;
  databaseHost: string;
  databasePort: number;
  databaseName: string;
  databaseUser: string;
  encryptedPassword: string;
};

type LegacyStoredCloudConfig = Partial<StoredCloudConfig> & { databaseUrl?: string };

function cloudConfigPath(): string {
  return join(app.getPath('userData'), 'cloud-database-config.json');
}

async function readStoredCloudConfig(): Promise<StoredCloudConfig | null> {
  try {
    const raw = JSON.parse(await readFile(cloudConfigPath(), 'utf8')) as LegacyStoredCloudConfig;
    if (raw.databaseHost && raw.databaseUser && raw.databaseName && raw.encryptedPassword) {
      return {
        projectUrl: raw.projectUrl ?? '',
        projectRef: raw.projectRef ?? '',
        databaseHost: raw.databaseHost,
        databasePort: Number(raw.databasePort ?? 5432),
        databaseName: raw.databaseName,
        databaseUser: raw.databaseUser,
        encryptedPassword: raw.encryptedPassword,
      };
    }
    if (!raw.databaseUrl || !raw.encryptedPassword) return null;
    const parsed = new URL(raw.databaseUrl.replace('postgresql+psycopg://', 'postgresql://'));
    return {
      projectUrl: raw.projectUrl ?? '',
      projectRef: raw.projectRef ?? '',
      databaseHost: parsed.hostname,
      databasePort: Number(parsed.port || 6543),
      databaseName: decodeURIComponent(parsed.pathname.replace(/^\//, '')) || 'postgres',
      databaseUser: decodeURIComponent(parsed.username),
      encryptedPassword: raw.encryptedPassword,
    };
  } catch {
    return null;
  }
}

async function decryptCloudPassword(config: StoredCloudConfig | null): Promise<string> {
  if (!config?.encryptedPassword || !safeStorage.isEncryptionAvailable()) return '';
  try {
    return safeStorage.decryptString(Buffer.from(config.encryptedPassword, 'base64'));
  } catch {
    return '';
  }
}

async function cloudApiRequest(path: string, payload: CloudConfigInput) {
  const response = await fetch(`http://127.0.0.1:${process.env.LOCAL_API_PORT ?? '8765'}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Role': 'HQ_ADMIN' },
    body: JSON.stringify(payload),
  });
  const body = (await response.json().catch(() => ({}))) as { detail?: string; message?: string };
  if (!response.ok) throw new Error(body.detail ?? body.message ?? 'Supabase connection failed.');
  return body;
}

async function testCloudConfig(input: CloudConfigInput) {
  const current = await readStoredCloudConfig();
  const password = input.databasePassword?.trim() || await decryptCloudPassword(current);
  return cloudApiRequest('/api/cloud/test', { ...input, databasePassword: password });
}

ipcMain.handle('cloud:get-config', async () => {
  const config = await readStoredCloudConfig();
  return {
    projectUrl: config?.projectUrl ?? '',
    projectRef: config?.projectRef ?? '',
    databaseHost: config?.databaseHost ?? '',
    databasePort: config?.databasePort ?? 5432,
    databaseName: config?.databaseName ?? 'postgres',
    databaseUser: config?.databaseUser ?? 'postgres',
    passwordConfigured: Boolean(config?.encryptedPassword),
  };
});

ipcMain.handle('cloud:test-config', async (_event, input: CloudConfigInput) => {
  await testCloudConfig(input);
  return { ok: true };
});

ipcMain.handle('cloud:save-config', async (_event, input: CloudConfigInput) => {
  await testCloudConfig(input);
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('The operating-system credential store is unavailable on this device.');
  }
  const current = await readStoredCloudConfig();
  const password = input.databasePassword?.trim() || await decryptCloudPassword(current);
  if (!password) throw new Error('Database password is required.');
  const stored: StoredCloudConfig = {
    projectUrl: input.projectUrl.trim(),
    projectRef: input.projectRef.trim(),
    databaseHost: input.databaseHost.trim(),
    databasePort: Number(input.databasePort),
    databaseName: input.databaseName.trim(),
    databaseUser: input.databaseUser.trim(),
    encryptedPassword: safeStorage.encryptString(password).toString('base64'),
  };
  await mkdir(app.getPath('userData'), { recursive: true });
  await writeFile(cloudConfigPath(), JSON.stringify(stored, null, 2), { encoding: 'utf8', mode: 0o600 });
  await chmod(cloudConfigPath(), 0o600);
  restartLocalApi();
  return { ok: true, passwordConfigured: true };
});

ipcMain.handle('desktop:print', async (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (!window) return false;
  return new Promise<boolean>((resolve) => {
    window.webContents.print(
      { silent: false, printBackground: true },
      (success) => resolve(success),
    );
  });
});

ipcMain.handle(
  'desktop:export-pdf',
  async (event, requestedPath?: string, requestedPageSize?: string) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return null;
    let filePath = requestedPath;
    if (!filePath) {
      const result = await dialog.showSaveDialog(window, {
        title: 'Save document as PDF',
        defaultPath: 'Yenkasa-Invoice.pdf',
        filters: [{ name: 'PDF document', extensions: ['pdf'] }],
      });
      if (result.canceled || !result.filePath) return null;
      filePath = result.filePath;
    }
    const pdf = await window.webContents.printToPDF({
      printBackground: true,
      pageSize: requestedPageSize?.startsWith('A5')
        ? 'A5'
        : requestedPageSize?.startsWith('Letter')
          ? 'Letter'
          : requestedPageSize?.startsWith('80 mm')
            ? { width: 80000, height: 200000 }
            : 'A4',
      margins: { marginType: 'none' },
    });
    await writeFile(filePath, pdf);
    return filePath;
  },
);

function startLocalApi(): void {
  const isPackaged = app.isPackaged;
  const servicePath = isPackaged
    ? join(process.resourcesPath, 'local-api')
    : join(__dirname, '../../../..', 'services/local-api');
  const developmentPython = join(servicePath, '.venv', 'bin', 'python');
  const python = isPackaged
    ? join(servicePath, process.platform === 'win32' ? 'local-api.exe' : 'local-api')
    : (process.env.PYTHON ??
      (existsSync(developmentPython) ? developmentPython : 'python3'));
  const args = isPackaged
    ? []
    : [
        '-m',
        'uvicorn',
        'app.main:app',
        '--host',
        '127.0.0.1',
        '--port',
        '8765',
      ];

  if (isPackaged && !existsSync(python)) return;
  localApi = spawn(python, args, {
    cwd: servicePath,
    env: {
      ...process.env,
      LOCAL_API_HOST: '127.0.0.1',
      LOCAL_API_PORT: '8765',
      ...cloudEnvironment(),
      ...(isPackaged
        ? { YENKASA_DATA_DIR: join(app.getPath('userData'), 'data') }
        : {}),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  localApi.on('error', (error) =>
    console.error('[local-api] failed to start', error.message),
  );
  localApi.stdout?.on('data', (chunk) =>
    console.log(`[local-api] ${String(chunk).trim()}`),
  );
  localApi.stderr?.on('data', (chunk) =>
    console.error(`[local-api] ${String(chunk).trim()}`),
  );
}

function cloudEnvironment(): Record<string, string> {
  // The encrypted file is decrypted only in Electron's trusted main process.
  // The resulting value is passed to the loopback backend, never to React.
  // Startup is synchronous here so the child receives the value before spawn.
  try {
    const raw = readFileSync(cloudConfigPath(), 'utf8');
    const config = JSON.parse(raw) as StoredCloudConfig;
    const password = decryptCloudPasswordSync(config);
    if (!password) return {};
    const parsed = new URL('postgresql://localhost');
    parsed.username = config.databaseUser;
    parsed.password = password;
    parsed.hostname = config.databaseHost;
    parsed.port = String(config.databasePort);
    parsed.pathname = `/${config.databaseName}`;
    parsed.searchParams.set('sslmode', 'require');
    return {
      SUPABASE_URL: config.projectUrl,
      SUPABASE_PROJECT_REF: config.projectRef,
      CLOUD_DATABASE_URL: parsed.toString().replace('postgresql://', 'postgresql+psycopg://'),
    };
  } catch {
    return {};
  }
}

function decryptCloudPasswordSync(config: StoredCloudConfig | null): string {
  if (!config?.encryptedPassword || !safeStorage.isEncryptionAvailable()) return '';
  try {
    return safeStorage.decryptString(Buffer.from(config.encryptedPassword, 'base64'));
  } catch {
    return '';
  }
}

function restartLocalApi(): void {
  stopLocalApi();
  startLocalApi();
}

function stopLocalApi(): void {
  if (localApi && !localApi.killed) localApi.kill();
  localApi = undefined;
}

async function createWindow(): Promise<void> {
  const window = new BrowserWindow({
    width: 1586,
    height: 992,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: '#f8fafc',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      // The preload exposes only the narrow print/PDF bridge below. Keeping
      // Node integration disabled and context isolation enabled preserves the
      // renderer boundary while allowing Electron's preload IPC to load in
      // both development and packaged builds.
      sandbox: false,
      preload: join(__dirname, '../preload/index.mjs'),
    },
  });
  if (process.env.ELECTRON_RENDERER_URL) {
    await window.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    await window.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(async () => {
  startLocalApi();
  await createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) void createWindow();
  });
});
app.on('before-quit', stopLocalApi);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
