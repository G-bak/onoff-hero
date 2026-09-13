import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { markdownLinks, repositoryFiles } from './markdown-links.mjs';

export function externalLinkTargets(root) {
  const targets = new Map();
  for (const file of repositoryFiles(root).filter(file => /\.md$/i.test(file))) {
    for (const { target, line } of markdownLinks(fs.readFileSync(file, 'utf8'))) {
      if (!/^https?:\/\//i.test(target)) continue;
      let url;
      try { url = new URL(target); } catch { continue; }
      if (url.username || url.password || /^(?:localhost|127\.|\[?::1\]?$)/i.test(url.hostname)) continue;
      url.hash = '';
      const key = url.href;
      if (!targets.has(key)) targets.set(key, { url: key, sources: [] });
      targets.get(key).sources.push(`${path.relative(root, file).replaceAll('\\', '/')}:${line}`);
    }
  }
  return [...targets.values()];
}

export async function checkExternalLinks(targets, { fetchImpl = fetch, timeoutMs = 12000, concurrency = 4 } = {}) {
  const results = Array.from({ length: targets.length });
  let next = 0;
  async function check(target) {
    let method = 'HEAD';
    try {
      const request = verb => fetchImpl(target.url, { method: verb, redirect: 'follow', signal: AbortSignal.timeout(timeoutMs), headers: { 'User-Agent': 'ONOFF-Docs-Link-Check/1.0' } });
      let response = await request(method);
      if ([400, 404, 405, 410, 501].includes(response.status)) {
        await response.body?.cancel();
        method = 'GET';
        response = await request(method);
      }
      await response.body?.cancel();
      const classification = response.status >= 200 && response.status < 300 ? 'reachable' : [404, 410].includes(response.status) ? 'broken' : 'unverified';
      return { ...target, classification, status: response.status, method, finalUrl: response.url || target.url };
    } catch (error) {
      return { ...target, classification: 'unverified', status: null, method, reason: error.cause?.code || error.name || 'NetworkError' };
    }
  }
  await Promise.all(Array.from({ length: Math.min(4, Math.max(1, Math.floor(concurrency))) }, async () => {
    while (next < targets.length) {
      const index = next++;
      results[index] = await check(targets[index]);
    }
  }));
  return results;
}

async function main() {
  const args = process.argv.slice(2);
  let root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  let output;
  for (let index = 0; index < args.length; index++) {
    if (args[index] === '--root' && args[index + 1]) root = path.resolve(args[++index]);
    else if (args[index] === '--json' && args[index + 1]) output = path.resolve(args[++index]);
    else throw new Error('Usage: node scripts/check-external-links.mjs [--root directory] [--json output.json]');
  }
  const results = await checkExternalLinks(externalLinkTargets(root));
  const counts = { total: results.length, reachable: 0, broken: 0, unverified: 0 };
  for (const result of results) counts[result.classification]++;
  const report = {
    checkedAt: new Date().toISOString(),
    scope: 'Explicit Markdown, reference, autolink and HTML HTTP(S) destinations; local URLs and code examples excluded.',
    limitation: 'HTTP reachability only. A 2xx response does not verify page contents, fragments, JavaScript applications, video playback or source accuracy. 401/403/429, other non-404/410 statuses and network errors remain unverified.',
    counts,
    results,
  };
  if (output) {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  }
  console.log(`External link responses: ${counts.total} checked, ${counts.reachable} reachable, ${counts.broken} broken, ${counts.unverified} unverified.`);
  for (const result of results.filter(result => result.classification !== 'reachable')) console.log(`${result.classification}: ${result.status ?? result.reason} ${result.url} (${result.sources.join(', ')})`);
  if (output) console.log(`JSON report: ${output}`);
  process.exitCode = counts.broken > 0 ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
