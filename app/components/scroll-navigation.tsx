'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { createScrollNavigation } from '@/lib/scroll-navigation';

export default function ScrollNavigation() {
  const pathname = usePathname();
  const navigation = useRef<ReturnType<typeof createScrollNavigation> | null>(null);
  useEffect(() => {
    const controller = createScrollNavigation(window, document);
    navigation.current = controller;
    return () => { controller.dispose(); navigation.current = null; };
  }, []);
  useEffect(() => { navigation.current?.syncLocation(); }, [pathname]);
  return null;
}
