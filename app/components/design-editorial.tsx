'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { createSceneFrameLoop, settleSceneValue } from '@/lib/scene-frame-loop';
import bakeryUrl from '@/app/assets/design-showcase/design-bakery.webp?url';
import beautyUrl from '@/app/assets/design-showcase/design-beauty.webp?url';
import livingUrl from '@/app/assets/design-showcase/design-living.webp?url';
import designerUrl from '@/app/assets/people-motion/designer-rhythm-v4.webp?url';
import PersonMotion from './person-motion';

const studies = [
  {
    image: bakeryUrl,
    title: '모닝오븐',
    type: '카페·베이커리 브랜딩',
    label: '카페·베이커리 브랜딩',
    short: 'F&B',
    alt: '모닝오븐 베이커리의 붉은 메뉴 포스터와 같은 로고를 적용한 테이크아웃 포장·커피컵 디자인 시안',
  },
  {
    image: beautyUrl,
    title: '온결',
    type: '뷰티 패키지·제품 콘텐츠',
    label: '뷰티 브랜드 디자인',
    short: 'BEAUTY',
    alt: '온결 보습크림의 제품 패키지와 제형을 보여주는 파란 제품 콘텐츠·캠페인 디자인 시안',
  },
  {
    image: livingUrl,
    title: '루움',
    type: '리빙 상품·커머스 디자인',
    label: '리빙 브랜드 커머스 디자인',
    short: 'LIVING',
    alt: '루움 침구의 침실 사용 장면과 원단 질감, 패키지 슬리브를 함께 보여주는 커머스 디자인 시안',
  },
] as const;

export default function DesignEditorial({
  active,
  paused,
  covered,
}: {
  active: boolean;
  paused: boolean;
  covered: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const controls = useRef({ active, paused, covered });
  const refresh = useRef<(() => void) | null>(null);
  const [selection, setSelection] = useState({ index: 0, previous: -1 });
  const [failed, setFailed] = useState<number[]>([]);
  const select = useCallback((index: number) => {
    setSelection((current) =>
      current.index === index ? current : { index, previous: current.index },
    );
  }, []);

  useEffect(() => {
    controls.current = { active, paused, covered };
    refresh.current?.();
  }, [active, paused, covered]);

  useEffect(() => {
    const section = sectionRef.current,
      stage = stageRef.current;
    if (!section || !stage) return;
    const pages = section.closest<HTMLElement>('.site-pages');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    let inView = false,
      entered = false,
      disposed = false;
    let x = 0,
      y = 0,
      progress = 0,
      targetX = 0,
      targetY = 0,
      targetProgress = 0;
    const allowed = () =>
      !disposed &&
      inView &&
      controls.current.active &&
      !controls.current.covered &&
      !document.hidden &&
      !pages?.inert;
    const loop = createSceneFrameLoop(draw, { canRun: allowed });

    function draw(delta: number) {
      if (reduced.matches || controls.current.paused) return false;
      const factor = 1 - Math.exp(-10 * Math.max(delta, 1 / 120));
      x = settleSceneValue(x, targetX, factor);
      y = settleSceneValue(y, targetY, factor);
      progress = settleSceneValue(progress, targetProgress, factor);
      stage!.style.setProperty('--proof-y', `${-9 + progress * 8 + x * 2}deg`);
      stage!.style.setProperty('--proof-x', `${2 + y * 1.2}deg`);
      stage!.style.setProperty('--proof-z', `${3 - progress * 6 + x * 0.5}deg`);
      const settling =
        x !== targetX || y !== targetY || progress !== targetProgress;
      section!.dataset.motion = settling ? 'settling' : 'idle';
      return settling;
    }

    function update() {
      const top =
        document.getElementById('design')?.getBoundingClientRect().top ?? 0;
      const travel = Math.max(1, section!.offsetHeight - stage!.offsetHeight);
      targetProgress = Math.max(0, Math.min(1, -top / travel));
      if (controls.current.active && !reduced.matches)
        select(Math.min(studies.length - 1, Math.floor(targetProgress * studies.length)));
      const canPlay = allowed();
      if (!controls.current.active) {
        entered = false;
        select(0);
      } else if (canPlay && top < innerHeight * 0.5) entered = true;
      section!.dataset.entered = String(entered);
      section!.dataset.playing = String(
        canPlay && !controls.current.paused && !reduced.matches,
      );
      section!.dataset.still = String(
        controls.current.paused || reduced.matches,
      );
      if (!canPlay || controls.current.paused || reduced.matches) {
        loop.suspend();
        section!.dataset.motion = 'idle';
      } else loop.invalidate();
    }

    function move(event: PointerEvent) {
      if (
        !fine.matches ||
        event.pointerType === 'touch' ||
        !allowed() ||
        controls.current.paused ||
        reduced.matches
      )
        return;
      const box = stage!.getBoundingClientRect();
      targetX = Math.max(
        -1,
        Math.min(
          1,
          ((event.clientX - box.left) / Math.max(1, stage!.clientWidth)) * 2 -
            1,
        ),
      );
      targetY = Math.max(
        -1,
        Math.min(
          1,
          ((event.clientY - box.top) / Math.max(1, stage!.clientHeight)) * 2 -
            1,
        ),
      );
      loop.invalidate();
    }
    function leave() {
      targetX = 0;
      targetY = 0;
      if (allowed()) loop.invalidate();
    }
    const view = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    view.observe(stage);
    const sizes = new ResizeObserver(update);
    sizes.observe(stage);
    sizes.observe(section);
    const lock = new MutationObserver(update);
    if (pages)
      lock.observe(pages, { attributes: true, attributeFilter: ['inert'] });
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    document.addEventListener('visibilitychange', update);
    stage.addEventListener('pointermove', move, { passive: true });
    stage.addEventListener('pointerleave', leave);
    reduced.addEventListener('change', update);
    section.dataset.enhanced = 'true';
    refresh.current = update;
    update();
    return () => {
      disposed = true;
      refresh.current = null;
      loop.dispose();
      view.disconnect();
      sizes.disconnect();
      lock.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      document.removeEventListener('visibilitychange', update);
      stage.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerleave', leave);
      reduced.removeEventListener('change', update);
      delete section.dataset.enhanced;
    };
  }, [select]);

  function choose(index: number) {
    select(index);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = sectionRef.current,
      stage = stageRef.current,
      anchor = document.getElementById('design');
    if (!section || !stage || !anchor) return;
    const travel = Math.max(0, section.offsetHeight - stage.offsetHeight);
    // The stage stays in place. Moving to the selected study also keeps the
    // following native scroll in sync, without wheel or touch interception.
    scrollTo({
      top:
        scrollY +
        anchor.getBoundingClientRect().top +
        (travel * index) / studies.length +
        (index ? 2 : 0),
      behavior: 'instant',
    });
  }

  const current = studies[selection.index];
  return (
    <section
      className="design-edit"
      ref={sectionRef}
      aria-labelledby="design-editorial-heading"
      data-study={selection.index}
    >
      <div className="design-edit-stage" ref={stageRef}>
        <header className="design-masthead">
          <span>
            ON&amp;OFF <span className="design-masthead-divider">/</span> DESIGN
            DEPARTMENT
          </span>
          <span>
            CREATIVE EDITION <b>03</b>
          </span>
        </header>
        <div className="design-spread">
          <div className="design-story">
            <div className="design-story-top">
              <p className="design-eyebrow">DESIGN THAT SELLS</p>
              <h2 id="design-editorial-heading" aria-label="DESIGN">
                <span className="design-title-line" aria-hidden="true">
                  DE<span className="design-type-arrow">↗</span>
                </span>
                <span className="design-title-line" aria-hidden="true">
                  SIGN
                </span>
              </h2>
              <p className="design-statement">
                눈길을 사로잡고
                <br />
                구매로 이어지게
              </p>
            </div>
            <PersonMotion className="design-person" kind="dance" src={designerUrl} active={active} paused={paused} covered={covered} />
            <div className="design-index">
              <div className="design-index-top">
                <span>THE DESIGN INDEX</span>
                <Button
                  type="button"
                  variant="ghost"
                  className="design-next"
                  onClick={() => choose((selection.index + 1) % studies.length)}
                  aria-label="다음 디자인 작업물"
                >
                  NEXT <span aria-hidden="true">↗</span>
                </Button>
              </div>
              <div className="design-pickers" aria-label="디자인 작업물 선택">
                {studies.map((study, index) => (
                  <Button
                    key={study.title}
                    type="button"
                    variant="ghost"
                    className="design-picker"
                    aria-label={`${study.label} 보기`}
                    aria-pressed={selection.index === index}
                    aria-controls="design-proof"
                    onClick={() => choose(index)}
                  >
                    <span className="design-picker-image">
                      <Image
                        src={study.image}
                        alt=""
                        width={80}
                        height={100}
                        loading="lazy"
                        unoptimized
                      />
                    </span>
                    <span className="design-picker-label">
                      <b>0{index + 1}</b> {study.short}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="design-visual">
            <div className="design-proof-wrap">
              <span className="design-proof-label">
                CONCEPT PORTFOLIO / 0{selection.index + 1}
              </span>
              <div className="design-proof" id="design-proof">
                {studies.map((study, index) => (
                  <figure
                    className="design-art-layer"
                    key={study.title}
                    data-current={selection.index === index}
                    data-previous={selection.previous === index}
                    data-failed={failed.includes(index)}
                    aria-hidden={selection.index !== index}
                  >
                    <Image
                      className="design-art-image"
                      src={study.image}
                      alt={study.alt}
                      width={720}
                      height={900}
                      loading="lazy"
                      unoptimized
                      onError={() =>
                        setFailed((items) =>
                          items.includes(index) ? items : [...items, index],
                        )
                      }
                    />
                    {[0, 1, 2, 3, 4].map((strip) => (
                      <span
                        key={strip}
                        className="design-art-strip"
                        aria-hidden="true"
                        style={
                          {
                            '--strip': strip,
                            backgroundImage: `url("${study.image}")`,
                            clipPath: `inset(0 ${80 - strip * 20}% 0 ${strip * 20}%)`,
                          } as CSSProperties
                        }
                      />
                    ))}
                    {failed.includes(index) && (
                      <span className="design-image-error">
                        {study.title}
                        <br />
                        이미지를 불러오지 못했습니다
                      </span>
                    )}
                  </figure>
                ))}
              </div>
              <div
                className="design-proof-caption"
                aria-live="polite"
                aria-atomic="true"
              >
                <b>{current.title}</b>
                <span>{current.type}</span>
              </div>
            </div>
            <span className="design-proof-side" aria-hidden="true">
              BRAND, CONTENT &amp; COMMERCE.
            </span>
          </div>
        </div>
        <footer className="design-colophon">
          <span>BRAND · CONTENT · COMMERCE</span>
          <span>가상 브랜드 디자인 시안</span>
          <span className="design-page-count">
            0{selection.index + 1} <i>/</i> 0{studies.length}
          </span>
        </footer>
      </div>
    </section>
  );
}
