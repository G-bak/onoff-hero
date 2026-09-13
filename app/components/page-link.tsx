'use client';

import type { ComponentProps } from 'react';
import Link from 'next/link';

// Stop the outgoing document's pending smooth-scroll frames before the router
// replaces it. Otherwise a final compositor delta can move the new page again.
export default function PageLink(props: Omit<ComponentProps<typeof Link>, 'onNavigate'>) {
  return <Link {...props} onNavigate={() => {
    window.scrollTo({ left: window.scrollX, top: window.scrollY, behavior: 'instant' });
  }}/>;
}
