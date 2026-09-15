import HomeContent from './home-content';
import StructuredData from './components/structured-data';
import { companyInfo } from '@/lib/consultation';
import { homeStructuredData, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('/');

export default function Home() {
  return <><StructuredData data={homeStructuredData(companyInfo)} /><HomeContent /></>;
}
