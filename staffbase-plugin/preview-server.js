import http from 'http';
import fs from 'fs/promises';
import path from 'path';

const root = path.resolve(new URL('.', import.meta.url).pathname);
const port = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  let pathname = url.pathname;

  if (pathname === '/' || pathname === '/preview' || pathname === '/preview/') {
    pathname = '/preview/index.html';
  } else if (pathname.endsWith('/preview') || pathname.endsWith('/preview/')) {
    pathname = '/preview/index.html';
  } else if (pathname.endsWith('/preview/index.html')) {
    pathname = '/preview/index.html';
  } else if (!pathname.startsWith('/preview/') && pathname.includes('/preview/')) {
    pathname = pathname.slice(pathname.indexOf('/preview/'));
  }

  const filePath = path.join(root, pathname.replace(/^\//, ''));
  console.log('[preview]', req.url, '->', pathname, filePath);

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found: ' + pathname);
  }
});

server.listen(port, () => {
  console.log(`Preview server running at http://localhost:${port}`);
});
