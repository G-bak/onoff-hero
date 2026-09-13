import assert from 'node:assert/strict';

// The generator paints complete figurines; this only separates those pixels.
// Connected silhouettes retain fingers that cross nominal contact-sheet rows.
export function unpackCrewSheet(sheet, {columns, rows, id}) {
  const {width, height}=sheet.info, data=sheet.data;
  const labels=new Int32Array(width*height), queue=new Int32Array(width*height);
  const components=[];let label=0;
  for(let pixel=0;pixel<labels.length;pixel++) {
    if(labels[pixel]||data[pixel*4+3]<=8)continue;
    label++;let read=0,write=1;queue[0]=pixel;labels[pixel]=label;
    let left=width,right=0,top=height,bottom=0;
    while(read<write) {
      const p=queue[read++],x=p%width,y=Math.floor(p/width);
      left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
      for(const next of [x>0?p-1:-1,x<width-1?p+1:-1,y>0?p-width:-1,y<height-1?p+width:-1]) {
        if(next>=0&&!labels[next]&&data[next*4+3]>8) {labels[next]=label;queue[write++]=next;}
      }
    }
    if(write>1500&&bottom-top>height/rows*.55&&right-left>width/columns*.2) components.push({label,left,right,top,bottom,pixels:write});
  }
  assert.equal(components.length,columns*rows,`${id}: expected one connected, uncut figure for each pose`);
  const result=Array(columns*rows);
  for(const part of components) {
    let footLeft=width,footRight=0;
    for(let y=part.bottom-Math.round(height/rows*.025);y<=part.bottom;y++)for(let x=part.left;x<=part.right;x++) {
      if(labels[y*width+x]===part.label) {footLeft=Math.min(footLeft,x);footRight=Math.max(footRight,x);}
    }
    const anchorX=(footLeft+footRight)/2;
    const column=Math.floor(anchorX/(width/columns)),row=Math.floor(part.bottom/(height/rows));
    const pose=row*columns+column;
    assert.ok(!result[pose],`${id}: two silhouettes occupy pose ${pose}`);
    // A narrow band through the crown distinguishes dark hair from a raised
    // fist/X to its side. Keeping crown-to-base height prevents scale popping.
    let crown=-1;
    const band=Math.round(width/columns*.12);
    for(let y=part.top;y<part.bottom;y++) {
      let count=0;
      for(let x=Math.max(part.left,Math.round(anchorX-band));x<=Math.min(part.right,Math.round(anchorX+band));x++) {
        const p=y*width+x,i=p*4;
        if(labels[p]===part.label&&data[i]<115&&data[i+1]<115&&data[i+2]<115)count++;
      }
      if(count>=7){crown=y;break;}
    }
    const bodyHeight=part.bottom-crown;
    assert.ok(crown>=part.top&&bodyHeight>height/rows*.55&&bodyHeight<height/rows,`${id} pose ${pose}: crown anchor needs review`);
    const cutWidth=part.right-part.left+1,cutHeight=part.bottom-part.top+1;
    const rgba=Buffer.alloc(cutWidth*cutHeight*4);
    for(let y=part.top;y<=part.bottom;y++)for(let x=part.left;x<=part.right;x++) {
      const source=y*width+x;
      if(labels[source]===part.label)data.copy(rgba,((y-part.top)*cutWidth+x-part.left)*4,source*4,source*4+4);
    }
    result[pose]={rgba,width:cutWidth,height:cutHeight,anchorX:anchorX-part.left,bodyHeight,crown:crown-part.top,bounds:part};
  }
  assert.ok(result.every(Boolean),`${id}: missing a pose`);
  return result;
}
