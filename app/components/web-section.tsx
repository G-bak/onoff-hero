'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PersonMotion from './person-motion';
import { useSceneActivity } from './use-scene-activity';
import { createWebFilmPlayback } from '@/lib/web-film-playback';
import filmUrl from '@/app/assets/web-showcase/onoff-web-film.mp4?url';
import posterUrl from '@/app/assets/web-showcase/web-film-poster.webp?url';
import captionsUrl from '@/app/assets/web-showcase/web-film-ko.vtt?url';
import developerUrl from '@/app/assets/people-motion/web-writer-v5.webp?url';

const chapters = [
  { time: 0, label: '웹의 시작' },
  { time: 4, label: '구조 설계' },
  { time: 7, label: '디자인 기능' },
  { time: 10, label: '맞춤 제작' },
  { time: 13, label: '검색 운영' },
] as const;
const timeLabel = (seconds: number) => `00:${String(Math.floor(seconds)).padStart(2, '0')}`;

export default function WebSection({ active, paused, covered }: {
  active: boolean; paused: boolean; covered: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playback = useRef<ReturnType<typeof createWebFilmPlayback> | null>(null);
  const { visible, motion, reduced } = useSceneActivity(sectionRef, { active, paused, covered });
  const [manualPaused, setManualPaused] = useState(false);
  const [requested, setRequested] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [failed, setFailed] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(15.04);
  const shouldPlay = visible && !paused && !manualPaused && (!reduced || requested);
  const currentChapter = chapters.reduce((current, chapter, index) => time >= chapter.time ? index : current, 0);

  useEffect(() => {
    if (sectionRef.current) sectionRef.current.dataset.enhanced = 'true';
    const video = videoRef.current;
    if (!video) return;
    video.controls = false;
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

  function togglePlay() {
    if (paused) return;
    if (playing) { playback.current?.stop(); setManualPaused(true); }
    else {
      setBlocked(false);
      setManualPaused(false);
      setRequested(true);
      playback.current?.play();
    }
  }
  function seek(seconds: number) {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = Math.min(seconds, video.duration);
    setTime(video.currentTime);
  }
  function retry() {
    if (paused) return;
    playback.current?.stop();
    setFailed(false);
    setBlocked(false);
    setManualPaused(false);
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
        <h2 id="web-heading">WEB<span className="web-heading-arrow" aria-hidden="true">↗</span></h2>
        <p className="web-heading-copy"><span>고객 문의로 이어지는</span><span>우리 회사 홈페이지</span></p>
      </div>
      <div className="web-screen-layout">
        <figure className="web-player" aria-label="온앤오프 웹사이트 제작 소개 영상">
          <div className="web-video-frame" data-action-needed={failed || blocked}>
            <video className="web-video" ref={videoRef} src={filmUrl} poster={posterUrl}
              width={1280} height={720} muted={muted} loop playsInline preload="none"
              controls aria-label="웹사이트 기획, 설계, 디자인, 맞춤 제작과 운영을 소개하는 15초 영상"
              onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
              onLoadedMetadata={event => {
                const length = event.currentTarget.duration;
                if (Number.isFinite(length)) setDuration(length);
              }}
              onPlaying={() => { setPlaying(true); setBuffering(false); setBlocked(false); }}
              onPause={() => setPlaying(false)}
              onWaiting={() => setBuffering(true)}
              onCanPlay={() => setBuffering(false)}
              onError={() => { setFailed(true); setBuffering(false); setPlaying(false); }}>
              <track kind="captions" src={captionsUrl} srcLang="ko" label="한국어 화면 내용" />
              브라우저에서 영상을 지원하지 않습니다. 웹사이트 기획부터 디자인, 제작, 운영까지 온앤오프가 함께합니다.
            </video>
            {failed ? (
              <div className="web-video-state" data-state="error">
                <span>영상을 불러오지 못했습니다</span>
                <Button className="web-control-button" variant="ghost" onClick={retry} disabled={paused}>다시 재생 <Play aria-hidden="true" /></Button>
              </div>
            ) : blocked ? (
              <div className="web-video-state" data-state="blocked">
                <Button className="web-control-button" variant="ghost" onClick={togglePlay} disabled={paused}>영상 재생 <Play aria-hidden="true" /></Button>
              </div>
            ) : buffering && shouldPlay && (
              <div className="web-video-state"><span className="web-buffer-dot" aria-hidden="true" /> 영상을 준비하고 있습니다</div>
            )}
          </div>
          <>
            <div className="web-controls">
              <Button type="button" className="web-control-button web-play" variant="ghost" onClick={togglePlay}
                disabled={paused || failed} aria-label={playing ? '영상 일시 정지' : '영상 재생'}>
                {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
              </Button>
              <span className="web-time" aria-hidden="true">{timeLabel(time)}<span className="web-duration"> / {timeLabel(duration)}</span></span>
              <input type="range" className="web-seek" aria-label="영상 재생 위치" min={0} max={duration} step={.1}
                value={time} aria-valuetext={`${timeLabel(time)} / ${timeLabel(duration)}`}
                style={{ '--playhead': `${time / duration * 100}%` } as CSSProperties}
                onChange={event => seek(Number(event.target.value))} disabled={failed} />
              <Button type="button" className="web-control-button" variant="ghost" onClick={() => setMuted(value => !value)}
                aria-label={muted ? '영상 소리 켜기' : '영상 소리 끄기'} aria-pressed={!muted}>
                {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
                <span className="web-sound-label">SOUND {muted ? 'OFF' : 'ON'}</span>
              </Button>
            </div>
            <div className="web-chapters" aria-label="영상 장면 선택">
              {chapters.map((chapter, index) => <Button key={chapter.time} type="button" variant="ghost"
                className="web-chapter" aria-current={currentChapter === index ? 'true' : undefined}
                onClick={() => seek(chapter.time)} disabled={failed}>
                <span>{timeLabel(chapter.time)}</span><span>{chapter.label}</span>
              </Button>)}
            </div>
          </>
          <figcaption className="sr-only">기획부터 디자인·기능 구현, 업종별 맞춤 제작, 검색과 운영까지. 영상 속 한글 설명과 배경 음악이 함께 재생됩니다.</figcaption>
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
        <a href="#card">NEXT / MARKETING <span aria-hidden="true">↗</span></a>
      </footer>
    </section>
  );
}
