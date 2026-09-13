import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { unpackCrewSheet } from './crew-sheet.mjs';

await fs.mkdir('design/archive/public/images/people-motion', { recursive: true });
const source = 'design/people-motion/v2', output = 'app/assets/people-motion';
const width = 240, height = 320;
async function chroma(path) {
  const sheet = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let transparent = 0;
  for (let i = 0; i < sheet.data.length; i += 4) {
    const [r,g,b] = sheet.data.subarray(i, i+3);
    const spill = Math.max(0, g - Math.max(r,b) - 6), a = Math.max(0, 1 - spill / 190);
    if (a < .035) { sheet.data.fill(0,i,i+4); transparent++; continue; }
    sheet.data[i] = Math.min(255,Math.round(r/a));
    sheet.data[i+1] = Math.min(255,Math.max(0,Math.round((g-spill)/a)));
    sheet.data[i+2] = Math.min(255,Math.round(b/a));
    sheet.data[i+3] = Math.round(a*255);
  }
  assert.ok(transparent > sheet.info.width * sheet.info.height * .35, 'Expected a clean chroma background');
  return sheet;
}
const manifest = {};
await fs.mkdir(output, {recursive:true});
for (const id of ['designer-dance','web-write']) {
  const original = await fs.readFile(`${source}/${id}/source.png`);
  const sheet = await chroma(original);
  const cells = unpackCrewSheet(sheet, {columns:4,rows:4,id});
  const cellWidth = sheet.info.width/4, cellHeight = sheet.info.height/4;
  const baseline = Math.max(...cells.map((cell,index) => cell.bounds.bottom - Math.floor(index/4)*cellHeight));
  const scale = Math.min(284/Math.max(...cells.map(cell=>cell.bodyHeight)), 1);
  const frames = [];
  await fs.mkdir(`${source}/frames/${id}`, {recursive:true});
  for (const [index,cell] of cells.entries()) {
    // One camera scale and cell origin, not per-pose foot/face normalization:
    // retain the dancer's weight transfer, heel lifts and knee compression.
    const left = Math.round(width/2 + (cell.bounds.left - index%4*cellWidth - cellWidth/2)*scale);
    const top = Math.round(height-12 + (cell.bounds.top - Math.floor(index/4)*cellHeight - baseline)*scale);
    const w = Math.round(cell.width*scale), h = Math.round(cell.height*scale);
    assert.ok(left>=0 && top>=0 && left+w<=width && top+h<=height, `${id}/${index}: complete silhouette must fit`);
    const cut = await sharp(cell.rgba,{raw:{width:cell.width,height:cell.height,channels:4}}).resize(w,h).png().toBuffer();
    const frame = await sharp({create:{width,height,channels:4,background:'#00000000'}}).composite([{input:cut,left,top}]).png().toBuffer();
    frames.push(frame); await fs.writeFile(`${source}/frames/${id}/${index}.png`,frame);
  }
  const sprite = await sharp({create:{width:width*16,height,channels:4,background:'#00000000'}})
    .composite(frames.map((input,index)=>({input,left:index*width,top:0})))
    .webp({quality:91,alphaQuality:100,effort:6}).toBuffer();
  await fs.writeFile(`${output}/${id}-v2.webp`,sprite);
  const delay = id==='designer-dance' ? 140 : 120;
  const raw = await Promise.all(frames.map(frame=>sharp(frame).ensureAlpha().raw().toBuffer()));
  await sharp(Buffer.concat(raw),{raw:{width,height:height*16,pageHeight:height,channels:4}})
    .gif({loop:id==='designer-dance'?0:1,delay,colours:256,dither:.2,effort:7})
    .toFile(`design/archive/public/images/people-motion/${id}-v2.gif`);
  manifest[id] = {sourceSha256:crypto.createHash('sha256').update(original).digest('hex'),width,height,poses:16,scale,baseline,spriteBytes:sprite.length,poseDurationMs:delay,loop:id==='designer-dance'?'all poses':'poses 8–15 after one side-to-rear turn'};
}
const board = await chroma(`${source}/blank-chalkboard/source.png`);
await sharp(board.data,{raw:{width:board.info.width,height:board.info.height,channels:4}})
  .trim({background:'#00000000',threshold:15}).resize({height:640}).webp({quality:92,alphaQuality:100,effort:6}).toFile(`${output}/chalkboard-v2.webp`);
await fs.writeFile(`${source}/animation.json`,JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify(manifest,null,2));
