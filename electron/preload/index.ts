import { contextBridge, ipcRenderer } from 'electron';
import type { DownloadRequest, DownloadTask, PullAPI, Settings } from '../../shared/types.js';

const api: PullAPI = {
  metadata: (url) => ipcRenderer.invoke('media:metadata', url),
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (value: Partial<Settings>) => ipcRenderer.invoke('settings:save', value),
  chooseDirectory: () => ipcRenderer.invoke('dialog:directory'),
  enqueue: (request: DownloadRequest) => ipcRenderer.invoke('downloads:enqueue', request),
  cancel: (id) => ipcRenderer.invoke('downloads:cancel', id),
  getTasks: () => ipcRenderer.invoke('downloads:list'),
  getHistory: () => ipcRenderer.invoke('history:list'),
  openFile: (path) => ipcRenderer.invoke('file:open', path),
  showInFolder: (path) => ipcRenderer.invoke('file:show', path),
  status: () => ipcRenderer.invoke('app:status'),
  onTask(listener) {
    const handler = (_event: Electron.IpcRendererEvent, task: DownloadTask) => listener(task);
    ipcRenderer.on('downloads:updated', handler);
    return () => ipcRenderer.removeListener('downloads:updated', handler);
  },
};

contextBridge.exposeInMainWorld('pull', api);
