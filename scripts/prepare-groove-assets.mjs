import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import { unpackCrewSheet } from './crew-sheet.mjs';
import { removeChroma } from './person-motion-chroma.mjs';

await fs.mkdir('design/archive/public/images/people-motion', { recursive: true });
const source = 'design/people-motion/v3/designer';
const temporary = 'outputs/assets/2026-09-12/people-v3/groove';
const ffmpeg = process.argv[2] || './outputs/research/2026-09-09/follow-art/tool/package/ffmpeg.exe';
const width = 256, height = 384, columns = 12, rows = 8, fps = 24, count = columns * rows;
await fs.mkdir(`${temporary}/input`,{recursive:true});
await fs.mkdir(`${temporary}/interpolated`,{recursive:true});
await fs.mkdir(`${source}/keyframes`,{recursive:true});
const sheet=await removeChroma(`${source}/source.png`);
const poses=unpackCrewSheet(sheet,{columns:4,rows:2,id:'designer-groove'});
const scale=Math.min((height-24)/Math.max(...poses.map(p=>p.height)),(width-24)/Math.max(...poses.map(p=>2*Math.max(p.anchorX,p.width-p.anchorX))));
const keyframes=[];
for(const [index,pose]of poses.entries()){
  const w=Math.round(pose.width*scale),h=Math.round(pose.height*scale);
  const left=Math.round(width/2-pose.anchorX*scale),top=height-12-h;
  assert.ok(left>=0&&top>=0&&left+w<=width,'Entire hands, feet and plinth must remain in the frame');
  const cut=await sharp(pose.rgba,{raw:{width:pose.width,height:pose.height,channels:4}}).resize(w,h).png().toBuffer();
  const frame=await sharp({create:{width,height,channels:4,background:'#00000000'}}).composite([{input:cut,left,top}]).png().toBuffer();
  keyframes.push(frame);await fs.writeFile(`${source}/keyframes/${index}.png`,frame);
}
// Two neighboring poses at each end give motion estimation real loop context.
const sequence=[6,7,0,1,2,3,4,5,6,7,0,1];
for(const [index,pose]of sequence.entries())await sharp(keyframes[pose]).flatten({background:'#00ff00'}).png().toFile(`${temporary}/input/${String(index).padStart(3,'0')}.png`);
execFileSync(path.resolve(ffmpeg),['-hide_banner','-loglevel','error','-framerate','2','-i',`${temporary}/input/%03d.png`,'-vf',`format=yuv444p,minterpolate=fps=${fps}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:me=epzs:mb_size=8:vsbmc=1:scd=none,trim=start=1:duration=4,setpts=PTS-STARTPTS`,'-frames:v',String(count),'-y',`${temporary}/interpolated/%03d.png`],{stdio:'pipe'});
const frames=[];
for(let index=1;index<=count;index++){
  const frame=await removeChroma(`${temporary}/interpolated/${String(index).padStart(3,'0')}.png`);
  frames.push(await sharp(frame.data,{raw:{width,height,channels:4}}).png().toBuffer());
}
await sharp({create:{width:width*columns,height:height*rows,channels:4,background:'#00000000'}})
  .composite(frames.map((input,index)=>({input,left:index%columns*width,top:Math.floor(index/columns)*height})))
  .webp({quality:92,alphaQuality:100,effort:6}).toFile('app/assets/people-motion/designer-groove-v3.webp');
const raw=await Promise.all(frames.map(frame=>sharp(frame).ensureAlpha().raw().toBuffer()));
await sharp(Buffer.concat(raw),{raw:{width,height:height*count,pageHeight:height,channels:4}}).gif({loop:0,delay:42,colours:256,effort:7,dither:.1}).toFile('design/archive/public/images/people-motion/designer-groove-v3.gif');
await sharp({create:{width:width*4,height:height*2,channels:4,background:'#f0f0e9'}}).composite(keyframes.map((input,index)=>({input,left:index%4*width,top:Math.floor(index/4)*height}))).png().toFile(`${temporary}/keyframe-review.png`);
await fs.writeFile(`${source}/animation.json`,JSON.stringify({width,height,columns,rows,count,fps,durationMs:4000,keyPoses:8,scale,interpolation:'FFmpeg motion-compensated interpolation, not frame crossfade or CSS body rotation'},null,2)+'\n');
console.log('Prepared slow groove: 8 key poses, 96 motion-compensated frames, 4 seconds.');
