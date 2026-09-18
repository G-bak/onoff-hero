'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createScrollNavigation } from '@/lib/scroll-navigation';

export default function ScrollNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const routerRef = useRef(router);
  useEffect(() => { routerRef.current = router; }, [router]);
  const navigation = useRef<ReturnType<typeof createScrollNavigation> | null>(null);
  useEffect(() => {
    const controller = createScrollNavigation(window, document, MutationObserver, href => {
      window.scrollTo({ left: window.scrollX, top: window.scrollY, behavior: 'instant' });
      routerRef.current.push(href, { scroll: false });
    });
    navigation.current = controller;
    return () => { controller.dispose(); navigation.current = null; };
  }, []);
  useEffect(() => { navigation.current?.syncLocation(); }, [pathname]);
  return null;
}
