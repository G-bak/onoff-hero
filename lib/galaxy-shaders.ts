// Per-instance destinations, depth and timing. No whole-galaxy scale reveal.
const formation = /* glsl */ `
  attribute vec3 aTarget;
  attribute vec4 aSeed;
  attribute vec3 aColor;
  attribute float aSize;
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  float ease(float x) {
    float t=clamp(x,0.,1.);
    return t*t*t*(t*(t*6.-15.)+10.);
  }
  vec3 starPosition() {
    float radius=length(aTarget.xz);
    float age=uTime-(.6+radius*.11+aSeed.x*.45);
    float p=ease(age/(1.45+aSeed.y*.9));
    float angle=atan(aTarget.z,aTarget.x)+(1.-p)*(.55+aSeed.z*1.8)-max(0.,uTime-4.2)*.008;
    float startRadius=.6+radius*.25+aSeed.x*1.6;
    float r=startRadius*(1.-p)+radius*p+sin(3.14159265*p)*(aSeed.w-.5)*.7;
    float y=(aSeed.z-.5)*4.8*(1.-p)+aTarget.y*p+sin(3.14159265*p)*sin(aSeed.w*6.2831853)*.8;
    vAlpha=ease(age/.55);vColor=aColor;
    return vec3(cos(angle)*r,y,sin(angle)*r);
  }
`;
export const starVertex=formation+/* glsl */ `
  uniform float uPixels;
  varying float vFacet;
  void main() {
    vec3 center=starPosition();
    vec4 mv=modelViewMatrix*vec4(center,1.);
    float size=max(aSize,.36*max(1.,-mv.z)/uPixels);
    vec3 shape=position;
    float spin=aSeed.x*6.2831853+uTime*.04;
    shape.xz=mat2(cos(spin),-sin(spin),sin(spin),cos(spin))*shape.xz;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(center+shape*size,1.);
    vFacet=.85+.15*abs(dot(normal,normalize(vec3(.4,.8,.6))));
    vAlpha*=.72+.28*sin(uTime*(.4+aSeed.y*.7)+aSeed.x*90.);
  }
`;
export const starFragment=/* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vFacet;
  void main() {
    gl_FragColor=vec4(vColor*vFacet*1.6,vAlpha*.64);
    #ifdef GALAXY_DIRECT
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #endif
  }
`;
export const cloudVertex=formation+/* glsl */ `
  attribute float aOpacity;
  varying vec2 vUv;
  void main() {
    vec3 center=starPosition();
    vec4 mv=modelViewMatrix*vec4(center,1.);
    vec2 shape=position.xy;
    shape.x*=1.+aSeed.x*1.6;
    float angle=aSeed.w*6.2831853;
    shape=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*shape;
    mv.xy+=shape*aSize;
    gl_Position=projectionMatrix*mv;
    vUv=uv;vAlpha*=aOpacity*mix(.08,1.,ease((uTime-1.2)/2.));
  }
`;
export const cloudFragment=/* glsl */ `
  uniform sampler2D uCloud;
  varying vec2 vUv;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float density=texture2D(uCloud,vUv).r;
    gl_FragColor=vec4(vColor,density*vAlpha);
    #ifdef GALAXY_DIRECT
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #endif
  }
`;
export const fieldVertex=/* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixels;
  varying float vLight;
  varying float vSeed;
  void main() {
    vec4 mv=modelViewMatrix*vec4(position,1.);
    gl_Position=projectionMatrix*mv;
    gl_PointSize=clamp(uPixels*aSize/max(1.,-mv.z),.8,5.);
    vLight=.25+.45*pow(.5+.5*sin(uTime*(.45+aSeed)+aSeed*90.),2.);
    vSeed=aSeed;
  }
`;
export const fieldFragment=/* glsl */ `
  varying float vLight;
  varying float vSeed;
  void main() {
    vec2 p=gl_PointCoord*2.-1.;
    float d=dot(p,p);
    if(d>1.) discard;
    vec3 color=mix(vec3(.48,.65,1.),vec3(1.,.85,.68),vSeed);
    gl_FragColor=vec4(color,exp(-d*7.)*vLight);
    #ifdef GALAXY_DIRECT
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #endif
  }
`;
