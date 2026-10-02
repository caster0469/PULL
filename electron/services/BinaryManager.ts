import { app } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

export type BinaryName = 'yt-dlp' | 'ffmpeg' | 'ffprobe';
export interface BinaryCheck { available: boolean; version?: string; error?: string }

const require = createRequire(import.meta.url);

/** Central resolver and health checker for every external executable. */
export class BinaryManager {
  private bundledPath(name: BinaryName): string {
    const extension = process.platform === 'win32' ? '.exe' : '';
    return path.join(process.resourcesPath, 'binaries', `${process.platform}-${process.arch}`, `${name}${extension}`);
  }

  private installerPath(name: 'ffmpeg' | 'ffprobe'): string | undefined {
    try {
      const dependency = name === 'ffmpeg' ? '@ffmpeg-installer/ffmpeg' : '@ffprobe-installer/ffprobe';
      return (require(dependency) as { path?: string }).path;
    } catch { return undefined; }
  }

  getYtDlpPath(): string { return app.isPackaged ? this.bundledPath('yt-dlp') : 'yt-dlp'; }
  getFfmpegPath(): string { return app.isPackaged ? this.bundledPath('ffmpeg') : this.installerPath('ffmpeg') ?? this.bundledPath('ffmpeg'); }
  getFfprobePath(): string { return app.isPackaged ? this.bundledPath('ffprobe') : this.installerPath('ffprobe') ?? this.bundledPath('ffprobe'); }
  path(name: BinaryName): string { return name === 'yt-dlp' ? this.getYtDlpPath() : name === 'ffmpeg' ? this.getFfmpegPath() : this.getFfprobePath(); }

  /** Spawn the executable so a corrupt or non-executable file is not reported as available. */
  check(name: BinaryName, timeoutMs = 4_000): Promise<BinaryCheck> {
    return new Promise((resolve) => {
      const executable = this.path(name);
      if (path.isAbsolute(executable) && !fs.existsSync(executable)) return resolve({ available: false, error: 'Bundled binary is missing' });
      let settled = false;
      let timer: NodeJS.Timeout;
      const finish = (result: BinaryCheck) => { if (!settled) { settled = true; clearTimeout(timer); resolve(result); } };
      const child = spawn(executable, [name === 'yt-dlp' ? '--version' : '-version'], { windowsHide: true });
      let output = '';
      child.stdout.on('data', data => { if (output.length < 4096) output += String(data); });
      child.stderr.on('data', data => { if (output.length < 4096) output += String(data); });
      child.on('error', error => finish({ available: false, error: error.message }));
      child.on('close', code => finish(code === 0
        ? { available: true, version: output.trim().split(/\r?\n/)[0] || 'Available' }
        : { available: false, error: `Exited with code ${code}` }));
      timer = setTimeout(() => { child.kill(); finish({ available: false, error: 'Version check timed out' }); }, timeoutMs);
    });
  }
}
