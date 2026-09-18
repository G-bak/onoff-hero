'use client';

import Link from './page-link';

import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PersonMotion from './person-motion';
import { useSceneActivity } from './use-scene-activity';
import { createWebFilmPlayback } from '@/lib/web-film-playback';
import filmUrl from '@/app/assets/web-showcase/onoff-web-film.mp4?url';
import posterUrl from '@/app/assets/web-showcase/web-film-poster.webp?url';
import captionsUrl from '@/app/assets/web-showcase/web-film-ko.vtt?url';
import developerUrl from '@/app/assets/people-motion/web-writer-v5.webp?url';

export default function WebSection({ active, paused, covered }: {
  active: boolean; paused: boolean; covered: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playback = useRef<ReturnType<typeof createWebFilmPlayback> | null>(null);
  const { visible, motion, reduced } = useSceneActivity(sectionRef, { active, paused, covered });
  const [requested, setRequested] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [failed, setFailed] = useState(false);
  const shouldPlay = visible && !paused && (!reduced || requested);

  useEffect(() => {
    if (sectionRef.current) sectionRef.current.dataset.enhanced = 'true';
    const video = videoRef.current;
    if (!video) return;
    const controller = createWebFilmPlayback(video, setBlocked);
    playback.current = controller;
    return () => { controller.dispose(); playback.current = null; };
  }, []);
  useEffect(() => {
    if (visible && sectionRef.current) sectionRef.current.dataset.entered = 'true';
  }, [visible]);
  useEffect(() => {
    playback.current?.setEnabled(shouldPlay && !failed);
  }, [shouldPlay, failed]);

  function requestPlay() {
    if (paused) return;
    setBlocked(false);
    setRequested(true);
    playback.current?.play();
  }
  function retry() {
    if (paused) return;
    playback.current?.stop();
    setFailed(false);
    setBlocked(false);
    setRequested(true);
    videoRef.current?.load();
    playback.current?.play();
  }

  return (
    <section className="web-cinema" aria-labelledby="web-heading" ref={sectionRef}
      data-playing={motion} data-still={reduced || paused}>
      <header className="web-masthead">
        <span><i className="web-live-dot" aria-hidden="true" /> ON&amp;OFF / WEB DEVELOPMENT</span>
        <span>04 / WEB</span>
      </header>
      <div className="web-heading-row">
        <h2 id="web-heading">WEB</h2>
        <p className="web-heading-copy"><span>고객 문의로 이어지는</span><span>우리 회사 홈페이지</span></p>
      </div>
      <div className="web-screen-layout">
        <figure className="web-player" aria-label="온앤오프 웹사이트 제작 소개 영상">
          <div className="web-video-frame" data-action-needed={failed || blocked}>
            <video className="web-video" ref={videoRef} src={filmUrl} poster={posterUrl}
              width={1280} height={720} muted loop playsInline preload="none"
              aria-label="웹사이트 기획, 설계, 디자인, 맞춤 제작과 운영을 소개하는 15초 영상"
              onPlaying={() => { setBuffering(false); setBlocked(false); }}
              onWaiting={() => setBuffering(true)}
              onCanPlay={() => setBuffering(false)}
              onError={() => { setFailed(true); setBuffering(false); }}>
              <track kind="captions" src={captionsUrl} srcLang="ko" label="한국어 화면 내용" />
              브라우저에서 영상을 지원하지 않습니다. 웹사이트 기획부터 디자인, 제작, 운영까지 온앤오프가 함께합니다.
            </video>
            {failed ? (
              <div className="web-video-state" data-state="error">
                <span>영상을 불러오지 못했습니다</span>
                <Button className="web-control-button" variant="ghost" onClick={retry} disabled={paused}>다시 재생 <Play aria-hidden="true" /></Button>
              </div>
            ) : blocked || (visible && reduced && !requested) ? (
              <div className="web-video-state" data-state="blocked">
                <Button className="web-control-button" variant="ghost" onClick={requestPlay} disabled={paused}>영상 재생 <Play aria-hidden="true" /></Button>
              </div>
            ) : buffering && shouldPlay && (
              <div className="web-video-state"><span className="web-buffer-dot" aria-hidden="true" /> 영상을 준비하고 있습니다</div>
            )}
          </div>
          <figcaption className="sr-only">기획부터 디자인·기능 구현, 업종별 맞춤 제작, 검색과 운영까지 소개하는 영상입니다.</figcaption>
        </figure>
        <aside className="web-side-note" aria-label="웹사이트 제작">
          <p className="web-film-index">THE WEB FILM<b>15″</b></p>
          <p>업종에 맞게 기획하고<br />필요한 기능을 만듭니다</p>
          <PersonMotion className="web-person" kind="writing" src={developerUrl} active={active} paused={paused} covered={covered} />
          <span className="web-side-caption">BUILD &amp; SUPPORT<span>제작부터 유지보수까지</span></span>
        </aside>
      </div>
      <footer className="web-footer">
        <p>기획 · UI/UX · 웹사이트 제작 · 운영</p>
        <Link href="/" data-scroll-target="card" prefetch={false}>NEXT / MARKETING <span aria-hidden="true">↗</span></Link>
      </footer>
    </section>
  );
}
