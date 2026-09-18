import Link from 'next/link';

export default function ServiceNotFound() {
  return <main className="service-not-found"><p>ON&OFF / 404</p><h1>서비스를 찾을 수 없습니다.</h1><p>주소를 확인하거나 서비스 목록에서 다시 선택해 주세요.</p><Link href="/" data-scroll-target="services" prefetch={false}>서비스 목록으로 돌아가기 ↗</Link></main>;
}
