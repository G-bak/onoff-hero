'use client';

import { useEffect, useRef, useState } from 'react';
import type * as THREE from 'three';
import { team } from '@/lib/team';
import { sceneOrbit } from '@/lib/scene-orbit';

export default function CardRibbon({ paused, direction, onTogglePause, onSettled, onProgress }: { paused: boolean; direction: 1 | -1; onTogglePause: () => void; onSettled: (status: 'ready' | 'fallback') => void; onProgress: (value: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rearContainerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  const directionRef = useRef(direction);
  const inertiaRef = useRef(0);
  const [ready, setReady] = useState(false);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => {
    directionRef.current = direction;
    inertiaRef.current = 0;
  }, [direction]);

  useEffect(() => {
    const container = containerRef.current;
    const rearContainer = rearContainerRef.current;
    if (!container || !rearContainer) return;
    let stopped = false;
    let settled = false;
    let frame = 0;
    let revealFrame = 0;
    let renderer: THREE.WebGLRenderer | undefined;
    let rearRenderer: THREE.WebGLRenderer | undefined;
    const disposables: { dispose: () => void }[] = [];
    const removeListeners: (() => void)[] = [];
    let completedUnits = 0;
    // Engine, image, fonts, each card texture, then the first painted frame.
    const totalUnits = team.length + 4;
    onProgress(0);

    function finishLoadingUnit() {
      if (stopped || settled) return;
      completedUnits += 1;
      onProgress(Math.round(completedUnits / totalUnits * 100));
    }

    function releaseResources() {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(revealFrame);
      removeListeners.splice(0).forEach(remove => remove());
      disposables.splice(0).forEach(resource => resource.dispose());
      renderer?.dispose();
      renderer?.domElement.remove();
      renderer = undefined;
      rearRenderer?.dispose();
      rearRenderer?.domElement.remove();
      rearRenderer = undefined;
    }

    function showFallback(error: unknown) {
      if (stopped || settled) return;
      stopped = true;
      settled = true;
      window.clearTimeout(startupTimeout);
      releaseResources();
      setReady(false);
      onSettled('fallback');
      console.warn('The 3D scene is unavailable; showing team characters.', error);
    }

    // A stalled asset or WebGL initialization must not block the whole website.
    const startupTimeout = window.setTimeout(() => showFallback(new Error('Scene loading timed out.')), 20000);

    async function initialize() {
      const atlas = new Image();
      atlas.fetchPriority = 'high';
      atlas.src = '/images/team-miniatures.png';
      // Start these together; card textures need both the atlas and loaded glyphs.
      const [Three] = await Promise.all([
        import('three').then(module => { finishLoadingUnit(); return module; }),
        atlas.decode().then(finishLoadingUnit),
        Promise.all([
          document.fonts.load('500 47px "Pretendard Variable"', team.map(member => `${member.role} ${member.line}`).join(' ')),
          document.fonts.load('600 24px Inter', 'ON&OFF TEAM'),
          document.fonts.load('400 19px Inter', 'CHARACTER EDITION'),
          document.fonts.ready,
        ]).then(finishLoadingUnit),
      ]);
      if (stopped || !container || !rearContainer) return;

      // Split the same 3D scene at z=0, where the flat HTML wordmark sits.
      // Clipping uses each fragment's world position, including the orbit's tilt.
      function createDepthRenderer(host: HTMLDivElement, side: 1 | -1) {
        const instance = new Three.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        instance.setClearColor(0x000000, 0);
        instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        instance.outputColorSpace = Three.SRGBColorSpace;
        instance.clippingPlanes = [new Three.Plane(new Three.Vector3(0, 0, side), 0)];
        host.appendChild(instance.domElement);
        return instance;
      }
      renderer = createDepthRenderer(container, 1);
      rearRenderer = createDepthRenderer(rearContainer, -1);
      const scene = new Three.Scene();
      const camera = new Three.PerspectiveCamera(35, 1, .1, 50);
      camera.position.set(0, 0, sceneOrbit.cameraDistance);
      const tilt = new Three.Group();
      // The original ON&OFF composition slopes gently down to the right.
      const restingTilt = sceneOrbit.tilt;
      tilt.rotation.set(restingTilt.x, restingTilt.y, restingTilt.z);
      scene.add(tilt);
      const ribbon = new Three.Group();
      tilt.add(ribbon);

      function createCardTexture(member: typeof team[number]) {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 880;
        const ctx = canvas.getContext('2d')!;
        const paper = '#edf0f2';
        const ink = '#1d2b34';
        const muted = '#657581';
        const accent = '#3854ed';
        ctx.beginPath();
        ctx.roundRect(0, 0, 640, 880, 13);
        ctx.clip();
        ctx.fillStyle = paper;
        ctx.fillRect(0, 0, 640, 880);
        ctx.textBaseline = 'top';
        ctx.fillStyle = ink;
        ctx.font = '600 24px Inter, Arial';
        ctx.fillText('ON&OFF', 30, 29);
        ctx.font = '400 14px Inter, Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`TEAM / 0${member.visual + 1}`, 608, 34);
        ctx.textAlign = 'left';
        ctx.strokeStyle = '#19232630';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(30, 78); ctx.lineTo(610, 78); ctx.stroke();
        ctx.fillStyle = accent;
        ctx.font = '400 15px Inter, Arial';
        ctx.fillText(member.category, 30, 108);
        ctx.fillStyle = ink;
        ctx.font = '500 47px Inter, "Pretendard Variable", "Malgun Gothic", sans-serif';
        ctx.fillText(member.displayName ?? member.role, 28, 141);
        const sourceWidth = atlas.naturalWidth / 3;
        const sourceHeight = atlas.naturalHeight / 2;
        const sourceX = member.visual % 3 * sourceWidth;
        const sourceY = Math.floor(member.visual / 3) * sourceHeight;
        // Contain the whole cell so the miniature's head, props and plinth stay visible.
        const portraitHeight = 546;
        const portraitWidth = portraitHeight * sourceWidth / sourceHeight;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect((640 - portraitWidth) / 2, 207, portraitWidth, portraitHeight, 8);
        ctx.clip();
        ctx.drawImage(atlas, sourceX, sourceY, sourceWidth, sourceHeight, (640 - portraitWidth) / 2, 207, portraitWidth, portraitHeight);
        ctx.restore();
        ctx.fillStyle = ink;
        ctx.font = '400 19px Inter, "Pretendard Variable", "Malgun Gothic", sans-serif';
        ctx.fillText(member.line, 30, 778);
        ctx.fillStyle = muted;
        ctx.font = '400 12px Inter, Arial';
        ctx.fillText('CHARACTER EDITION', 30, 834);
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(586, 844); ctx.lineTo(602, 828); ctx.moveTo(587, 828); ctx.lineTo(602, 828); ctx.lineTo(602, 843); ctx.stroke();
        const texture = new Three.CanvasTexture(canvas);
        texture.colorSpace = Three.SRGBColorSpace;
        texture.anisotropy = Math.min(renderer!.capabilities.getMaxAnisotropy(), 8);
        disposables.push(texture);
        return texture;
      }

      const radius = sceneOrbit.radius;
      const cardHeight = 2.96;
      const arcWidth = Math.PI * 2 / team.length - .19;
      team.forEach((member, index) => {
        const geometry = new Three.PlaneGeometry(1, cardHeight, 40, 8);
        const position = geometry.attributes.position;
        const uv = geometry.attributes.uv;
        const centerAngle = index * Math.PI * 2 / team.length;
        for (let i = 0; i < position.count; i++) {
          const angle = centerAngle + (uv.getX(i) - .5) * arcWidth;
          position.setXYZ(i, Math.sin(angle) * radius, position.getY(i), Math.cos(angle) * radius);
        }
        position.needsUpdate = true;
        geometry.computeVertexNormals();
        geometry.computeBoundingSphere();
        const texture = createCardTexture(member);
        const front = new Three.MeshBasicMaterial({ map: texture, side: Three.FrontSide, alphaTest: .15 });
        const back = new Three.MeshBasicMaterial({ color: '#88989c', side: Three.BackSide, transparent: true, opacity: .12, depthWrite: false });
        ribbon.add(new Three.Mesh(geometry, front));
        ribbon.add(new Three.Mesh(geometry, back));
        disposables.push(geometry, front, back);
        finishLoadingUnit();
      });

      let angle = .14;
      let targetAngle = angle;
      let pointerDown = false;
      let lastX = 0;
      let pointerX = 0;
      let pointerY = 0;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const resize = () => {
        if (!renderer || !rearRenderer) return;
        const { width, height } = container.getBoundingClientRect();
        renderer.setSize(width, height);
        rearRenderer.setSize(width, height);
        camera.aspect = width / height;
        camera.position.z = window.innerWidth <= 700 ? sceneOrbit.mobileCameraDistance : sceneOrbit.cameraDistance;
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(container);
      removeListeners.push(() => observer.disconnect());
      resize();

      const onDown = (event: PointerEvent) => {
        if (event.button !== 0) return;
        pointerDown = true;
        lastX = event.clientX;
        inertiaRef.current = 0;
        container.classList.add('is-dragging');
        container.setPointerCapture(event.pointerId);
      };
      const onMove = (event: PointerEvent) => {
        const bounds = container.getBoundingClientRect();
        pointerX = (event.clientX - bounds.left) / bounds.width - .5;
        pointerY = (event.clientY - bounds.top) / bounds.height - .5;
        if (pointerDown) {
          inertiaRef.current = (event.clientX - lastX) * .004;
          targetAngle += inertiaRef.current;
          lastX = event.clientX;
        }
      };
      const onUp = () => { pointerDown = false; container.classList.remove('is-dragging'); };
      const onLeave = () => { pointerX = 0; pointerY = 0; };
      const onKey = (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          targetAngle += event.key === 'ArrowLeft' ? -.38 : .38;
        }
      };
      container.addEventListener('pointerdown', onDown);
      container.addEventListener('pointermove', onMove);
      container.addEventListener('pointerup', onUp);
      container.addEventListener('pointercancel', onUp);
      container.addEventListener('pointerleave', onLeave);
      container.addEventListener('keydown', onKey);
      removeListeners.push(() => {
        container.removeEventListener('pointerdown', onDown);
        container.removeEventListener('pointermove', onMove);
        container.removeEventListener('pointerup', onUp);
        container.removeEventListener('pointercancel', onUp);
        container.removeEventListener('pointerleave', onLeave);
        container.removeEventListener('keydown', onKey);
      });

      let lastTime = performance.now();
      const animate = (time: number) => {
        if (stopped || !renderer || !rearRenderer) return;
        const dt = Math.min((time - lastTime) / 1000, .05);
        lastTime = time;
        if (!document.hidden) {
          const playing = !pausedRef.current && !reducedMotion.matches;
          if (!pointerDown && playing) {
            targetAngle += dt * sceneOrbit.angularSpeed * directionRef.current;
            targetAngle += inertiaRef.current;
            inertiaRef.current *= Math.exp(-dt * 5);
          }
          angle += (targetAngle - angle) * (1 - Math.exp(-dt * 9));
          ribbon.rotation.y = angle;
          if (!reducedMotion.matches) {
            tilt.rotation.x += (restingTilt.x + pointerY * .09 - tilt.rotation.x) * .035;
            tilt.rotation.z += (restingTilt.z - pointerX * .035 - tilt.rotation.z) * .035;
          }
          rearRenderer.render(scene, camera);
          renderer.render(scene, camera);
        }
        frame = requestAnimationFrame(animate);
      };
      rearRenderer.render(scene, camera);
      renderer.render(scene, camera);
      setReady(true);
      frame = requestAnimationFrame(animate);
      // Let both canvases paint before revealing the page, rather than just
      // waiting for asset downloads or a fixed presentation delay.
      revealFrame = requestAnimationFrame(() => {
        revealFrame = requestAnimationFrame(() => {
          if (stopped) return;
          finishLoadingUnit();
          settled = true;
          window.clearTimeout(startupTimeout);
          onSettled('ready');
        });
      });
    }

    initialize().catch(showFallback);
    return () => {
      stopped = true;
      window.clearTimeout(startupTimeout);
      releaseResources();
    };
  }, [onSettled, onProgress]);

  return (
    <>
    <div ref={rearContainerRef} className={`ribbon-stage ribbon-back${ready ? ' is-ready' : ''}`} aria-hidden="true"/>
    <div ref={containerRef} className={`ribbon-stage${ready ? ' is-ready' : ''}`} tabIndex={0} role="group" aria-label="ON&OFF의 회전하는 미니어처 팀 캐릭터 카드. 드래그 또는 좌우 방향키로 회전하고 스페이스 키로 일시정지할 수 있습니다." onKeyDown={event => { if (event.key === ' ') { event.preventDefault(); onTogglePause(); } }}>
      <div className="ribbon-fallback" aria-hidden="true">
        {team.slice(0, 3).map((member, i) => <div className="fallback-card" key={i}><span className="fallback-meta"><span>ON&OFF</span><span>0{i + 1}</span></span><span>{member.displayName ?? member.role}</span><span className="fallback-visual"/></div>)}
      </div>
      <p className="sr-only">전략 기획, 크리에이티브 디렉션, 디자인, 영상 제작, 개발, 미디어 기획을 표현하는 여섯 미니어처 캐릭터입니다. 실제 직원 이름과 외모를 반영하기 전의 직무별 캐릭터 구성입니다.</p>
    </div>
    </>
  );
}
