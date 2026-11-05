import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { extname, isAbsolute, relative, resolve, sep } from 'node:path';

// Only the two HTML pages and public assets are served.
const vietnamesePage = new URL('../index.html', import.meta.url);
const entrypoints = new Map([
  ['/', vietnamesePage],
  ['/index.html', vietnamesePage],
  ['/en.html', new URL('../en.html', import.meta.url)],
]);
const assetRoot = await realpath(new URL('../assets/', import.meta.url));
const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'],
  ['.webp', 'image/webp'],
  ['.avif', 'image/avif'],
  ['.ico', 'image/x-icon'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.pdf', 'application/pdf'],
]);
const portText = process.env.PORT ?? '3000';
const port = Number(portText);

if (!/^\d+$/.test(portText) || !Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT must be an integer between 1 and 65535.');
  process.exit(1);
}

const server = createServer(async (request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
  } catch {
    response.writeHead(400);
    response.end();
    return;
  }

  const entrypoint = entrypoints.get(pathname);
  const isAsset = pathname.startsWith('/assets/')
    && !pathname.includes('\\')
    && !pathname.includes('\0')
    && !pathname.split('/').some((segment) => segment.startsWith('.'));
  const contentType = entrypoint
    ? 'text/html; charset=utf-8'
    : contentTypes.get(extname(pathname).toLowerCase());

  if ((!entrypoint && !isAsset) || !contentType) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : 'Not found');
    return;
  }

  try {
    let filename = entrypoint;
    if (isAsset) {
      filename = await realpath(resolve(assetRoot, pathname.slice('/assets/'.length)));
      const assetPath = relative(assetRoot, filename);
      // realpath also prevents nested symlinks from exposing files outside assets.
      if (!assetPath || assetPath === '..' || assetPath.startsWith('..' + sep) || isAbsolute(assetPath)) {
        response.writeHead(404);
        response.end();
        return;
      }
    }
    const body = await readFile(filename);
    response.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': body.byteLength,
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    const missing = ['ENOENT', 'ENOTDIR', 'EISDIR'].includes(error.code);
    if (!missing) console.error('Cannot read requested file:', error.message);
    response.writeHead(missing ? 404 : 500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : (missing ? 'Not found' : 'Cannot read requested file'));
  }
});

server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE'
    ? `Port ${port} is already in use. Set PORT to a different number.`
    : error.message);
  process.exitCode = 1;
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Tiếng Việt: http://127.0.0.1:${port}/`);
  console.log(`English: http://127.0.0.1:${port}/en.html`);
  console.log('Refresh the browser after editing either HTML page. Press Ctrl+C to stop.');
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close();
    server.closeIdleConnections();
  });
}
