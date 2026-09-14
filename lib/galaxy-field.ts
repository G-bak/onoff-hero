import * as THREE from 'three';
import { galaxyRandom as random, getGalaxyQuality } from './galaxy';
import { starVertex, starFragment, cloudVertex, cloudFragment } from './galaxy-shaders';

type Resources = {
  geometry: <T extends THREE.BufferGeometry>(g: T) => T;
  material: <T extends THREE.Material>(m: T) => T;
  texture: <T extends THREE.Texture>(t: T) => T;
};

// A small irregular gas sprite, not a picture of the galaxy. Thousands of
// separately positioned volumes form the arms, dust lanes and central bulge.
function cloudTexture() {
  // Sample the same gas pattern more finely without changing its shape or noise.
  const size = 512, data = new Uint8Array(size * size * 4);
  const noise = (x: number, y: number) => {
    const ix = Math.floor(x), iy = Math.floor(y), fx = x-ix, fy = y-iy;
    const sx = fx*fx*(3-2*fx), sy = fy*fy*(3-2*fy);
    const a = random(ix+iy*571), b = random(ix+1+iy*571);
    const c = random(ix+(iy+1)*571), d = random(ix+1+(iy+1)*571);
    return (a+(b-a)*sx)*(1-sy)+(c+(d-c)*sx)*sy;
  };
  for(let y=0;y<size;y++) for(let x=0;x<size;x++) {
    const px=x/size*2-1, py=y/size*2-1, d=px*px+py*py;
    let f=0, amplitude=.5, frequency=3;
    for(let octave=0;octave<5;octave++) { f+=noise((px+3)*frequency,(py+3)*frequency)*amplitude; frequency*=2.07;amplitude*=.5; }
    const alpha=Math.exp(-d*4.2)*Math.max(0,1-d)*(.18+f*f*2.8);
    const i=(y*size+x)*4;
    data[i]=data[i+1]=data[i+2]=Math.round(Math.min(1,alpha)*255);data[i+3]=255;
  }
  const texture=new THREE.DataTexture(data,size,size);
  texture.minFilter=THREE.LinearMipmapLinearFilter;texture.magFilter=THREE.LinearFilter;
  texture.generateMipmaps=true;texture.needsUpdate=true;
  return texture;
}

export function createGalaxyField(parent: THREE.Group, r: Resources) {
  const texture=r.texture(cloudTexture());
  const warm=new THREE.Color('#ffe2b9'), white=new THREE.Color('#d9e6f6'), blue=new THREE.Color('#94b9ec'), pink=new THREE.Color('#d56b90');
  function layer(kind: 'stars'|'clouds'|'dust', count: number) {
    const target=new Float32Array(count*3), seed=new Float32Array(count*4), colors=new Float32Array(count*3);
    const sizes=new Float32Array(count), opacity=new Float32Array(count), color=new THREE.Color();
    for(let i=0;i<count;i++) {
      const base=i*17+(kind==='stars'?0:kind==='clouds'?800_000:1_200_000);
      const choice=random(base), core=kind!=='dust'&&choice<.18, disk=kind!=='dust'&&choice>.7;
      const radius=core?Math.pow(random(base+1),1.6)*1.3:disk?Math.min(6.8,-Math.log(1-random(base+1)*.99)*1.65):.4+Math.pow(random(base+1),.85)*6.2;
      const arm=i%2;
      const spiral=arm*Math.PI+Math.log(Math.max(.25,radius))*2.12+.13*Math.sin(radius*1.8+arm*2);
      const scatter=(random(base+2)+random(base+3)+random(base+4)-1.5);
      const angle=core||disk?random(base+2)*Math.PI*2:spiral+scatter*(kind==='dust'?.11:.12+radius*.055)+(kind==='dust'?.2:0);
      const y=(random(base+5)+random(base+6)-1)*(core?.85:.09+radius*.018)+(kind==='dust'?.045:0);
      target.set([Math.cos(angle)*radius,y,Math.sin(angle)*radius],i*3);
      seed.set([random(base+7),random(base+8),random(base+9),random(base+10)],i*4);
      color.copy(warm).lerp(white,Math.min(1,radius/2.2));
      if(!core&&!disk) color.lerp(blue,.28+random(base+11)*.4);
      const edge=Math.max(.05,1-Math.pow(radius/7,3));
      if(kind==='stars') {
        // Dust filaments contain fewer luminous stars, breaking up the arms.
        const lane=!(core||disk)&&Math.abs(angle-spiral-.2)<.045;
        color.multiplyScalar((lane?.24:1)*edge*(.32+random(base+12)*.75));
        sizes[i]=.0035+Math.pow(random(base+13),10)*.027;
      } else if(kind==='clouds') {
        if(!core&&!disk&&random(base+11)>.87) color.copy(pink);
        color.multiplyScalar(core?.8:disk?.38:.52);
        sizes[i]=core?.38+random(base+13)*.6:.28+random(base+13)*.62;
        opacity[i]=(core?.065:disk?.025:.085*Math.min(1,radius/1.4))*edge*.25;
      } else {
        color.setRGB(.003,.0035,.006);
        sizes[i]=.16+random(base+13)*.48;
        opacity[i]=.24*edge;
      }
      colors.set([color.r,color.g,color.b],i*3);
    }
    // Every star has real volume. Instancing shares only the base shape;
    // position, depth, size, color and animation remain individual.
    const primitive=kind==='stars'?new THREE.OctahedronGeometry(1,0):new THREE.PlaneGeometry(1,1);
    const g=r.geometry(new THREE.InstancedBufferGeometry());
    g.index=primitive.index;
    for(const [name,attribute] of Object.entries(primitive.attributes)) g.setAttribute(name,attribute);
    primitive.dispose();
    g.setAttribute('aTarget',new THREE.InstancedBufferAttribute(target,3));
    g.setAttribute('aSeed',new THREE.InstancedBufferAttribute(seed,4));
    g.setAttribute('aColor',new THREE.InstancedBufferAttribute(colors,3));
    g.setAttribute('aSize',new THREE.InstancedBufferAttribute(sizes,1));
    if(kind!=='stars') g.setAttribute('aOpacity',new THREE.InstancedBufferAttribute(opacity,1));
    g.instanceCount=count;
    const uniforms={uTime:{value:0},uPixels:{value:1000},uCloud:{value:texture}};
    const m=r.material(new THREE.ShaderMaterial({
      uniforms,vertexShader:kind==='stars'?starVertex:cloudVertex,fragmentShader:kind==='stars'?starFragment:cloudFragment,
      transparent:true,depthWrite:false,blending:kind==='dust'?THREE.NormalBlending:THREE.AdditiveBlending,
    }));
    const mesh=new THREE.Mesh(g,m);mesh.name=`galaxy-${kind}-instances`;
    mesh.frustumCulled=false;mesh.renderOrder=kind==='clouds'?1:kind==='dust'?2:3;parent.add(mesh);
    return {g,uniforms};
  }
  const layers={stars:layer('stars',32_000),clouds:layer('clouds',3600),dust:layer('dust',1200)};
  return {
    update(time: number) { for(const item of Object.values(layers)) item.uniforms.uTime.value=time; },
    resize(quality: ReturnType<typeof getGalaxyQuality>,height: number) {
      for(const [key,item] of Object.entries(layers)) {
        item.g.instanceCount=quality[key as keyof typeof layers];
        item.uniforms.uPixels.value=height*quality.dpr*1.37;
      }
    },
  };
}
