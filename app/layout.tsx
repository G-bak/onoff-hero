import type { Metadata } from 'next';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import 'pretendard/dist/web/variable/pretendardvariable.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'ON&OFF — 가능성을 켜고, 경험을 연결합니다',
  description: '전략부터 제작, 광고 운영까지. ON&OFF가 브랜드의 가능성을 하나의 흐름으로 연결합니다.',
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: '/favicon-onoff-32.png?v=transparent', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-onoff-64.png?v=transparent', type: 'image/png', sizes: '64x64' },
    ],
    shortcut: '/favicon-onoff-32.png?v=transparent',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
