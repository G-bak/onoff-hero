import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { unpackCrewSheet } from './crew-sheet.mjs';
import { crewPoseCount, crewSequence, crewDelays, crewDuration, crewFrameWidth, crewFrameHeight } from '../lib/galaxy-crew.ts';
import { galaxyServices } from '../lib/galaxy.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(root, 'design/galaxy-crew/v3');
const assetDir = path.join(root, 'app/assets/galaxy-crew');
const gifDir = path.join(root, 'design/archive/public/images/galaxy-crew');
const width = crewFrameWidth, height = crewFrameHeight;
const layout = JSON.parse(await fs.readFile(path.join(sourceDir, 'source-layout.json'), 'utf8'));
await Promise.all([assetDir, gifDir].map(dir => fs.mkdir(dir, { recursive: true })));

const people = [], records = [];
for (const { id } of galaxyServices) {
  const file = path.join(sourceDir, 'pose-sheets', `${id}.png`);
  const bytes = await fs.readFile(file);
  const sheet = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(sheet.info.width % layout.columns, 0, `${id}: expected equal columns`);
  const rows = layout.rows;
  assert.equal(layout.columns * rows, layout.turnPoses);
  assert.ok(layout.turnPoses < crewPoseCount);
  assert.equal(sheet.info.height % rows, 0, `${id}: expected ${rows} equal rows`);
  if (!sheet.data.some((v, i) => i % 4 === 3 && v === 0)) {
    // Generated chroma green is a controlled intermediate, not a transparent
    // checkerboard. Remove the known background and unmix green at the edge.
    let transparent = 0;
    for (let i = 0; i < sheet.data.length; i += 4) {
      const [red, green, blue] = sheet.data.subarray(i, i + 3);
      const spill = Math.max(0, green - Math.max(red, blue) - 6);
      const alpha = Math.max(0, 1 - spill / 190);
      if (alpha < .035) { sheet.data.fill(0, i, i + 4); transparent++; continue; }
      sheet.data[i] = Math.min(255, Math.round(red / alpha));
      sheet.data[i + 1] = Math.min(255, Math.max(0, Math.round((green - spill) / alpha)));
      sheet.data[i + 2] = Math.min(255, Math.round(blue / alpha));
      sheet.data[i + 3] = Math.round(alpha * 255);
    }
    assert.ok(transparent > sheet.info.width * sheet.info.height * .4, `${id}: background is not clean chroma green`);
  }
  const cells=unpackCrewSheet(sheet,{columns:layout.columns,rows,id});
  const frames=[],alignments=[];
  const framesDir=path.join(sourceDir,'frames',id);
  await fs.mkdir(framesDir,{recursive:true});
  // Use only the two settled endpoint poses to compensate framing drift.
  // Normalizing every crown height would erase knee flexion and weight shifts.
  const startScale=layout.bodyHeight/cells[0].bodyHeight;
  const endScale=layout.bodyHeight/cells.at(-1).bodyHeight;
  for(let pose=0;pose<layout.turnPoses;pose++) {
    const cell=cells[pose],mix=pose/(layout.turnPoses-1);
    const scale=startScale*(1-mix)+endScale*mix;
    const scaledWidth=Math.round(cell.width*scale),scaledHeight=Math.round(cell.height*scale);
    const left=Math.round(width/2-cell.anchorX*scale),top=height-10-scaledHeight;
    assert.ok(left>=0&&top>=0&&left+scaledWidth<=width,`${id} pose ${pose}: alignment clips body or wrist`);
    const cut=await sharp(cell.rgba,{raw:{width:cell.width,height:cell.height,channels:4}}).resize(scaledWidth,scaledHeight).png().toBuffer();
    const frame=await sharp({create:{width,height,channels:4,background:'#00000000'}}).composite([{input:cut,left,top}]).png().toBuffer();
    frames.push(frame);
    alignments.push({pose,bounds:cell.bounds,crown:cell.crown,bodyHeight:cell.bodyHeight,scale,left,top});
    await fs.writeFile(path.join(framesDir,`${String(pose).padStart(2,'0')}.png`),frame);
  }
  const retained=[];
  for(let pose=layout.turnPoses;pose<crewPoseCount;pose++) {
    const fileName=`${String(pose).padStart(2,'0')}.png`;
    const file=path.join(sourceDir,'..','v2','frames',id,fileName);
    const frame=await fs.readFile(file),meta=await sharp(frame).metadata();
    assert.equal(meta.width,width);assert.equal(meta.height,height);
    frames.push(frame);retained.push({pose,sha256:createHash('sha256').update(frame).digest('hex')});
    await fs.writeFile(path.join(framesDir,fileName),frame);
  }
  people.push(frames);
  records.push({id,sourceSha256:createHash('sha256').update(bytes).digest('hex'),columns:layout.columns,rows,alignments,retained});
}

// One decoded atlas and one CSS x-position keep all five people in lockstep.
const sprite = await sharp({ create: {
  width: width * crewPoseCount, height: height * people.length, channels: 4, background: '#00000000',
} }).composite(people.flatMap((frames, person) => frames.map((input, pose) => ({
  input, left: pose * width, top: person * height,
})))).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toBuffer();
await fs.writeFile(path.join(assetDir, 'crew-sprite.webp'), sprite);

// Export the same five-person gesture as a single GIF, avoiding the restart
// differences that five independent GIF decoders would introduce on the site.
const stride = 168, gifWidth = stride * (people.length - 1) + width;
const rawFrames = [];
for (let pose = 0; pose < crewPoseCount; pose++) {
  rawFrames.push(await sharp({ create: { width: gifWidth, height, channels: 4, background: '#00000000' } })
    .composite(people.map((frames, person) => ({ input: frames[pose], left: person * stride, top: 0 })))
    .raw().toBuffer());
}
const gif = await sharp(Buffer.concat(crewSequence.map(pose => rawFrames[pose])), {
  raw: { width: gifWidth, height: height * crewSequence.length, pageHeight: height, channels: 4 },
}).gif({ loop: 1, delay: crewDelays, effort: 7, colours: 256, dither: .25 }).toBuffer();
await fs.writeFile(path.join(gifDir, 'team-salute.gif'), gif);
const meta = await sharp(gif, { animated: true }).metadata();
assert.equal(meta.pages, crewSequence.length);
assert.deepEqual(meta.delay, crewDelays);
assert.equal(meta.loop, 1, 'GIF must play once and retain its final frame');
assert.ok(meta.hasAlpha);
await fs.writeFile(path.join(sourceDir, 'animation.json'), JSON.stringify({
  width, height, poses: crewPoseCount, people: records, sequence: crewSequence, delays: crewDelays,
  duration: crewDuration, loop: false, spriteBytes: sprite.length, gifBytes: gif.length,
}, null, 2) + '\n');
console.log(`Galaxy crew: five people, ${crewPoseCount} synchronized poses, ${crewDuration}ms to the held back pose; sprite ${sprite.length} bytes, GIF ${gif.length} bytes.`);
