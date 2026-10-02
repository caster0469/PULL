import { createRequire } from 'node:module';
import { chmod, copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(import.meta.url);
const platformDirectory = `${process.platform}-${process.arch}`;
const destination = path.resolve('resources', 'binaries', platformDirectory);
await mkdir(destination, { recursive: true });

for (const [name, packageName] of [
  ['ffmpeg', '@ffmpeg-installer/ffmpeg'],
  ['ffprobe', '@ffprobe-installer/ffprobe'],
]) {
  const source = require(packageName).path;
  const extension = process.platform === 'win32' ? '.exe' : '';
  const target = path.join(destination, `${name}${extension}`);
  await copyFile(source, target);
  if (process.platform !== 'win32') await chmod(target, 0o755);
  console.log(`[binaries] ${name}: ${source} -> ${target}`);
}
