import ServiceExampleImage from './service-example-image';
import OperationsServiceScope from './operations-service-scope';
import type { ProfessionalServiceSlug } from '@/lib/service-details';
import { instagramCampaign } from '@/lib/marketing-content';

const workExamples = [
  { image: 'bakery', name: '모닝오븐', type: 'F&B / 매장·패키지', text: '매장 포스터부터 컵과 포장까지, 같은 로고와 컬러로 매장을 기억하게 합니다.' },
  { image: 'beauty', name: '온결', type: 'BEAUTY / 제품·홍보물', text: '제품의 특징과 사용감을 중심으로 패키지와 홍보 이미지의 인상을 맞춥니다.' },
  { image: 'living', name: '루움', type: 'LIVING / 상품·콘텐츠', text: '제품이 사용되는 공간을 보여주고, 고객이 확인할 정보를 읽기 쉽게 배치합니다.' },
] as const;

function InstagramPreview({ hero = false }: { hero?: boolean }) {
  return <div className="guide-feed-preview"><div className="guide-feed-account"><span aria-hidden="true">온</span><div><strong>{instagramCampaign.account}</strong><small>광고 · 제작 예시</small></div><span aria-hidden="true">···</span></div><ServiceExampleImage image="instagram" width={720} height={900} alt="온결 보습크림 인스타그램 광고 소재 시안" unoptimized loading={hero ? 'eager' : 'lazy'} fetchPriority={hero ? 'high' : 'auto'}/><div className="guide-feed-body"><div className="guide-feed-icons" aria-hidden="true"><svg viewBox="0 0 90 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21C-9 9 3-2 12 5C21-2 33 9 12 21ZM37 5Q50-2 54 9Q57 20 43 20L36 23L38 16Q31 9 37 5ZM66 3H86L74 22L72 10ZM72 10L86 3"/></svg><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 3H19V22L12 17L5 22Z"/></svg></div><strong>{instagramCampaign.likes}</strong><p>{instagramCampaign.caption.join(' ')}</p><span>{instagramCampaign.tags}</span><small>{instagramCampaign.comments}</small></div></div>;
}

export function DetailHeroVisual({ slug }: { slug: ProfessionalServiceSlug }) {
  if (slug === 'planning') return <figure className="service-hero-art guide-hero-visual guide-brief">
    <div className="guide-brief-sheet"><div className="guide-sheet-meta"><span>ON&OFF / STRATEGY</span><span>BRIEF 01</span></div><p className="guide-brief-title">누구에게,<br/>무엇을,<br/><span>어떻게.</span></p><div className="guide-brief-fields"><span>TARGET<strong>우리의 핵심 고객</strong></span><span>MESSAGE<strong>선택해야 할 이유</strong></span><span>ACTION<strong>채널과 실행 순서</strong></span></div><span className="guide-brief-stamp" aria-hidden="true">PLAN<br/>TO DO</span></div>
    <figcaption>기획서 구성 예시 / PROJECT BRIEF</figcaption>
  </figure>;
  if (slug === 'design') return <figure className="service-hero-art guide-hero-visual guide-design-cover">
    <div className="guide-design-cover-images"><ServiceExampleImage image="bakery" width={720} height={900} alt="가상 베이커리 모닝오븐의 포스터·컵·패키지 디자인 시안" unoptimized loading="eager" fetchPriority="high"/><ServiceExampleImage image="beauty" width={720} height={900} alt="가상 뷰티 브랜드 온결의 패키지와 홍보 이미지 시안" unoptimized loading="eager"/><span className="guide-cover-ticket">BRAND<br/>IN USE.<small>로고에서 실제 사용처까지</small></span></div>
    <figcaption>가상 브랜드 제작 예시 · 실제 고객 실적이 아닙니다</figcaption>
  </figure>;
  if (slug === 'marketing') return <figure className="service-hero-art guide-hero-visual guide-media-cover">
    <div className="guide-media-cover-images"><ServiceExampleImage image="poster" width={848} height={1060} alt="매장 입구에 설치한 모닝오븐 행사 광고 시안" unoptimized loading="eager"/><div className="guide-media-feed"><InstagramPreview hero/></div><span className="guide-media-label">CONTENT<br/>+ CHANNEL</span></div>
    <figcaption>가상 브랜드 제작 예시 · 반응 수치도 예시입니다</figcaption>
  </figure>;
  return <figure className="service-hero-art guide-hero-visual guide-care-cover">
    <div className="guide-care-window"><div className="guide-sheet-meta"><span>ON&OFF / CARE DESK</span><span>업무 흐름 예시</span></div><p className="guide-care-title">바뀐 내용은<br/>제때 반영되도록.</p><div className="guide-care-request"><span>수정 요청</span><strong>상품 소개 이미지 교체</strong><p>기존 페이지의 이미지와 안내 문구 변경</p></div><ol className="guide-care-flow"><li><span>01</span>접수</li><li><span>02</span>범위 확인</li><li><span>03</span>수정</li><li><span>04</span>검수</li></ol><div className="guide-care-result"><span aria-hidden="true">↳</span><div><strong>변경 내역까지 함께 전달</strong><span>요청한 내용과 반영 결과를 확인합니다</span></div></div></div>
    <figcaption>관리 업무 안내용 예시 · 실제 접수 화면이 아닙니다</figcaption>
  </figure>;
}

export function ServiceExamples({ slug }: { slug: ProfessionalServiceSlug }) {
  if (slug === 'planning') return <div className="guide-strategy-example" data-service-reveal>
    <div className="guide-example-intro"><span className="guide-eyebrow">A PLAN YOU CAN USE</span><h3>“매장을 알리고 싶어요”를<br/>구체적인 실행안으로</h3><p>예를 들어, 동네 베이커리의 점심 신메뉴를 알린다면 이렇게 질문을 좁혀갑니다.</p><span className="guide-example-note">이해를 돕기 위한 가상 기획 예시입니다.</span></div>
    <ol className="guide-strategy-map"><li><span>01 / CUSTOMER</span><h4>가까운 직장인</h4><p>점심 메뉴를 빠르게 고르려는 고객</p></li><li><span>02 / MESSAGE</span><h4>점심 메뉴 고민 끝</h4><p>샌드위치와 커피를 함께 소개</p></li><li><span>03 / CHANNEL</span><h4>매장 앞 + 지역 SNS</h4><p>방문 경로에 맞춘 안내물과 게시물</p></li><li><span>04 / ACTION</span><h4>메뉴 확인 → 방문</h4><p>메뉴·운영 시간·위치를 함께 안내</p></li></ol>
  </div>;
  if (slug === 'design') return <div className="guide-portfolio">
    <div className="guide-example-top" data-service-reveal><span className="guide-eyebrow">DESIGNED FOR REAL USE</span><p>가상 브랜드 제작 예시 / 실제 고객 실적이 아닙니다</p></div>
    <div className="guide-portfolio-grid">{workExamples.map((item, index) => <figure key={item.name} data-service-reveal><div className="guide-portfolio-image"><ServiceExampleImage image={item.image} width={720} height={900} alt={`${item.name} ${item.type} 디자인 시안`} unoptimized loading="lazy" decoding="async"/><span>0{index + 1}</span></div><figcaption><div className="guide-portfolio-caption-heading"><h3>{item.name}</h3><span>{item.type}</span></div><p>{item.text}</p></figcaption></figure>)}</div>
  </div>;
  if (slug === 'marketing') return <div className="guide-channel-examples">
    <div className="guide-example-top" data-service-reveal><span className="guide-eyebrow">ONE BRAND, ONE DIRECTION</span><p>가상 브랜드·콘텐츠 시안 / 게시물 반응 수치도 예시입니다</p></div>
    <div className="guide-channel-grid">
      <article data-service-reveal>
        <div className="guide-channel-heading"><span>01 / SNS CONTENT</span><h3>멈춰 보게 하고, 기억하게</h3></div>
        <div className="guide-channel-image guide-channel-instagram"><div className="guide-channel-frame"><div className="guide-channel-native"><InstagramPreview/></div></div></div>
        <div className="guide-channel-caption"><span>BEAUTY / SNS CONTENT</span><p>{'인스타그램과 SNS 환경에 맞춰 이미지, 카드뉴스, 숏폼 등\n짧은 시간 안에 메시지가 전달되는 콘텐츠를 만듭니다.'}</p></div>
        <span className="guide-channel-check">확인할 반응 / 도달·저장·프로필 방문</span>
      </article>
      <article data-service-reveal>
        <div className="guide-channel-heading"><span>02 / BLOG &amp; SEARCH</span><h3>궁금한 순간, 더 자세히 알 수 있게</h3></div>
        <div className="guide-channel-image guide-channel-blog"><div className="guide-channel-frame"><div className="guide-channel-native"><ServiceExampleImage image="blogDetail" width={720} height={1440} alt="루움 침구 블로그 시안. 이불 고를 때 꼭 확인할 3가지: 피부에 닿는 소재, 우리 집 온도에 맞는 두께, 세탁·건조 방법." unoptimized loading="lazy" decoding="async"/></div></div></div>
        <div className="guide-channel-caption"><span>LIVING / BLOG</span><p>{'단순히 글을 많이 만드는 것보다\n검색한 고객이 읽을 이유가 있는 콘텐츠를 만듭니다.'}</p></div>
        <span className="guide-channel-check">확인할 반응 / 조회·유입 경로·콘텐츠 반응</span>
      </article>
      <article data-service-reveal>
        <div className="guide-channel-heading"><span>03 / CAMPAIGN</span><h3>필요한 타이밍에, 필요한 메시지를</h3></div>
        <div className="guide-channel-image guide-channel-poster"><div className="guide-channel-frame"><div className="guide-channel-native"><ServiceExampleImage image="campaignDetail" width={720} height={1440} alt="모닝오븐 매장 앞 세로형 입간판 광고 시안. 점심 고민 끝, 샌드위치와 아메리카노." unoptimized loading="lazy" decoding="async"/></div></div></div>
        <div className="guide-channel-caption"><span>F&amp;B / CAMPAIGN</span><p>{'소재 제작부터 광고 집행, 반응 확인까지 연결해\n한 번의 캠페인이 다음 방향으로 이어지게 합니다.'}</p></div>
        <span className="guide-channel-check">확인할 내용 / 설치 위치·가독성·행사 안내</span>
      </article>
    </div>
    <div className="guide-report" data-service-reveal><div><span className="guide-eyebrow">REVIEW & NEXT</span><h3>게시한 다음도<br/>함께 봅니다.</h3></div><dl><div><dt>무엇을 했는지</dt><dd>게시물 · 콘텐츠 · 광고 운영 내역</dd></div><div><dt>어떤 반응이 있었는지</dt><dd>채널별 확인 가능한 반응과 지표</dd></div><div><dt>다음에 무엇을 바꿀지</dt><dd>콘텐츠 · 표현 · 운영 방식의 개선점</dd></div></dl><p>채널·계정·측정 설정에 따라 확인 가능한 데이터가 다릅니다. 문의·구매 전환은 측정 환경을 확인한 후 보고 범위를 정합니다.</p></div>
  </div>;
  return <OperationsServiceScope/>;
}
