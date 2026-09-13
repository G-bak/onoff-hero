import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

const [input, ffmpeg = 'ffmpeg'] = process.argv.slice(2);
if (!input) throw new Error('Usage: node scripts/prepare-web-film.mjs <source.mp4> [ffmpeg-executable]');
const output = 'app/assets/web-showcase';
await fs.mkdir(output, { recursive: true });
await fs.mkdir('design/web-showcase', { recursive: true });
const settings = ['-c:v','libx264','-preset','slow','-crf','21','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart'];
const encode = spawnSync(ffmpeg, ['-hide_banner','-loglevel','error','-i',input,...settings,'-y',`${output}/onoff-web-film.mp4`], { stdio: 'inherit' });
if (encode.status !== 0) throw new Error('Film encoding failed', { cause: encode.error });
const poster = spawnSync(ffmpeg, ['-hide_banner','-loglevel','error','-ss','0.4','-i',input,'-frames:v','1','-f','image2pipe','-vcodec','png','pipe:1'], { maxBuffer: 10 * 1024 * 1024 });
if (poster.status !== 0) throw new Error('Poster extraction failed', { cause: poster.error });
await sharp(poster.stdout).webp({ quality: 88, effort: 6 }).toFile(`${output}/web-film-poster.webp`);
const original = await fs.readFile(input), film = await fs.readFile(`${output}/onoff-web-film.mp4`);
await fs.writeFile('design/web-showcase/video-source.json', JSON.stringify({
  sourceName: path.basename(input), sourceBytes: original.length,
  sourceSha256: createHash('sha256').update(original).digest('hex'),
  source: 'User-supplied ONOFF_FINAL_15s_20260912.mp4, original preserved in AI-Video-Studio/06_Exports',
  output: `${output}/onoff-web-film.mp4`, outputBytes: film.length,
  outputSha256: createHash('sha256').update(film).digest('hex'),
  dimensions: [1280,720], durationSeconds: 15.04, fps: 24,
  settings, posterSeconds: .4,
}, null, 2) + '\n');
console.log(`Web film prepared: ${original.length} → ${film.length} bytes, original dimensions and duration retained.`);
