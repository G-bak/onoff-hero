// Older browsers may provide secure random bytes without crypto.randomUUID.
// Never fall back to Math.random for identifying a submission.
export function createInquiryRequestId(random: Pick<Crypto, 'randomUUID' | 'getRandomValues'> = globalThis.crypto): string {
  if (typeof random?.randomUUID === 'function') return random.randomUUID();
  if (typeof random?.getRandomValues !== 'function') throw new Error('Secure randomness unavailable');
  const bytes = random.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
