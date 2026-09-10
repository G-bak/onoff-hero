'use client';

import { useEffect, useRef, useState } from 'react';
import type * as THREE from 'three';
import { team } from '@/lib/team';
import { sceneOrbit } from '@/lib/scene-orbit';
import { createSceneFrameLoop, settleSceneValue } from '@/lib/scene-frame-loop';
import { getSceneIssue, SceneLoadError, startSceneLoadingClock, type SceneIssue } from '@/lib/scene-loading';
import { loadCardFonts } from '@/lib/scene-fonts';
import { createSceneRecovery, observeSceneContext, type SceneRecoveryStatus } from '@/lib/scene-recovery';
import teamAtlasUrl from '@/app/assets/generated/team-atlas.webp?url';

export default function CardRibbon({ paused, active = true, direction, enabled, onTogglePause, onSettled, onProgress, onElapsed, onError, onRecoveryChange }: {
  paused: boolean;
  active?: boolean;
  direction: 1 | -1;
  enabled: boolean;
  onTogglePause: () => void;
  onSettled: (status: 'ready') => void;
  onProgress: (value: number) => void;
  onElapsed: (seconds: number) => void;
  onError: (issue: SceneIssue) => void;
  onRecoveryChange: (status: SceneRecoveryStatus) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rearContainerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  const activeRef = useRef(active);
  const syncVisibilityRef = useRef<() => void>(() => {});
  const directionRef = useRef(direction);
  const inertiaRef = useRef(0);
  const requestRenderRef = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);
  // Reset before committing the fallback, so enabling again cannot reveal a
  // stale ready state while the previous WebGL resources have been disposed.
  if (!enabled && ready) setReady(false);
  useEffect(() => {
    activeRef.current = active;
    syncVisibilityRef.current();
  }, [active]);
  useEffect(() => {
    pausedRef.current = paused;
    requestRenderRef.current();
  }, [paused]);
  useEffect(() => {
    directionRef.current = direction;
    inertiaRef.current = 0;
    requestRenderRef.current();
  }, [direction]);

  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    const rearContainer = rearContainerRef.current;
    if (!container || !rearContainer) return;
    let stopped = false;
    let settled = false;
    let frameLoop: ReturnType<typeof createSceneFrameLoop> | undefined;
    let resetInteraction = () => {};
    let revealFrame = 0;
    let phase: 'assets' | 'graphics' = 'assets';
    const requests = new AbortController();
    let renderer: THREE.WebGLRenderer | undefined;
    let rearRenderer: THREE.WebGLRenderer | undefined;
    const disposables: { dispose: () => void }[] = [];
    const removeListeners: (() => void)[] = [];
    let completedUnits = 0;
    // Engine, image, fonts, each card texture, then the first painted frame.
    const totalUnits = team.length + 4;
    onProgress(0);
    onElapsed(0);

    function finishLoadingUnit() {
      if (stopped || settled) return;
      completedUnits += 1;
      onProgress(Math.round(completedUnits / totalUnits * 100));
    }

    function releaseResources() {
      recovery.dispose();
      requests.abort();
      frameLoop?.dispose();
      requestRenderRef.current = () => {};
      syncVisibilityRef.current = () => {};
      cancelAnimationFrame(revealFrame);
      resetInteraction();
      removeListeners.splice(0).forEach(remove => remove());
      disposables.splice(0).forEach(resource => resource.dispose());
      renderer?.dispose();
      if (renderer && !renderer.getContext().isContextLost()) renderer.forceContextLoss();
      renderer?.domElement.remove();
      renderer = undefined;
      rearRenderer?.dispose();
      if (rearRenderer && !rearRenderer.getContext().isContextLost()) rearRenderer.forceContextLoss();
      rearRenderer?.domElement.remove();
      rearRenderer = undefined;
    }

    function showError(error: unknown) {
      if (stopped) return;
      const wasSettled = settled;
      stopped = true;
      settled = true;
      stopStartupClock();
      releaseResources();
      setReady(false);
      if (wasSettled) onRecoveryChange('fallback');
      else onError(getSceneIssue(error, phase, navigator.onLine));
      console.warn('The 3D scene could not be rendered.', error);
    }

    const stopStartupClock = startSceneLoadingClock(onElapsed, () => showError(new SceneLoadError('timeout')));
    const recovery = createSceneRecovery({
      visible: !document.hidden && activeRef.current,
      onResume: () => frameLoop?.invalidate(),
      onChange: status => {
        if (stopped) return;
        if (status === 'fallback') {
          stopped = true;
          stopStartupClock();
          releaseResources();
        } else if (status === 'recovering') {
          frameLoop?.suspend();
          cancelAnimationFrame(revealFrame);
          revealFrame = 0;
          resetInteraction();
          // Drop the old GPU generation while the context is still lost.
          // Three can upload these CPU-backed geometries/materials/textures again.
          // Waiting until after restoration leaves disposal listeners holding
          // invalid buffers from the previous context generation.
          try { disposables.forEach(resource => resource.dispose()); }
          catch (error) { showError(error); return; }
        }
        setReady(status === 'ready');
        onRecoveryChange(status);
      },
    });

    function checkContexts() {
      if (renderer?.getContext().isContextLost()) recovery.lose('front');
      if (rearRenderer?.getContext().isContextLost()) recovery.lose('rear');
      return !stopped && recovery.canRender();
    }

    function scheduleInitialReveal() {
      if (settled || revealFrame || stopped) return;
      setReady(true);
      // Keep the startup loader until the healthy pair has reached a paint.
      revealFrame = requestAnimationFrame(() => {
        revealFrame = requestAnimationFrame(() => {
          revealFrame = 0;
          if (!checkContexts()) return;
          finishLoadingUnit();
          settled = true;
          stopStartupClock();
          onSettled('ready');
        });
      });
    }

    async function initialize() {
      const atlas = new Image();
      async function loadAtlas() {
        const response = await fetch(teamAtlasUrl, { signal: requests.signal });
        if (!response.ok) throw new SceneLoadError('server');
        const blob = await response.blob();
        if (stopped) return;
        const url = URL.createObjectURL(blob);
        removeListeners.push(() => URL.revokeObjectURL(url));
        atlas.src = url;
        try { await atlas.decode(); } catch { throw new SceneLoadError('asset'); }
        finishLoadingUnit();
      }
      // Start these together; card textures need both the atlas and loaded glyphs.
      const [Three] = await Promise.all([
        import('three').then(module => { finishLoadingUnit(); return module; }),
        loadAtlas(),
        loadCardFonts(document.fonts, team).then(finishLoadingUnit),
      ]);
      if (stopped || !container || !rearContainer) return;
      phase = 'graphics';

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
      removeListeners.push(observeSceneContext(renderer.domElement, 'front', recovery));
      removeListeners.push(observeSceneContext(rearRenderer.domElement, 'rear', recovery));
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

      // Remove the 98px header band; keep the remaining artwork at its original scale.
      const cardTextureHeight = 782;
      function createCardTexture(member: typeof team[number]) {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = cardTextureHeight;
        const ctx = canvas.getContext('2d')!;
        const paper = '#edf0f2';
        const ink = '#333333';
        const muted = '#657581';
        const accent = '#343CFF';
        ctx.beginPath();
        ctx.roundRect(0, 0, 640, cardTextureHeight, 13);
        ctx.clip();
        ctx.fillStyle = paper;
        ctx.fillRect(0, 0, 640, cardTextureHeight);
        ctx.textBaseline = 'top';
        ctx.fillStyle = accent;
        ctx.font = '400 22px Inter, Arial';
        ctx.fillText(member.category, 30, 30);
        ctx.fillStyle = ink;
        ctx.font = '500 58px Inter, "Pretendard Variable", "Malgun Gothic", sans-serif';
        ctx.fillText(member.displayName ?? member.role, 28, 74);
        ctx.font = '400 19px Inter, "Pretendard Variable", "Malgun Gothic", sans-serif';
        ctx.fillText(member.line, 30, 156);
        ctx.fillStyle = muted;
        ctx.font = '400 12px Inter, Arial';
        ctx.fillText('CHARACTER EDITION', 30, 200);

        // The backdrop bends with the card; the cutout overlaps its lower edge.
        ctx.fillStyle = '#c5cbd1';
        ctx.beginPath();
        ctx.roundRect(214, 256, 366, 416, 26);
        ctx.fill();
        const sourceWidth = atlas.naturalWidth / 3;
        const sourceHeight = atlas.naturalHeight / 2;
        const sourceX = member.visual % 3 * sourceWidth;
        const sourceY = Math.floor(member.visual / 3) * sourceHeight;
        // Match the supplied layout: a small figure at the lower right.
        // Draw the full transparent cell, including shoes, props and plinth.
        const portraitHeight = 386;
        const portraitWidth = portraitHeight * sourceWidth / sourceHeight;
        const portraitLeft = 340;
        const portraitTop = 364;
        ctx.drawImage(atlas, sourceX, sourceY, sourceWidth, sourceHeight, portraitLeft, portraitTop, portraitWidth, portraitHeight);
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(586, 746); ctx.lineTo(602, 730); ctx.moveTo(587, 730); ctx.lineTo(602, 730); ctx.lineTo(602, 745); ctx.stroke();
        const texture = new Three.CanvasTexture(canvas);
        texture.colorSpace = Three.SRGBColorSpace;
        texture.anisotropy = Math.min(renderer!.capabilities.getMaxAnisotropy(), 8);
        disposables.push(texture);
        return texture;
      }

      const radius = sceneOrbit.radius;
      const cardHeight = 2.96 * cardTextureHeight / 880;
      // Anchor the top edge so the content and bottom edge rise as the row collapses.
      const cardOffsetY = (2.96 - cardHeight) / 2;
      const arcWidth = Math.PI * 2 / team.length - .19;
      team.forEach((member, index) => {
        const geometry = new Three.PlaneGeometry(1, cardHeight, 40, 8);
        const position = geometry.attributes.position;
        const uv = geometry.attributes.uv;
        const centerAngle = index * Math.PI * 2 / team.length;
        for (let i = 0; i < position.count; i++) {
          const angle = centerAngle + (uv.getX(i) - .5) * arcWidth;
          position.setXYZ(i, Math.sin(angle) * radius, position.getY(i) + cardOffsetY, Math.cos(angle) * radius);
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
      let activePointerId: number | null = null;
      resetInteraction = () => {
        pointerDown = false;
        pointerX = 0;
        pointerY = 0;
        inertiaRef.current = 0;
        container.classList.remove('is-dragging');
        if (activePointerId !== null && container.hasPointerCapture(activePointerId)) container.releasePointerCapture(activePointerId);
        activePointerId = null;
      };
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

      const draw = (dt: number) => {
        if (!renderer || !rearRenderer || !checkContexts()) return false;
        const playing = !pausedRef.current && !reducedMotion.matches;
        if (!pointerDown && playing) {
          targetAngle += dt * sceneOrbit.angularSpeed * directionRef.current;
          targetAngle += inertiaRef.current;
          inertiaRef.current *= Math.exp(-dt * 5);
        }
        angle = settleSceneValue(angle, targetAngle, 1 - Math.exp(-dt * 9));
        ribbon.rotation.y = angle;
        let tiltMoving = false;
        if (!reducedMotion.matches) {
          const targetX = restingTilt.x + pointerY * .09;
          const targetZ = restingTilt.z - pointerX * .035;
          tilt.rotation.x = settleSceneValue(tilt.rotation.x, targetX, .035);
          tilt.rotation.z = settleSceneValue(tilt.rotation.z, targetZ, .035);
          tiltMoving = tilt.rotation.x !== targetX || tilt.rotation.z !== targetZ;
        }
        rearRenderer.render(scene, camera);
        renderer.render(scene, camera);
        if (!checkContexts()) return false;
        recovery.painted();
        scheduleInitialReveal();
        // Manual input still eases to its target while automatic rotation is OFF.
        return (playing && !pointerDown) || angle !== targetAngle || tiltMoving;
      };
      const renderFrame = (dt: number) => {
        try { return draw(dt); }
        catch (error) { showError(error); return false; }
      };
      frameLoop = createSceneFrameLoop(renderFrame, { canRun: () => !stopped && !document.hidden && (!settled || activeRef.current) && recovery.canRender() });
      const requestRender = frameLoop.invalidate;
      requestRenderRef.current = requestRender;

      const resize = () => {
        if (stopped || !renderer || !rearRenderer) return;
        try {
          // Size the renderers from layout, not the enclosing page's rotation.
          const width = container.clientWidth;
          const height = container.clientHeight;
          if (width <= 0 || height <= 0) return;
          renderer.setSize(width, height);
          rearRenderer.setSize(width, height);
          camera.aspect = width / height;
          camera.position.z = window.innerWidth <= 700 ? sceneOrbit.mobileCameraDistance : sceneOrbit.cameraDistance;
          camera.updateProjectionMatrix();
          requestRender();
        } catch (error) { showError(error); }
      };
      const observer = new ResizeObserver(resize);
      observer.observe(container);
      removeListeners.push(() => observer.disconnect());
      resize();
      if (stopped) return;

      const onDown = (event: PointerEvent) => {
        if (event.button !== 0 || !recovery.canRender()) return;
        pointerDown = true;
        activePointerId = event.pointerId;
        lastX = event.clientX;
        inertiaRef.current = 0;
        container.classList.add('is-dragging');
        container.setPointerCapture(event.pointerId);
        requestRender();
      };
      const onMove = (event: PointerEvent) => {
        if (!recovery.canRender()) return;
        const bounds = container.getBoundingClientRect();
        pointerX = (event.clientX - bounds.left) / bounds.width - .5;
        pointerY = (event.clientY - bounds.top) / bounds.height - .5;
        if (pointerDown) {
          inertiaRef.current = (event.clientX - lastX) * .004;
          targetAngle += inertiaRef.current;
          lastX = event.clientX;
        }
        requestRender();
      };
      const onUp = () => { pointerDown = false; activePointerId = null; container.classList.remove('is-dragging'); requestRender(); };
      const onLeave = () => { pointerX = 0; pointerY = 0; requestRender(); };
      const onKey = (event: KeyboardEvent) => {
        if (!recovery.canRender()) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          targetAngle += event.key === 'ArrowLeft' ? -.38 : .38;
          requestRender();
        }
      };
      container.addEventListener('pointerdown', onDown);
      container.addEventListener('pointermove', onMove);
      container.addEventListener('pointerup', onUp);
      container.addEventListener('pointercancel', onUp);
      container.addEventListener('lostpointercapture', onUp);
      container.addEventListener('pointerleave', onLeave);
      container.addEventListener('keydown', onKey);
      const onVisibilityChange = () => {
        const visible = !document.hidden && activeRef.current;
        recovery.setVisible(visible);
        if (document.hidden || (!visible && settled)) frameLoop?.suspend();
        else requestRender();
      };
      syncVisibilityRef.current = onVisibilityChange;
      document.addEventListener('visibilitychange', onVisibilityChange);
      reducedMotion.addEventListener('change', requestRender);
      removeListeners.push(() => {
        container.removeEventListener('pointerdown', onDown);
        container.removeEventListener('pointermove', onMove);
        container.removeEventListener('pointerup', onUp);
        container.removeEventListener('pointercancel', onUp);
        container.removeEventListener('lostpointercapture', onUp);
        container.removeEventListener('pointerleave', onLeave);
        container.removeEventListener('keydown', onKey);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        reducedMotion.removeEventListener('change', requestRender);
      });

      renderFrame(0);
      requestRender();
    }

    initialize().catch(showError);
    return () => {
      stopped = true;
      stopStartupClock();
      releaseResources();
    };
  }, [enabled, onSettled, onProgress, onElapsed, onError, onRecoveryChange]);

  return (
    <>
    <div ref={rearContainerRef} className={`ribbon-stage ribbon-back${ready ? ' is-ready' : ''}`} aria-hidden="true"/>
    <div ref={containerRef} className={`ribbon-stage${ready ? ' is-ready' : ''}`} tabIndex={enabled && ready ? 0 : -1} role="group" aria-label={ready ? 'ON&OFF의 회전하는 미니어처 팀 캐릭터 카드. 드래그 또는 좌우 방향키로 회전하고 스페이스 키로 일시정지할 수 있습니다.' : 'ON&OFF의 기본 팀 카드'} onKeyDown={event => { if (enabled && ready && event.key === ' ') { event.preventDefault(); onTogglePause(); } }}>
      <div className="ribbon-fallback" aria-hidden="true">
        {team.slice(0, 3).map(member => (
          <div className="fallback-card" key={member.visual}>
            <span className="fallback-category">{member.category}</span>
            <span className="fallback-role">{member.displayName ?? member.role}</span>
            <span className="fallback-description">{member.line}</span>
            <span className="fallback-edition">CHARACTER EDITION</span>
            <span className="fallback-backdrop"/>
            <span className="fallback-visual" style={{ backgroundImage: `url("${teamAtlasUrl}")`, backgroundPosition: `${member.visual % 3 * 50}% ${Math.floor(member.visual / 3) * 100}%` }}/>
            <span className="fallback-arrow">↗</span>
          </div>
        ))}
      </div>
      <p className="sr-only">전략 기획, 크리에이티브 디렉션, 디자인, 영상 제작, 개발, 미디어 기획을 표현하는 여섯 미니어처 캐릭터입니다. 실제 직원 이름과 외모를 반영하기 전의 직무별 캐릭터 구성입니다.</p>
    </div>
    </>
  );
}
