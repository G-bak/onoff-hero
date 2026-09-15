// Change only the origin so inquiry selections and campaign parameters survive.
// Native Request/Response are supported by both Vinext and Workers.
export function middleware(request: Request) {
  const url = new URL(request.url);
  if (url.hostname !== 'www.on-onf.com') return;
  url.protocol = 'https:';
  url.hostname = 'on-onf.com';
  url.port = '';
  return Response.redirect(url, 308);
}

export const config = { matcher: '/:path*' };
