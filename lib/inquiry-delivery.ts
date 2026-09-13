import { inquiryBudgets, inquirySchedules, inquiryServiceOptions, validateInquiry, type InquiryDraft, type InquiryErrors } from './project-inquiry';
import { inquiryPrivacyVersion, inquiryPrivacyNotice, inquiryOverseasNotice } from './inquiry-privacy';

// Server-only transport. Do not import this module from a client component.
export const inquiryBodyLimit = 32 * 1024;
export const inquiryDeliveryTimeout = 8000;
const requestIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const limits = { description: 3000, budget: 100, budgetBasis: 100, schedule: 100, reference: 500, company: 100, name: 100, email: 254, phone: 100 } as const;
const expectedKeys = new Set(['services', ...Object.keys(limits), 'consent', 'overseasConsent', 'privacyVersion', 'requestId']);
const unavailableMessage = '문의 접수를 준비하고 있습니다. 이메일로 문의해 주세요.';
const uncertainMessage = '접수 여부를 확인하지 못했습니다. 중복 문의를 피하려면 이메일로 확인해 주세요.';

type DeliveryConfig = { webhookUrl?: string; privacyVersion?: string };
type DeliveryState = 'pending' | 'delivered' | 'uncertain';
type GuardEntry = { fingerprint: string; state: DeliveryState; expiresAt: number };
type GuardResult = DeliveryState | 'new' | 'conflict' | 'full' | 'rate-limited';
export type InquiryDeliveryResponse = {
  ok: boolean;
  code?: string;
  message?: string;
  errors?: InquiryErrors;
  requestId?: string;
};
export type InquiryDeliveryGuard = ReturnType<typeof createInquiryDeliveryGuard>;
export type InquiryDeliveryOptions = DeliveryConfig & {
  fetcher: (input: string, init: RequestInit) => Promise<Response>;
  guard?: InquiryDeliveryGuard;
  timeoutMs?: number;
};

function json(status: number, data: object, headers?: Record<string, string>) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers } });
}

function resolveConfig(config: DeliveryConfig) {
  if (typeof config.webhookUrl !== 'string' || config.privacyVersion !== inquiryPrivacyVersion) return null;
  try {
    const url = new URL(config.webhookUrl);
    if (url.protocol !== 'https:' || url.hostname !== 'hooks.slack.com' || url.port || url.username || url.password || url.search || url.hash || !/^\/services\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+$/.test(url.pathname)) return null;
    return { webhookUrl: url.href };
  } catch { return null; }
}

// The operator selected the policy in inquiry-privacy.ts. An explicit version
// setting keeps a newly changed policy from silently enabling submissions.
export function createInquiryStatus(config: DeliveryConfig) {
  const configured = resolveConfig(config);
  return json(200, { enabled: !!configured, privacyVersion: configured ? inquiryPrivacyVersion : null, privacyNotice: configured ? inquiryPrivacyNotice : null, overseasNotice: configured ? inquiryOverseasNotice : null });
}

// This bounded, temporary in-memory guard only suppresses retries handled by the
// same isolate. It is not a distributed rate limiter or a durable receipt store.
// Only request IDs and SHA-256 draft/address fingerprints are retained, never
// drafts or raw addresses. Cloudflare address counters expire after one minute.
export function createInquiryDeliveryGuard({ now = Date.now, ttlMs = 10 * 60 * 1000, maxEntries = 1024 }: { now?: () => number; ttlMs?: number; maxEntries?: number } = {}) {
  const entries = new Map<string, GuardEntry>();
  const clients = new Map<string, { count: number; expiresAt: number }>();
  return {
    reserve(requestId: string, fingerprint: string, clientFingerprint?: string): GuardResult {
      const currentTime = now();
      for (const [key, entry] of entries) if (entry.expiresAt <= currentTime) entries.delete(key);
      for (const [key, entry] of clients) if (entry.expiresAt <= currentTime) clients.delete(key);
      const entry = entries.get(requestId);
      if (entry) return entry.fingerprint === fingerprint ? entry.state : 'conflict';
      if (entries.size >= maxEntries) return 'full';
      if (clientFingerprint) {
        const client = clients.get(clientFingerprint);
        if (client && client.count >= 3) return 'rate-limited';
        if (client) client.count++;
        else {
          if (clients.size >= maxEntries) return 'full';
          clients.set(clientFingerprint, { count: 1, expiresAt: currentTime + 60000 });
        }
      }
      entries.set(requestId, { fingerprint, state: 'pending', expiresAt: currentTime + ttlMs });
      return 'new';
    },
    finish(requestId: string, state: DeliveryState) {
      const entry = entries.get(requestId);
      if (entry) { entry.state = state; entry.expiresAt = now() + ttlMs; }
    },
    release(requestId: string) { entries.delete(requestId); },
  };
}

const defaultGuard = createInquiryDeliveryGuard();

class InquiryRequestError extends Error {
  status: number;
  constructor(status: number) { super('Invalid inquiry request'); this.status = status; }
}

async function readInquiryJson(request: Request): Promise<unknown> {
  const declaredLength = request.headers.get('content-length');
  if (declaredLength !== null && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > inquiryBodyLimit)) throw new InquiryRequestError(413);
  if (!request.body) throw new InquiryRequestError(400);
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytes = 0, text = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > inquiryBodyLimit) {
        void reader.cancel().catch(() => {});
        throw new InquiryRequestError(413);
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof InquiryRequestError) throw error;
    throw new InquiryRequestError(400);
  } finally { reader.releaseLock(); }
}

function parseSubmission(value: unknown): { draft: InquiryDraft; requestId: string } | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (Object.keys(input).some(key => !expectedKeys.has(key)) || input.consent !== true || input.overseasConsent !== true || input.privacyVersion !== inquiryPrivacyVersion || typeof input.requestId !== 'string' || !requestIdPattern.test(input.requestId)) return null;
  if (!Array.isArray(input.services) || !input.services.length || input.services.length > 5 || input.services.some(item => typeof item !== 'string' || !inquiryServiceOptions.some(option => option.value === item)) || new Set(input.services).size !== input.services.length || (input.services.includes('discuss') && input.services.length !== 1)) return null;
  for (const [key, limit] of Object.entries(limits)) {
    const field = input[key];
    if (typeof field !== 'string' || field.length > limit || Array.from(field).some(character => {
      const code = character.charCodeAt(0);
      return (code < 32 && code !== 9 && code !== 10 && code !== 13) || code === 127;
    })) return null;
    if (key !== 'description' && key !== 'reference' && /[\r\n\t]/.test(field)) return null;
  }
  const strings = Object.fromEntries(Object.keys(limits).map(key => [key, (input[key] as string).trim()]));
  const draft = { ...strings, services: [...input.services] } as InquiryDraft;
  if (!(inquiryBudgets as readonly string[]).includes(draft.budget) || !['프로젝트 전체', '월 운영 기준'].includes(draft.budgetBasis) || !(inquirySchedules as readonly string[]).includes(draft.schedule) || Object.keys(validateInquiry(draft)).length) return null;
  return { draft, requestId: input.requestId.toLowerCase() };
}

export function createInquirySlackMessage(draft: InquiryDraft, requestId: string) {
  const section = (text: string) => ({ type: 'section', text: { type: 'plain_text', text, emoji: false } });
  const selectedNames = inquiryServiceOptions.filter(option => draft.services.includes(option.value)).map(option => option.label);
  return {
    text: 'ON&OFF 새 프로젝트 문의가 도착했습니다.',
    unfurl_links: false,
    unfurl_media: false,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: 'ON&OFF 프로젝트 문의', emoji: false } },
      section(`필요한 서비스\n${selectedNames.join(' · ')}`),
      section(`담당자\n${draft.company} · ${draft.name}\n${draft.email}\n${draft.phone || '연락처 미입력'}`),
      section(`예산 · 일정\n${draft.budget}${draft.budget === inquiryBudgets[0] ? '' : ` (${draft.budgetBasis})`}\n${draft.schedule}`),
      section('프로젝트 소개'),
      section(draft.description),
      ...(draft.reference ? [section(`참고 링크\n${draft.reference}`)] : []),
      section(`접수 기록\n${new Date().toISOString()} · ${requestId}\n개인정보 수집·이용 및 국외 처리위탁 동의 완료 · 안내 버전 ${inquiryPrivacyVersion}\n보관: 접수일로부터 90일, 문의 처리 완료 시 조기 삭제`),
    ],
  };
}

async function fingerprint(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
}

// Always inject fetch. Unit tests supply a mock and never contact Slack.
export async function handleInquirySubmission(request: Request, options: InquiryDeliveryOptions): Promise<Response> {
  if (request.method !== 'POST') return json(405, { ok: false, code: 'method_not_allowed' }, { Allow: 'POST' });
  const config = resolveConfig(options);
  if (!config) return json(503, { ok: false, code: 'configuration_required', message: unavailableMessage });
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') return json(403, { ok: false, code: 'invalid_origin', message: '현재 페이지에서 다시 문의해 주세요.' });
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return json(415, { ok: false, code: 'invalid_content_type', message: '문의 형식을 확인해 주세요.' });
  let submission;
  try { submission = parseSubmission(await readInquiryJson(request)); }
  catch (error) {
    const status = error instanceof InquiryRequestError ? error.status : 400;
    return json(status, { ok: false, code: status === 413 ? 'body_too_large' : 'invalid_request', message: status === 413 ? '문의 내용이 너무 큽니다. 길이를 줄여 주세요.' : '문의 내용을 확인해 주세요.' });
  }
  if (!submission) return json(400, { ok: false, code: 'invalid_request', message: '필수 항목과 개인정보 안내 동의를 확인해 주세요.' });
  const { draft, requestId } = submission;
  const guard = options.guard ?? defaultGuard;
  let draftFingerprint, clientFingerprint;
  try {
    draftFingerprint = await fingerprint(JSON.stringify({ ...draft, services: [...draft.services].sort() }));
    // A cf object is runtime metadata, not an HTTP header. Only trust the
    // Cloudflare-overwritten address when that metadata is actually present.
    // Node preview ignores both this header and spoofable X-Forwarded-For.
    const cf = Reflect.get(request, 'cf');
    const address = request.headers.get('cf-connecting-ip');
    if (cf && typeof cf === 'object' && address && /^[0-9a-fA-F:.]{3,45}$/.test(address)) clientFingerprint = await fingerprint(address);
  }
  catch { return json(503, { ok: false, code: 'unavailable', message: unavailableMessage }); }
  const previous = guard.reserve(requestId, draftFingerprint, clientFingerprint);
  if (previous === 'delivered') return json(200, { ok: true, code: 'delivered', requestId });
  if (previous === 'uncertain') return json(502, { ok: false, code: 'delivery_unknown', message: uncertainMessage });
  if (previous === 'pending') return json(429, { ok: false, code: 'duplicate_pending', message: '문의 전송을 확인하고 있습니다. 잠시 기다려 주세요.' }, { 'Retry-After': '8' });
  if (previous === 'conflict') return json(409, { ok: false, code: 'request_conflict', message: '문의 내용이 변경되었습니다. 작성 내용을 다시 확인해 주세요.' });
  if (previous === 'full' || previous === 'rate-limited') return json(previous === 'full' ? 503 : 429, { ok: false, code: 'rate_limited', message: '문의 전송이 많습니다. 잠시 후 다시 시도해 주세요.' }, { 'Retry-After': '60' });

  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeoutMs = Math.max(1, Math.min(options.timeoutMs ?? inquiryDeliveryTimeout, inquiryDeliveryTimeout));
    const timedOut = new Promise<never>((_, reject) => {
      timeout = setTimeout(() => { controller.abort(); reject(new Error('Delivery timeout')); }, timeoutMs);
    });
    const delivered = await Promise.race([
      (async () => {
        const response = await options.fetcher(config.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createInquirySlackMessage(draft, requestId)),
          signal: controller.signal,
          redirect: 'error',
          cache: 'no-store',
        });
        if (response.status !== 200) {
          void response.body?.cancel().catch(() => {});
          return false;
        }
        return (await response.text()).trim() === 'ok';
      })(),
      timedOut,
    ]);
    if (!delivered) {
      guard.release(requestId);
      return json(502, { ok: false, code: 'delivery_failed', message: '문의 전송에 실패했습니다. 잠시 후 다시 시도하거나 이메일로 문의해 주세요.' });
    }
    guard.finish(requestId, 'delivered');
    return json(200, { ok: true, code: 'delivered', requestId });
  } catch {
    guard.finish(requestId, 'uncertain');
    return json(502, { ok: false, code: 'delivery_unknown', message: uncertainMessage });
  } finally { if (timeout !== undefined) clearTimeout(timeout); }
}
