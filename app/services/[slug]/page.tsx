import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { services, getService } from '@/lib/services';
import WebServiceDetail from '@/app/components/web-service-detail';
import ProfessionalServiceDetail from '@/app/components/professional-service-detail';
import StructuredData from '@/app/components/structured-data';
import { pageMetadata, serviceStructuredData } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return services.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) notFound();
  return pageMetadata(`/services/${service.slug}`);
}

export default async function ServiceDetail({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  return <><StructuredData data={serviceStructuredData(service)}/>{service.slug === 'web' ? <WebServiceDetail service={service}/> : <ProfessionalServiceDetail service={service}/>}</>;
}
