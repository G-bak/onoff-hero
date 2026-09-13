import type { Metadata } from 'next';
import ProjectInquiry from '@/app/components/project-inquiry';
import { getService } from '@/lib/services';
import { siteSections } from '@/lib/site-sections';

export const metadata: Metadata = {
  title: '프로젝트 문의 — ON&OFF',
  description: '기획·디자인·웹사이트·마케팅·운영. 필요한 서비스와 프로젝트 내용을 온앤오프와 함께 정리해 보세요.',
};

export default async function InquiryPage({ searchParams }: { searchParams: Promise<{ service?: string; from?: string }> }) {
  const params = await searchParams;
  const service = getService(params.service ?? '');
  const from = siteSections.find(section => section.id === params.from)?.id ?? 'home';
  return <ProjectInquiry key={service?.slug ?? 'all'} initialService={service?.slug} returnTo={from}/>;
}
