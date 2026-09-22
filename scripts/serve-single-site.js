const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const frontendBuild = path.join(root, 'frontend', 'build');
const dashboardBuild = path.join(frontendBuild, 'dashboard');
const port = process.env.PORT || 3005;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const stream = fs.createReadStream(filePath);
  stream.on('error', () => {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  });
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  stream.pipe(res);
}

const server = http.createServer((req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url;
  const pathname = decodeURIComponent(url.split('?')[0]);

  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    sendFile(res, path.join(dashboardBuild, 'index.html'));
    return;
  }

  if (pathname.startsWith('/dashboard/')) {
    const filePath = path.join(dashboardBuild, pathname.replace(/^\/dashboard\//, ''));
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      sendFile(res, filePath);
      return;
    }
    sendFile(res, path.join(dashboardBuild, 'index.html'));
    return;
  }

  const filePath = path.join(frontendBuild, pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    sendFile(res, filePath);
    return;
  }

  sendFile(res, path.join(frontendBuild, 'index.html'));
});

server.listen(port, () => {
  console.log(`Single-site server running at http://localhost:${port}`);
});
