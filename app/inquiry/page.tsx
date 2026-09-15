import type { Metadata } from 'next';
import ProjectInquiry from '@/app/components/project-inquiry';
import { getService } from '@/lib/services';
import { resolveSiteSection } from '@/lib/site-sections';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('/inquiry');

export default async function InquiryPage({ searchParams }: { searchParams: Promise<{ service?: string; from?: string }> }) {
  const params = await searchParams;
  const service = getService(params.service ?? '');
  const from = resolveSiteSection(params.from) ?? 'home';
  return <ProjectInquiry key={service?.slug ?? 'all'} initialService={service?.slug} returnTo={from}/>;
}
