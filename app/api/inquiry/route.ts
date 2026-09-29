import { createInquiryStatus, handleInquirySubmission } from '@/lib/inquiry-delivery';

export const dynamic = 'force-dynamic';

// The public form endpoint and approved policy ship atomically with the route.
// Legacy Slack secrets are intentionally unused; never fall back to Slack.
function configuration() {
  return {
    formUrl: 'https://formspree.io/f/mqpawbdg',
    privacyVersion: '2026-09-29',
  };
}

export function GET() {
  return createInquiryStatus(configuration());
}

export function POST(request: Request) {
  return handleInquirySubmission(request, { ...configuration(), fetcher: (url, init) => fetch(url, init) });
}
