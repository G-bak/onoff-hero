import Image from 'next/image';
import bakery from '@/app/assets/design-showcase/design-bakery.webp?url';
import beauty from '@/app/assets/design-showcase/design-beauty.webp?url';
import living from '@/app/assets/design-showcase/design-living.webp?url';
import web from '@/app/assets/web-showcase/web-film-poster.webp?url';
import campaign from '@/app/assets/marketing/poster-installed.webp?url';

const visuals = [
  { image: bakery, back: beauty, word: 'PLAN', tags: ['TARGET', 'MESSAGE', 'ACTION'] },
  { image: beauty, back: living, word: 'FORM', tags: ['IDENTITY', 'CONTENT', 'DESIGN'] },
  { image: web, back: living, word: 'BUILD', tags: ['WEB', 'MOBILE', 'EXPERIENCE'] },
  { image: campaign, back: bakery, word: 'REACH', tags: ['CONTENT', 'CHANNEL', 'CAMPAIGN'] },
  { image: web, back: beauty, word: 'KEEP', tags: ['UPDATE', 'CHECK', 'IMPROVE'] },
] as const;

export default function ServiceArtwork({ index, eager = false }: { index: number; eager?: boolean }) {
  const visual = visuals[index];
  return <div className="service-artwork" data-art={index} aria-hidden="true">
    <div className="service-art-orbit"/><span className="service-art-cross">✳</span>
    <div className="service-art-back"><Image src={visual.back} alt="" width={720} height={900} unoptimized loading={eager ? 'eager' : 'lazy'}/><span>ON&OFF / CREATIVE FILE</span></div>
    <div className="service-art-sheet"><span className="service-art-imprint">ON&OFF STUDIO <b>0{index + 1}</b></span><Image src={visual.image} alt="" width={720} height={900} unoptimized loading={eager ? 'eager' : 'lazy'} /><span className="service-art-word">{visual.word}</span></div>
    <div className="service-art-ticket"><span>THINK. MAKE. CONNECT.</span><strong>{visual.tags[0]}<br/>{visual.tags[1]}</strong><span className="service-art-ticket-rule"/><span>{visual.tags[2]} / ON</span></div>
    <span className="service-art-seal">ALL<br/>IN ONE</span>
    {index === 4 && <div className="service-art-checks"><span>✓ CONTENT UPDATE</span><span>✓ WEBSITE CHECK</span><span>✓ ONGOING SUPPORT</span></div>}
  </div>;
}
