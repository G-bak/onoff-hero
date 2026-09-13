import { createInquiryStatus, handleInquirySubmission } from '@/lib/inquiry-delivery';

export const dynamic = 'force-dynamic';

// Cloudflare nodejs_compat and the local Node preview expose server-only env.
// Never prefix the webhook secret with VITE_ or NEXT_PUBLIC_.
function configuration() {
  return {
    webhookUrl: process.env.SLACK_INQUIRY_WEBHOOK_URL,
    privacyVersion: process.env.INQUIRY_PRIVACY_VERSION,
  };
}

export function GET() {
  return createInquiryStatus(configuration());
}

export function POST(request: Request) {
  return handleInquirySubmission(request, { ...configuration(), fetcher: fetch });
}
