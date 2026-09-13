'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX, RotateCcw } from 'lucide-react';
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
  const [playing, setPlaying] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [requested, setRequested] = useState(false);
  const [muted, setMuted] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [delayed, setDelayed] = useState(false);
  const shouldPlay = visible && !paused && !manualPaused && (!reduced || requested);
  const displayReady = ready || (visible && (reduced || paused));

  useEffect(() => { onReadyChange(displayReady); }, [displayReady, onReadyChange]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (host.current) host.current.dataset.enhanced = 'true';
    video.controls = false;
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
    setPlaying(true); setBlocked(false); setBuffering(false);
    const video = videoRef.current;
    if (ready || !video) return;
    if (typeof video.requestVideoFrameCallback === 'function') {
      if (firstFrame.current !== null) video.cancelVideoFrameCallback(firstFrame.current);
      firstFrame.current = video.requestVideoFrameCallback(() => { firstFrame.current = null; setReady(true); });
    } else setReady(true);
  }
  function togglePlay() {
    if (playing) { playback.current?.stop(); setManualPaused(true); }
    else { setManualPaused(false); setRequested(true); playback.current?.play(); }
  }
  function retry() {
    playback.current?.stop(); setFailed(false); setBlocked(false); setDelayed(false);
    setManualPaused(false); setRequested(true);
    videoRef.current?.load(); playback.current?.play();
  }

  return <section className="brand-film" ref={host} aria-labelledby="brand-film-heading"
    data-ready={displayReady} data-entered="false" data-motion={motion} data-still={reduced || paused}>
    <video className="brand-film-video" ref={videoRef} src={filmUrl} poster={visible || ready ? posterUrl : undefined}
      width={1920} height={1080} muted={muted} loop playsInline preload={active ? 'auto' : 'none'} controls
      aria-label="온앤오프 로고와 빛의 움직임을 담은 5초 브랜드 영상"
      onPlaying={onPlaying} onPause={() => setPlaying(false)}
      onWaiting={() => setBuffering(true)} onCanPlay={() => setBuffering(false)}
      onTimeUpdate={event => {
        const video = event.currentTarget;
        host.current?.style.setProperty('--film-progress', String(video.duration > 0 ? video.currentTime / video.duration : 0));
      }}
      onError={() => { setFailed(true); setReady(true); setBuffering(false); setPlaying(false); }}>
      <track kind="captions" src={captionsUrl} srcLang="ko" label="영상 화면 문구" />
      처음부터 결과까지, 고객과 한 팀으로. ON&OFF 브랜드 영상입니다.
    </video>
    <noscript><video className="brand-film-video brand-film-no-script-video" src={filmUrl} poster={posterUrl} width={1920} height={1080} muted loop playsInline preload="none" controls aria-label="온앤오프 브랜드 영상"><track kind="captions" src={captionsUrl} srcLang="ko" label="영상 화면 문구" /></video><style>{'.brand-film-video:not(.brand-film-no-script-video){display:none!important}'}</style></noscript>
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
      <div className="brand-film-controls">
        <Button type="button" className="brand-film-control" variant="ghost" onClick={togglePlay} disabled={paused || failed}
          aria-label={playing ? '브랜드 영상 일시 정지' : '브랜드 영상 재생'}>
          {playing ? <Pause aria-hidden="true"/> : <Play aria-hidden="true"/>}
        </Button>
        <Button type="button" className="brand-film-control" variant="ghost" onClick={() => setMuted(value => !value)}
          aria-label={muted ? '브랜드 영상 소리 켜기' : '브랜드 영상 음소거'} aria-pressed={!muted}>
          {muted ? <VolumeX aria-hidden="true"/> : <Volume2 aria-hidden="true"/>}
        </Button>
        <span className="brand-film-playback-label">{paused ? 'MOTION OFF' : playing ? 'NOW PLAYING' : 'BRAND FILM'}</span>
        <span className="brand-film-length" aria-hidden="true">00:05 / LOOP</span>
      </div>
      <div className="brand-film-playback-state" aria-live="polite">
        {failed ? <><span>영상을 불러오지 못했어요</span><Button className="brand-film-retry" variant="ghost" onClick={retry} disabled={paused}><RotateCcw aria-hidden="true"/> 다시 시도</Button></>
          : blocked ? <Button className="brand-film-retry" variant="ghost" onClick={togglePlay} disabled={paused}><Play aria-hidden="true"/> 눌러서 영상 재생</Button>
          : buffering && shouldPlay && ready ? <span>영상을 불러오고 있어요</span> : null}
      </div>
      <div className="brand-film-timeline" aria-hidden="true"><span/></div>
    </footer>
    <noscript><style>{'.brand-film-loading{display:none!important}.brand-film[data-ready="false"] .brand-film-video,.brand-film[data-ready="false"] .brand-film-copy{visibility:visible;opacity:1}.brand-film .brand-film-line>span,.brand-film .brand-film-caption{transform:none!important;opacity:1!important}.brand-film-controls{display:none!important}'}</style></noscript>
  </section>;
}
