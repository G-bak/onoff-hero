import{a as e,c as t,d as n,f as r,i,l as a,m as o,n as s,p as c,r as l,s as u,u as d}from"./galaxy-DEuY0uN0.js";import{C as f,D as p,E as m,F as h,G as g,J as _,L as v,M as y,O as b,P as x,Q as S,R as C,S as ee,U as te,V as w,W as T,X as E,_ as D,a as ne,at as O,b as k,d as re,et as A,f as j,g as ie,h as ae,it as M,j as N,k as P,l as F,m as I,n as L,nt as R,o as z,p as oe,q as se,rt as B,s as ce,t as le,tt as V,u as H,v as U,w as ue,x as W,z as de}from"./three.module-DPNce3w3.js";import{t as fe}from"./RoomEnvironment-DtYfTqxy.js";var G={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},K=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},q=new C(-1,1,1,-1,0,1),J=new class extends ce{constructor(){super(),this.setAttribute(`position`,new U([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new U([0,2,0,0,2,0],2))}},Y=class{constructor(e){this._mesh=new N(J,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,q)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},X=class extends K{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof _?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=R.clone(e.uniforms),this.material=new _({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Y(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Z=class extends K{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},pe=class extends K{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},me=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new B);this._width=n.width,this._height=n.height,t=new O(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:W}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new X(G),this.copyPass.material.blending=0,this.timer=new A}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}Z!==void 0&&(r instanceof Z?n=!0:r instanceof pe&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new B);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},he=class extends K{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new H}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},ge={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new H(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},_e=class e extends K{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new B(256,256):new B(e.x,e.y),this.clearColor=new H(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new O(i,a,{type:W,depthBuffer:!1}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new O(i,a,{type:W,depthBuffer:!1});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new O(i,a,{type:W,depthBuffer:!1});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=ge;this.highPassUniforms=R.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new _({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new B(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new M(1,1,1),new M(1,1,1),new M(1,1,1),new M(1,1,1),new M(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=R.clone(G.uniforms),this.blendMaterial=new _({uniforms:this.copyUniforms,vertexShader:G.vertexShader,fragmentShader:G.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new H,this._oldClearAlpha=1,this._basic=new y,this._fsQuad=new Y(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new B(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);let r=[],i=[];for(let n=1;n<e;n+=2){let a=t[n],o=n+1<e?t[n+1]:0,s=a+o;r.push((n*a+(n+1)*o)/s),i.push(s)}return new _({defines:{KERNEL_PAIRS:r.length},uniforms:{colorTexture:{value:null},invSize:{value:new B(.5,.5)},direction:{value:new B(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:r},gaussianWeights:{value:i}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new _({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};_e.BlurDirectionX=new B(1,0),_e.BlurDirectionY=new B(0,1);var Q={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},ve=class extends K{constructor(){super(),this.isOutputPass=!0,this.uniforms=R.clone(Q.uniforms),this.material=new T({name:Q.name,uniforms:this.uniforms,vertexShader:Q.vertexShader,fragmentShader:Q.fragmentShader}),this._fsQuad=new Y(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},re.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};function ye(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new ce,l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;o[e]===void 0&&(o[e]=[]),o[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=be(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=be(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function be(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new z(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}var xe=`
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
`,Se=xe+`
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
`,$=`
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
`,Ce=xe+`
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
`,we=`
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
`,Te=`
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
`,Ee=`
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
`;function De(e){let t=e.material(new h({color:13206084,metalness:.57,roughness:.35})),n=e.material(new h({color:12952930,metalness:.76,roughness:.32})),r=e.material(new y({color:10215423,transparent:!0,opacity:.37,depthWrite:!1,blending:2})),i=(e,t,n,r=0,i=0,a=0)=>new ne(e,t,n).translate(r,i,a),a=(e,t,n=0,r=0,i=0)=>new oe(e,e,t,16).rotateX(Math.PI/2).translate(n,r,i),o=(e,t,n=0,r=0,i=0)=>new F(e,t,5,16).rotateX(Math.PI/2).translate(n,r,i);function s(e,t=.035){let n=new E;return e.forEach(([e,t],r)=>{r?n.lineTo(e,-t):n.moveTo(e,-t)}),n.closePath(),new D(n,{depth:t,bevelEnabled:!0,bevelSegments:1,steps:1,bevelSize:.008,bevelThickness:.008}).rotateX(-Math.PI/2).translate(0,-t/2,0)}function c(t,n,r){let i=n.map(e=>e.index?e.toNonIndexed():e),a=ye(i);if(new Set([...n,...i]).forEach(e=>e.dispose()),!a)throw Error(`Spacecraft geometry could not be merged`);t.add(new N(e.geometry(a),r))}function u(t,n,i=.5){i*=.45,c(t,n.map(([e,t,n])=>a(.05,.055,e,t,n)),e.blueSignal),c(t,n.map(([e,t,n])=>new j(.045,i,10).rotateX(-Math.PI/2).translate(e,t,n-i/2)),r)}return l.map(({kind:r})=>{let l=new k;if(l.name=`fleet-${r}`,r===`shuttle`)c(l,[o(.145,.72),s([[-.1,.22],[-.67,-.47],[-.2,-.45],[0,-.2],[.2,-.45],[.67,-.47],[.1,.22]]),s([[0,-.2],[.29,-.55],[0,-.53]]).rotateZ(Math.PI/2).translate(0,.12,0)],e.ceramic),c(l,[o(.138,.66,0,-.053,-.02),i(.3,.035,.15,0,-.04,-.39)],e.titanium),c(l,[new S(.115,16,12).scale(1,.4,1.3).translate(0,.137,.24)],e.glass),c(l,[i(.22,.01,.035,-.32,.025,-.28),i(.22,.01,.035,.32,.025,-.28)],e.signal),u(l,[[-.085,0,-.51],[.085,0,-.51]],.48);else if(r===`airship`)c(l,[new S(.29,32,20).scale(1,.82,2.85),i(.22,.14,.48,0,-.28,-.03)],e.ceramic),c(l,[-.52,-.3,0,.3,.52].map(e=>new V(.293*Math.sqrt(1-e*e/.69),.012,5,32).scale(1,.82,1).translate(0,0,e)),e.titanium),c(l,[i(.228,.065,.32,0,-.26,.01)],e.glass),c(l,[s([[0,-.42],[-.43,-.83],[0,-.7]]),s([[0,-.42],[.43,-.83],[0,-.7]]),s([[0,-.35],[.33,-.82],[0,-.7]]).rotateZ(Math.PI/2)],e.solar),u(l,[[-.23,-.12,-.57],[.23,-.12,-.57]],.32);else if(r===`rocket`)c(l,[a(.15,1.03),new j(.15,.36,20).rotateX(Math.PI/2).translate(0,0,.69),o(.065,.52,-.23,0,-.19),o(.065,.52,.23,0,-.19)],e.ceramic),c(l,[a(.152,.52,0,0,.07)],t),c(l,[new V(.153,.027,6,24).translate(0,0,-.38),new V(.153,.019,6,24).translate(0,0,.37),a(.115,.15,0,0,-.56)],e.titanium),c(l,Array.from({length:4},(e,t)=>s([[.13,-.25],[.34,-.61],[.13,-.54]]).rotateZ(t*Math.PI/2)),e.ceramic),u(l,[[0,0,-.66],[-.23,0,-.52],[.23,0,-.52]],.85);else if(r===`explorer`){c(l,[i(.3,.28,.36),a(.018,1.6).rotateY(Math.PI/2)],n),c(l,[i(.55,.018,.57,-.57,0,0),i(.55,.018,.57,.57,0,0)],e.solar);let t=[];for(let e of[-1,1]){for(let n=0;n<7;n++)t.push(i(.53,.008,.006,e*.57,.013,-.25+n*.083));for(let n=0;n<5;n++)t.push(i(.006,.008,.55,e*.57-.25+n*.125,.013,0))}c(l,t,e.titanium),c(l,[new S(.22,20,12,0,Math.PI*2,0,Math.PI/2).scale(1,.4,1).translate(0,.24,.04),i(.025,.16,.025,0,.19,0)],e.ceramic),c(l,[new S(.025,8,6).translate(0,.36,0)],e.signal),u(l,[[0,-.05,-.2]],.3)}else c(l,[i(.27,.19,.9),o(.105,.62,-.3,0,-.13),o(.105,.62,.3,0,-.13),s([[-.14,.55],[-.32,.1],[.32,.1],[.14,.55]])],e.titanium),c(l,[i(.25,.18,.2,-.3,.15,-.2),i(.25,.18,.2,-.3,.15,.04),i(.25,.18,.2,.3,.15,-.2),i(.25,.18,.2,.3,.15,.04),i(.27,.13,.3,0,.17,-.28)],e.ceramic),c(l,[i(.258,.04,.21,-.3,.19,-.2),i(.258,.04,.21,.3,.19,.04),i(.16,.03,.23,0,.18,.26)],e.solar),c(l,[i(.23,.08,.025,0,.09,.55)],e.glass),c(l,[i(.018,.19,.15,-.433,.15,-.2),i(.018,.19,.15,.433,.15,.04)],e.signal),u(l,[[-.3,0,-.57],[.3,0,-.57],[0,0,-.47]],.52);return l})}function Oe(){let t=new Uint8Array(512*512*4),n=(t,n)=>{let r=Math.floor(t),i=Math.floor(n),a=t-r,o=n-i,s=a*a*(3-2*a),c=o*o*(3-2*o),l=e(r+i*571),u=e(r+1+i*571),d=e(r+(i+1)*571),f=e(r+1+(i+1)*571);return(l+(u-l)*s)*(1-c)+(d+(f-d)*s)*c};for(let e=0;e<512;e++)for(let r=0;r<512;r++){let i=r/512*2-1,a=e/512*2-1,o=i*i+a*a,s=0,c=.5,l=3;for(let e=0;e<5;e++)s+=n((i+3)*l,(a+3)*l)*c,l*=2.07,c*=.5;let u=Math.exp(-o*4.2)*Math.max(0,1-o)*(.18+s*s*2.8),d=(e*512+r)*4;t[d]=t[d+1]=t[d+2]=Math.round(Math.min(1,u)*255),t[d+3]=255}let r=new I(t,512,512);return r.minFilter=P,r.magFilter=b,r.generateMipmaps=!0,r.needsUpdate=!0,r}function ke(t,n){let r=n.texture(Oe()),i=new H(`#ffe2b9`),a=new H(`#d9e6f6`),o=new H(`#94b9ec`),s=new H(`#d56b90`);function c(c,l){let u=new Float32Array(l*3),d=new Float32Array(l*4),p=new Float32Array(l*3),m=new Float32Array(l),h=new Float32Array(l),g=new H;for(let t=0;t<l;t++){let n=t*17+(c===`stars`?0:c===`clouds`?8e5:12e5),r=e(n),l=c!==`dust`&&r<.18,f=c!==`dust`&&r>.7,_=l?e(n+1)**1.6*1.3:f?Math.min(6.8,-Math.log(1-e(n+1)*.99)*1.65):.4+e(n+1)**.85*6.2,v=t%2,y=v*Math.PI+Math.log(Math.max(.25,_))*2.12+.13*Math.sin(_*1.8+v*2),b=e(n+2)+e(n+3)+e(n+4)-1.5,x=l||f?e(n+2)*Math.PI*2:y+b*(c===`dust`?.11:.12+_*.055)+(c===`dust`?.2:0),S=(e(n+5)+e(n+6)-1)*(l?.85:.09+_*.018)+(c===`dust`?.045:0);u.set([Math.cos(x)*_,S,Math.sin(x)*_],t*3),d.set([e(n+7),e(n+8),e(n+9),e(n+10)],t*4),g.copy(i).lerp(a,Math.min(1,_/2.2)),!l&&!f&&g.lerp(o,.28+e(n+11)*.4);let C=Math.max(.05,1-(_/7)**3);if(c===`stars`){let r=!(l||f)&&Math.abs(x-y-.2)<.045;g.multiplyScalar((r?.24:1)*C*(.32+e(n+12)*.75)),m[t]=.0035+e(n+13)**10*.027}else c===`clouds`?(!l&&!f&&e(n+11)>.87&&g.copy(s),g.multiplyScalar(l?.8:f?.38:.52),m[t]=l?.38+e(n+13)*.6:.28+e(n+13)*.62,h[t]=(l?.065:f?.025:.085*Math.min(1,_/1.4))*C*.25):(g.setRGB(.003,.0035,.006),m[t]=.16+e(n+13)*.48,h[t]=.24*C);p.set([g.r,g.g,g.b],t*3)}let y=c===`stars`?new v(1,0):new w(1,1),b=n.geometry(new ue);b.index=y.index;for(let[e,t]of Object.entries(y.attributes))b.setAttribute(e,t);y.dispose(),b.setAttribute(`aTarget`,new f(u,3)),b.setAttribute(`aSeed`,new f(d,4)),b.setAttribute(`aColor`,new f(p,3)),b.setAttribute(`aSize`,new f(m,1)),c!==`stars`&&b.setAttribute(`aOpacity`,new f(h,1)),b.instanceCount=l;let x={uTime:{value:0},uPixels:{value:1e3},uCloud:{value:r}},S=new N(b,n.material(new _({uniforms:x,vertexShader:c===`stars`?Se:Ce,fragmentShader:c===`stars`?$:we,transparent:!0,depthWrite:!1,blending:c===`dust`?1:2})));return S.name=`galaxy-${c}-instances`,S.frustumCulled=!1,S.renderOrder=c===`clouds`?1:c===`dust`?2:3,t.add(S),{g:b,uniforms:x}}let l={stars:c(`stars`,32e3),clouds:c(`clouds`,3600),dust:c(`dust`,1200)};return{update(e){for(let t of Object.values(l))t.uniforms.uTime.value=e},resize(e,t){for(let[n,r]of Object.entries(l))r.g.instanceCount=e[n],r.uniforms.uPixels.value=t*e.dpr*1.37}}}function Ae(f){let v=new L({antialias:!0,alpha:!1,powerPreference:`high-performance`});v.setClearColor(1),v.outputColorSpace=g,v.toneMapping=6,v.toneMappingExposure=1.12,v.info.autoReset=!1,v.debug.onShaderError=(e,t,n,r)=>{throw Error([e.getProgramInfoLog(t),e.getShaderInfoLog(n),e.getShaderInfoLog(r)].filter(Boolean).join(`
`))},v.domElement.setAttribute(`aria-hidden`,`true`);let b=new se,C=new de(40,1,.1,1800),w=new k,T=new k,E=new k;E.name=`galactic-disk`,T.name=`orbital-station`,E.scale.setScalar(1.2),w.rotation.z=-.13,b.add(w),w.add(T,E);let D=new Set,re=new Set,A=e=>(D.add(e),e),j=e=>(re.add(e),e),P=e=>{let t=ye(e,!1);if(e.forEach(e=>e.dispose()),!t)throw Error(`Could not construct spacecraft geometry`);return A(t)},F=(e,t,n,r=0,i=0,a=0)=>new ne(e,t,n).translate(r,i,a),I=null,R=null,U=null,ue=null,G=new Set,K=e=>(G.add(e),e),q=1,J=1,Y=!1,X=o(f.clientWidth,f.clientHeight,devicePixelRatio),Z=new M,pe=new M;function ge(){Y||(Y=!0,D.forEach(e=>e.dispose()),re.forEach(e=>e.dispose()),I?.dispose(),G.forEach(e=>e.dispose()),U?.dispose(),ue?.dispose(),R?.dispose(),v.dispose(),v.domElement.remove())}try{let g=new fe,D=new le(v);try{I=D.fromScene(g,.04),b.environment=I.texture,b.environmentIntensity=.6}finally{D.dispose(),g.dispose()}b.add(new ee(11980031,1511977,1.4));let ne=new ae(16771794,3.1);ne.position.set(-4,7,5),b.add(ne);let M=new ae(5465599,3.7);M.position.set(6,1,-5),b.add(M);let L=j(new x({color:12436946,metalness:.52,roughness:.3,clearcoat:.55})),se=j(new h({color:2238005,metalness:.86,roughness:.24})),de=j(new h({color:1320021,emissive:1322084,emissiveIntensity:.42,metalness:.74,roughness:.23})),G=j(new x({color:1582905,emissive:1651282,emissiveIntensity:.5,metalness:.65,roughness:.12,clearcoat:1})),Y=j(new y({color:new H(1.45,2,.32)})),Q=j(new y({color:new H(.3,1.3,2.2)})),ye=ke(E,{geometry:A,material:j,texture:K}),be=new Float32Array(1400*3),xe=new Float32Array(1400),Se=new Float32Array(1400);for(let t=0;t<1400;t++){let n=e(t*4)*Math.PI*2,r=e(t*4+1)*2-1,i=28+e(t*4+2)*96;be.set([Math.sqrt(1-r*r)*Math.cos(n)*i,r*i,Math.sqrt(1-r*r)*Math.sin(n)*i],t*3),xe[t]=.025+e(t*4+3)**6*.2,Se[t]=e(t+713)}let $=A(new ce);$.setAttribute(`position`,new z(be,3)),$.setAttribute(`aSize`,new z(xe,1)),$.setAttribute(`aSeed`,new z(Se,1));let Ce={uTime:{value:0},uPixels:{value:1e3}};b.add(new te($,j(new _({uniforms:Ce,vertexShader:Te,fragmentShader:Ee,transparent:!0,depthWrite:!1,blending:2}))));let we=[new V(.89,.115,12,96).rotateX(Math.PI/2),new V(.68,.065,8,80).rotateX(Math.PI/2).translate(0,.12,0)];for(let e=0;e<10;e++)we.push(F(.065,.08,.7,0,-.025,.55).rotateY(e*Math.PI/5));T.add(new N(P(we),L));let Oe=new N(A(new S(.33,32,16)),G);Oe.scale.y=.68,Oe.position.y=.2,T.add(Oe);let Ae=new N(A(new oe(.32,.42,.3,32)),se);T.add(Ae);let je=[];for(let e=0;e<42;e++)je.push(F(.055,.035,.045,0,.045,.993).rotateY(e*Math.PI*2/42));T.add(new N(P(je),Y)),u.forEach((e,t)=>{let n=new k;n.rotation.y=e.angle,T.add(n);let r=P([new oe(.13,.13,.6,12).rotateX(Math.PI/2).translate(0,0,1.12),F(.055,.065,1.1,0,-.04,1.25),F(.94,.025,.045,0,0,1.37)]);n.add(new N(r,L));let i=P([F(.34,.02,.66,-.36,.025,1.4),F(.34,.02,.66,.36,.025,1.4)]);n.add(new N(i,de));let a=[];for(let e of[-1,1])for(let t=0;t<7;t++)a.push(F(.325,.006,.006,e*.36,.039,1.12+t*.09));n.add(new N(P(a),se));let o=new N(A(new S(.045,8,6)),t%2?Q:Y);o.position.set(0,.1,1.46),n.add(o)});let Me=De({geometry:A,material:j,ceramic:L,titanium:se,solar:de,glass:G,signal:Y,blueSignal:Q});Me.forEach(e=>w.add(e)),v.domElement.dataset.fleet=[`station`,...l.map(e=>e.kind)].join(`,`);let Ne=Me.map(()=>{let e=A(new ce);e.setAttribute(`position`,new z(new Float32Array(144),3).setUsage(ie));let t=new Float32Array(144);for(let e=0;e<48;e++){let n=(1-e/48)**2;t.set([n*.35,n*.65,n],e*3)}e.setAttribute(`color`,new z(t,3));let n=new m(e,j(new p({vertexColors:!0,transparent:!0,opacity:.32,blending:2,depthWrite:!1})));return n.name=`flight-wake`,n.frustumCulled=!1,w.add(n),{line:n,g:e}}),Pe=A(new S(.04,8,6)),Fe=u.map(e=>{let t=r(e.angle,5.55),n=new N(Pe,Y);return n.position.set(t.x,t.y,t.z),w.add(n),n}),Ie=Fe.map(()=>({x:0,y:0}));function Le(e,t,n){q=Math.max(1,e),J=Math.max(1,t),X=o(q,J,n),v.setPixelRatio(X.dpr),v.setSize(q,J,!1),C.aspect=q/J,C.updateProjectionMatrix(),ye.resize(X,J),Ce.uPixels.value=J*X.dpr*1.37,X.bloom&&!R&&(R=new me(v,new O(q,J,{type:W,samples:4})),R.addPass(new he(b,C)),U=new _e(new B(q,J),.2,.5,1.4),R.addPass(U),ue=new ve,R.addPass(ue)),R?.setPixelRatio(X.dpr),R?.setSize(q,J),re.forEach(e=>{if(!(e instanceof _))return;let t=!X.bloom;!!e.defines.GALAXY_DIRECT!==t&&(t?e.defines.GALAXY_DIRECT=1:delete e.defines.GALAXY_DIRECT,e.needsUpdate=!0)})}function Re({time:e,pointerX:r,pointerY:o,still:u}){let f=c(e,u),p=d(q,J),m=p*(1+(1-f.approach)*1.3),h=.57+.1*f.approach;C.fov=40,C.position.set(r*.32*f.approach,m*h+o*.2,m*Math.sqrt(1-h*h)),pe.set(0,0,0),C.lookAt(pe),C.setViewOffset(q,J,X.compact?0:-q*.16*f.title,X.compact?J*.045:0,q,J),C.updateMatrixWorld(),E.visible=f.galaxy>0,v.domElement.dataset.diskVisible=String(E.visible),v.domElement.dataset.entryTime=e.toFixed(3),v.domElement.dataset.zoom=(m/p).toFixed(3),w.rotation.z=-.13-.17*(1-f.approach),ye.update(u?s:e),Ce.uTime.value=e;let g=-1.15+e*.065;return T.position.set(Math.cos(g)*2.5,.9,Math.sin(g)*2),T.scale.setScalar(.43*(u?1:t(e+i.stationLead,0).scale)),T.rotation.set(.08,e*.075,-.05),T.visible=f.station>0,Me.forEach((r,i)=>{let o=n(e,i,u),c=t(u?s:e,i);r.visible=c.age>0,r.position.set(o.x,o.y,o.z),r.rotation.set(o.pitch,o.yaw,-.04*Math.sin(e*.3+i)),r.scale.setScalar(l[i].scale*c.scale);let d=Ne[i],f=u?s:e,p=a(f,i);d.line.visible=p.count>1,d.g.setDrawRange(0,p.count);let m=d.g.attributes.position;for(let e=0;e<p.count;e++){let t=n(f-e/47*p.duration,i);m.setXYZ(e,t.x,t.y,t.z)}m.needsUpdate=!0}),Fe.forEach((e,t)=>e.scale.setScalar(f.services[t])),w.updateMatrixWorld(!0),Fe.forEach((e,t)=>{e.getWorldPosition(Z),Z.project(C),Ie[t].x=(Z.x*.5+.5)*100,Ie[t].y=(-Z.y*.5+.5)*100}),v.info.reset(),R&&X.bloom?R.render():v.render(b,C),v.domElement.dataset.drawCalls=String(v.info.render.calls),v.domElement.dataset.triangles=String(v.info.render.triangles),v.domElement.dataset.quality=X.bloom?`bloom`:`compact`,v.domElement.dataset.starInstances=String(X.stars),v.domElement.dataset.visibleCraft=String(Me.filter(e=>e.visible).length),{phase:f,labels:Ie}}return f.appendChild(v.domElement),Le(f.clientWidth,f.clientHeight,devicePixelRatio),{canvas:v.domElement,draw:Re,resize:Le,dispose:ge}}catch(e){throw ge(),e}}export{Ae as createGalaxyScene};