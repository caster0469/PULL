import { app } from 'electron'; import path from 'node:path'; import fs from 'node:fs'; import { spawn } from 'node:child_process';
export type BinaryName='yt-dlp'|'ffmpeg'|'ffprobe';
export class BinaryManager {
  path(name:BinaryName){ if(!app.isPackaged) return name; const ext=process.platform==='win32'?'.exe':''; return path.join(process.resourcesPath,'binaries',`${process.platform}-${process.arch}`,name+ext); }
  exists(name:BinaryName){const value=this.path(name); return app.isPackaged?fs.existsSync(value):true}
  version(name:BinaryName):Promise<string>{return new Promise(resolve=>{if(!this.exists(name))return resolve('Not found');const p=spawn(this.path(name),['--version'],{windowsHide:true});let out='';p.stdout.on('data',d=>out+=d);p.on('error',()=>resolve('Not found'));p.on('close',c=>resolve(c===0?(out.trim().split('\n')[0]||'Available'):'Not found'));});}
}
