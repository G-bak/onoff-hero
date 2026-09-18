'use client';

import Image, { type ImageProps } from 'next/image';
import bakery from '@/app/assets/design-showcase/design-bakery.webp?url';
import beauty from '@/app/assets/design-showcase/design-beauty.webp?url';
import living from '@/app/assets/design-showcase/design-living.webp?url';
import instagram from '@/app/assets/marketing/instagram-ongyeol.webp?url';
import blog from '@/app/assets/marketing/blog-ruum.webp?url';
import poster from '@/app/assets/marketing/poster-installed.webp?url';
import instagramDetail from '@/app/assets/marketing/detail-sns-lumet-v2.webp?url';
import blogDetail from '@/app/assets/marketing/detail-blog-nourve-v2.webp?url';
import campaignDetail from '@/app/assets/marketing/detail-campaign-ploop-v2.webp?url';

// Shared HOME/detail media belongs to one client asset graph. The surrounding
// detail content stays on the server, and Image still provides its SSR markup.
const images = { bakery, beauty, living, instagram, blog, poster, instagramDetail, blogDetail, campaignDetail };

export default function ServiceExampleImage({ image, ...props }: Omit<ImageProps, 'src'> & { image: keyof typeof images }) {
  return <Image {...props} src={images[image]} />;
}
