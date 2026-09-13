// Local UI preview for machines that cannot run Cloudflare's workerd.
// This app has no Worker bindings; production still uses vite.config.ts.
import { createServer } from 'vite';
import vinext from 'vinext';
import { sites } from '@openai/sites-vite-plugin';
import tailwindcss from '@tailwindcss/postcss';

const server = await createServer({
  configFile: false,
  root: process.cwd(),
  plugins: [vinext(), sites()],
  css: { postcss: { plugins: [tailwindcss()] } },
  server: {
    host: 'localhost',
    port: 5187,
    strictPort: true,
    watch: { ignored: ['**/design/**', '**/outputs/**'] },
  },
});
await server.listen();
server.printUrls();
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => { void server.close().then(() => process.exit(0)); });
}
