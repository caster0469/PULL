import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BinaryManager } from '../services/BinaryManager.js';
import { DownloadManager } from '../services/DownloadManager.js';
import { HistoryService } from '../services/HistoryService.js';
import { SettingsService } from '../services/SettingsService.js';
import { YtDlpService } from '../services/YtDlpService.js';
import type { DownloadRequest } from '../../shared/types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const devServerUrl = process.env.VITE_DEV_SERVER_URL;
let mainWindow: BrowserWindow | null = null;

async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    title: 'PULL', width: 1440, height: 860, minWidth: 1040, minHeight: 680,
    backgroundColor: '#e8e8e6',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.webContents.on('did-fail-load', (_event, code, description, url) => {
    console.error(`[electron] Failed to load ${url}: ${description} (${code})`);
  });
  mainWindow.on('closed', () => { mainWindow = null; });

  if (!app.isPackaged && devServerUrl) {
    await mainWindow.loadURL(devServerUrl);
  } else {
    await mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }
}

function registerIpcHandlers(): void {
  const binaries = new BinaryManager();
  const settings = new SettingsService();
  const history = new HistoryService();
  const yt = new YtDlpService(binaries);
  const manager = new DownloadManager(
    binaries, history, () => settings.get().concurrentDownloads,
    (task) => mainWindow?.webContents.send('downloads:updated', task),
  );

  ipcMain.handle('media:metadata', (_event, url: string) => yt.metadata(url));
  ipcMain.handle('settings:get', () => settings.get());
  ipcMain.handle('settings:save', (_event, value) => settings.save(value));
  ipcMain.handle('dialog:directory', async () => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] });
    return result.canceled ? null : result.filePaths[0];
  });
  ipcMain.handle('downloads:enqueue', (_event, request: DownloadRequest) => manager.enqueue(request));
  ipcMain.handle('downloads:cancel', (_event, id: string) => manager.cancel(id));
  ipcMain.handle('downloads:list', () => manager.list());
  ipcMain.handle('history:list', () => history.list());

  const safePath = (value: string): string => {
    if (typeof value !== 'string' || !path.isAbsolute(value) || !fs.existsSync(value)) {
      throw new Error('ファイルが見つかりません。');
    }
    return value;
  };
  ipcMain.handle('file:open', (_event, value: string) => shell.openPath(safePath(value)));
  ipcMain.handle('file:show', (_event, value: string) => shell.showItemInFolder(safePath(value)));
  ipcMain.handle('app:status', async () => ({
    appVersion: app.getVersion(),
    ytDlp: await binaries.version('yt-dlp'),
    ffmpeg: await binaries.version('ffmpeg'),
    ffprobe: await binaries.version('ffprobe'),
  }));
}

process.on('uncaughtException', (error) => console.error('[electron] Uncaught exception:', error));
process.on('unhandledRejection', (reason) => console.error('[electron] Unhandled rejection:', reason));

app.whenReady()
  .then(async () => {
    registerIpcHandlers();
    await createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        void createWindow().catch((error) => console.error('[electron] Could not recreate window:', error));
      }
    });
  })
  .catch((error) => {
    console.error('[electron] Failed to start:', error);
    app.quit();
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
