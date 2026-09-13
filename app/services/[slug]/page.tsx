import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { services, getService } from '@/lib/services';
import WebServiceDetail from '@/app/components/web-service-detail';
import ProfessionalServiceDetail from '@/app/components/professional-service-detail';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return services.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  return { title: service ? `${service.name} — ON&OFF` : '서비스를 찾을 수 없습니다 — ON&OFF', description: service?.intro };
}

export default async function ServiceDetail({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  if (service.slug === 'web') return <WebServiceDetail service={service}/>;
  return <ProfessionalServiceDetail service={service}/>;
}
