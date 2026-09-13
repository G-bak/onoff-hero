import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

// Asset-authoring utility, not part of the app/build. Use an installed browser
// automation module; no video generator or browser package ships to visitors.
const modulePath = process.argv[2],
  browserPath = process.argv[3];
if (!modulePath || !browserPath)
  throw Error(
    'Usage: node scripts/render-marketing-video.mjs <playwright module path> <browser executable>',
  );
const { chromium } = await import(pathToFileURL(path.resolve(modulePath)).href);
const browser = await chromium.launch({
  executablePath: browserPath,
  headless: true,
});
try {
  const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
  await page.setContent('<canvas width="540" height="960"></canvas>');
  await page.addScriptTag({ path: 'design/marketing/shorts-film.js' });
  const photo = (
    await fs.readFile('app/assets/marketing/shorts-master.webp')
  ).toString('base64');
  const font = (
    await fs.readFile(
      'node_modules/@fontsource/montserrat/files/montserrat-latin-700-normal.woff2',
    )
  ).toString('base64');
  const result = await page.evaluate(
    async ({ photo, font }) => {
      const face = new FontFace(
        'Montserrat',
        `url(data:font/woff2;base64,${font})`,
        { weight: '700' },
      );
      await face.load();
      document.fonts.add(face);
      const image = new Image();
      image.src = `data:image/webp;base64,${photo}`;
      await image.decode();
      const canvas = document.querySelector('canvas'),
        ctx = canvas.getContext('2d');
      window.drawMarketingFilm(ctx, image, 4.8);
      const poster = canvas.toDataURL('image/png').split(',')[1];
      const stream = canvas.captureStream(24),
        type = 'video/webm;codecs=vp9';
      const recorder = new MediaRecorder(stream, {
          mimeType: type,
          videoBitsPerSecond: 1800000,
        }),
        chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      const finished = new Promise((resolve) => (recorder.onstop = resolve));
      window.drawMarketingFilm(ctx, image, 0);
      recorder.start();
      const start = performance.now();
      await new Promise((resolve) => {
        function frame() {
          const t = (performance.now() - start) / 1000;
          window.drawMarketingFilm(ctx, image, Math.min(t, 5.999));
          if (t < 6) requestAnimationFrame(frame);
          else resolve();
        }
        requestAnimationFrame(frame);
      });
      recorder.stop();
      await finished;
      stream.getTracks().forEach((t) => t.stop());
      const bytes = new Uint8Array(
        await new Blob(chunks, { type }).arrayBuffer(),
      );
      let binary = '';
      for (const b of bytes) binary += String.fromCharCode(b);
      return { video: btoa(binary), poster };
    },
    { photo, font },
  );
  await fs.writeFile(
    'app/assets/marketing/shorts-campaign.webm',
    Buffer.from(result.video, 'base64'),
  );
  await sharp(Buffer.from(result.poster, 'base64'))
    .webp({ quality: 90 })
    .toFile('app/assets/marketing/shorts-poster.webp');
  console.log('Six-second 540x960 motion ad and poster rendered.');
} finally {
  await browser.close();
}
