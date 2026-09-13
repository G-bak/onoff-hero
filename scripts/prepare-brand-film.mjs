import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const [sourceDirectory, ffmpeg = 'ffmpeg'] = process.argv.slice(2);
if (!sourceDirectory) throw new Error('Usage: node scripts/prepare-brand-film.mjs <original-assets-directory> [ffmpeg]');
const output = 'app/assets/brand-film';
const record = 'design/brand-film';
const name = 'onf-cinematic-intro.mp4';
const original = await fs.readFile(path.join(sourceDirectory, name));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
await fs.mkdir(output, { recursive: true });
await fs.mkdir(record, { recursive: true });
const fastStart = original.indexOf('moov') >= 0 && original.indexOf('moov') < original.indexOf('mdat');
if (fastStart) await fs.writeFile(path.join(output, name), original);
else {
  const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-i', path.join(sourceDirectory, name), '-c', 'copy', '-movflags', '+faststart', '-y', path.join(output, name)], { stdio: 'inherit' });
  if (result.status !== 0) throw new Error('Fast-start remux failed', { cause: result.error });
}
await fs.copyFile(path.join(sourceDirectory, 'onf-cinematic-poster.png'), path.join(output, 'onf-cinematic-poster.png'));
const film = await fs.readFile(path.join(output, name));
const poster = await fs.readFile(path.join(output, 'onf-cinematic-poster.png'));
await fs.writeFile(path.join(record, 'source.json'), JSON.stringify({
  sourceProject: 'onoff-website-redesign', sourceFile: `public/assets/${name}`,
  sourceBytes: original.length, sourceSha256: hash(original),
  outputBytes: film.length, outputSha256: hash(film), posterSha256: hash(poster),
  treatment: fastStart ? 'Original bytes copied unchanged.' : 'Lossless container remux for fast-start; video and audio streams copied.',
  durationSeconds: 5, width: 1920, height: 1080, fps: 30, videoCodec: 'H.264', audioCodec: 'AAC',
}, null, 2) + '\n');
console.log(`Brand film ready: ${film.length} bytes. Original project preserved.`);
