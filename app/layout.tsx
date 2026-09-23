import type { Metadata } from 'next';
import '@fontsource/inter/latin-400.css';
import Script from 'next/script';
import { siteName, siteOrigin, verificationMetadata } from '@/lib/seo';
import ScrollNavigation from './components/scroll-navigation';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/montserrat/latin-700.css';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './globals.css';
import './why-galaxy.css';
import './marketing-showcase.css';
import './creative-sections.css';
import './design-editorial.css';
import './people-motion.css';
import './web-cinema.css';
import './why-loading.css';
import './services.css';
import './web-service.css';
import './service-details.css';
import './service-footer.css';
import './brand-film.css';
import './project-inquiry.css';
import './home-opening.css';
import './inquiry-nudge.css';
export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(siteOrigin),
    title: '온앤오프 ON&OFF',
    applicationName: siteName,
    publisher: '(주)온앤오프',
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
    verification: verificationMetadata({ google: process.env.GOOGLE_SITE_VERIFICATION, naver: process.env.NAVER_SITE_VERIFICATION }),
    icons: {
      icon: [
        { url: '/favicon.ico?v=white-20260915', type: 'image/x-icon', sizes: '16x16 32x32 48x48 64x64' },
        { url: '/favicon-onoff-32.png?v=white-20260915', type: 'image/png', sizes: '32x32' },
        { url: '/favicon-onoff-64.png?v=white-20260915', type: 'image/png', sizes: '64x64' },
      ],
      shortcut: '/favicon.ico?v=white-20260915',
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko" data-scroll-behavior="smooth">
    <head>
      <Script id="google-tag-loader" strategy="beforeInteractive" async src="https://www.googletagmanager.com/gtag/js?id=G-BHNVERX19B" />
      <Script id="google-tag-config" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-BHNVERX19B');
        gtag('config', 'AW-18383031274');
      ` }} />
    </head>
    <body>{children}<ScrollNavigation/></body>
  </html>;
}
