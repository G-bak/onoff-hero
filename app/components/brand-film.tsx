'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createWebFilmPlayback } from '@/lib/web-film-playback';
import { useSceneActivity } from './use-scene-activity';
import filmUrl from '@/app/assets/brand-film/onf-cinematic-intro.mp4?url';
import posterUrl from '@/app/assets/brand-film/onf-cinematic-poster.png?url';
import captionsUrl from '@/app/assets/brand-film/brand-film-ko.vtt?url';

export default function BrandFilm({ active, paused, onReadyChange }: { active: boolean; paused: boolean; onReadyChange: (ready: boolean) => void }) {
  const host = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playback = useRef<ReturnType<typeof createWebFilmPlayback> | null>(null);
  const firstFrame = useRef<number | null>(null);
  const { visible, motion, reduced } = useSceneActivity(host, { active, paused, covered: false, duringTransition: true });
  const [ready, setReady] = useState(false);
  const [requested, setRequested] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [delayed, setDelayed] = useState(false);
  const shouldPlay = visible && !paused && (!reduced || requested);
  const displayReady = ready || (visible && (reduced || paused));

  useEffect(() => { onReadyChange(displayReady); }, [displayReady, onReadyChange]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (host.current) host.current.dataset.enhanced = 'true';
    const controller = createWebFilmPlayback(video, value => {
      setBlocked(value);
      if (value) setReady(true); // A blocked autoplay still offers readable content and a play button.
    });
    playback.current = controller;
    return () => {
      controller.dispose(); playback.current = null;
      if (firstFrame.current !== null) video.cancelVideoFrameCallback(firstFrame.current);
    };
  }, []);
  useEffect(() => { playback.current?.setEnabled(shouldPlay && !failed); }, [shouldPlay, failed]);
  useEffect(() => {
    if (visible && displayReady && host.current) host.current.dataset.entered = 'true';
  }, [visible, displayReady]);
  useEffect(() => {
    if (!visible || displayReady) return;
    const timer = window.setTimeout(() => setDelayed(true), 10000);
    return () => window.clearTimeout(timer);
  }, [visible, displayReady]);

  function onPlaying() {
    setBlocked(false); setBuffering(false);
    const video = videoRef.current;
    if (ready || !video) return;
    if (typeof video.requestVideoFrameCallback === 'function') {
      if (firstFrame.current !== null) video.cancelVideoFrameCallback(firstFrame.current);
      firstFrame.current = video.requestVideoFrameCallback(() => { firstFrame.current = null; setReady(true); });
    } else setReady(true);
  }
  function requestPlay() {
    if (paused) return;
    setRequested(true); playback.current?.play();
  }
  function retry() {
    if (paused) return;
    playback.current?.stop(); setFailed(false); setBlocked(false); setDelayed(false);
    setRequested(true);
    videoRef.current?.load(); playback.current?.play();
  }

  return <section className="brand-film" ref={host} aria-labelledby="brand-film-heading"
    data-ready={displayReady} data-entered="false" data-motion={motion} data-still={reduced || paused}>
    <video className="brand-film-video" ref={videoRef} src={filmUrl} poster={visible || ready ? posterUrl : undefined}
      width={1920} height={1080} muted loop playsInline preload={active ? 'auto' : 'none'}
      aria-label="온앤오프 로고와 빛의 움직임을 담은 5초 브랜드 영상"
      onPlaying={onPlaying}
      onWaiting={() => setBuffering(true)} onCanPlay={() => setBuffering(false)}
      onError={() => { setFailed(true); setReady(true); setBuffering(false); }}>
      <track kind="captions" src={captionsUrl} srcLang="ko" label="영상 화면 문구" />
      처음부터 결과까지, 고객과 한 팀으로. ON&OFF 브랜드 영상입니다.
    </video>
    <noscript><video className="brand-film-video brand-film-no-script-video" src={filmUrl} poster={posterUrl} width={1920} height={1080} muted loop playsInline preload="none" aria-label="온앤오프 브랜드 영상"><track kind="captions" src={captionsUrl} srcLang="ko" label="영상 화면 문구" /></video><style>{'.brand-film-video:not(.brand-film-no-script-video){display:none!important}'}</style></noscript>
    <div className="brand-film-shade" aria-hidden="true" />
    <header className="brand-film-edition"><span>ON&OFF / MOTION IDENTITY</span><span>07 / BRAND FILM</span></header>
    <output className="brand-film-loading" aria-live="polite">
      <span className="brand-film-loading-mark" aria-hidden="true">ON&OFF</span><i aria-hidden="true" />
      <span>{delayed ? '영상 준비가 지연되고 있어요' : '영상을 준비하고 있어요'}</span>
      {delayed && <Button className="brand-film-retry" variant="ghost" onClick={retry} disabled={paused}><RotateCcw aria-hidden="true"/> 다시 시도</Button>}
    </output>
    <div className="brand-film-copy">
      <p className="brand-film-kicker"><span aria-hidden="true"/> ONE TEAM. ON.</p>
      <h2 id="brand-film-heading" aria-label="FROM START TO RESULTS.">
        <span className="brand-film-line"><span>FROM START</span></span>
        <span className="brand-film-line"><span>TO <span className="brand-film-result" data-text="RESULTS." aria-label="RESULTS.">RESULTS.</span></span></span>
      </h2>
      <p className="brand-film-caption">처음부터 결과까지,<br className="brand-film-mobile-break"/> 고객과 한 팀으로.</p>
    </div>
    <footer className="brand-film-footer">
      <div className="brand-film-playback-state" aria-live="polite">
        {failed ? <><span>영상을 불러오지 못했어요</span><Button className="brand-film-retry" variant="ghost" onClick={retry} disabled={paused}><RotateCcw aria-hidden="true"/> 다시 시도</Button></>
          : blocked || (visible && reduced && !requested) ? <Button className="brand-film-retry" variant="ghost" onClick={requestPlay} disabled={paused}><Play aria-hidden="true"/> 눌러서 영상 재생</Button>
          : buffering && shouldPlay && ready ? <span>영상을 불러오고 있어요</span> : null}
      </div>
    </footer>
    <noscript><style>{'.brand-film-loading{display:none!important}.brand-film[data-ready="false"] .brand-film-video,.brand-film[data-ready="false"] .brand-film-copy{visibility:visible;opacity:1}.brand-film .brand-film-line>span,.brand-film .brand-film-caption{transform:none!important;opacity:1!important}'}</style></noscript>
  </section>;
}
