import Image from 'next/image';
import { instagramCampaign as feed, blogCampaign as blog } from '@/lib/marketing-content';

export default function MarketingFallback({ instagramUrl, blogUrl, posterUrl }: { instagramUrl: string; blogUrl: string; posterUrl: string }) {
  return <div className="card-showcase-fallback" aria-hidden="true">
    <article className="marketing-fallback-card marketing-instagram">
      <div className="marketing-fallback-content">
        <header><b>{feed.account}</b><span>광고 ···</span></header>
        <Image src={instagramUrl} alt="" width={720} height={900} loading="lazy" unoptimized />
        <p className="marketing-feed-cta">더 알아보기 ›</p>
        <p>♡　♧　➤ <span>♧</span></p><p><b>{feed.likes}</b></p>
        <p><b>{feed.account}</b><br />{feed.caption.join(' ')}</p>
        <p>{feed.tags}</p><p>{feed.comments}</p><p>{feed.comment}</p>
      </div>
    </article>
    <article className="marketing-fallback-card marketing-blog">
      <div className="marketing-fallback-content">
        <header><b>N blog</b><span>글 목록</span></header>
        <p>{blog.name}</p><h3>{blog.title.join(' ')}</h3><p>{blog.meta}</p>
        <Image src={blogUrl} alt="" width={720} height={900} loading="lazy" unoptimized />
        <p>{blog.intro.join(' ')}</p>
        {blog.sections.map(part => <div key={part.title}><h4>{part.title}</h4><p>{part.lines.join(' ')}</p></div>)}
        <p>{blog.closing.join(' ')}</p><footer>{blog.footer}</footer>
      </div>
    </article>
    <article className="marketing-fallback-card marketing-poster">
      <Image src={posterUrl} alt="" width={848} height={1060} loading="lazy" unoptimized />
    </article>
  </div>;
}
