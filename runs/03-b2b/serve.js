// Tiny zero-dependency Node static server for Cargoline
// Port 4302 only; serves 404.html with HTTP status 404 for unknown routes.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = 4302;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf'
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:;"
};

function resolvePath(urlPath) {
  const cleanPath = decodeURI(urlPath.split('?')[0].split('#')[0]);
  let filePath = path.join(ROOT, cleanPath);
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  } else if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) {
    filePath = path.join(filePath, 'index.html');
  }
  
  return filePath;
}

const server = http.createServer((req, res) => {
  const filePath = resolvePath(req.url);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      ...SECURITY_HEADERS
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // Serve 404.html with status 404
    const notFoundPath = path.join(ROOT, '404.html');
    if (fs.existsSync(notFoundPath)) {
      res.writeHead(404, {
        'Content-Type': 'text/html; charset=utf-8',
        ...SECURITY_HEADERS
      });
      fs.createReadStream(notFoundPath).pipe(res);
    } else {
      res.writeHead(404, {
        'Content-Type': 'text/plain',
        ...SECURITY_HEADERS
      });
      res.end('404 Not Found');
    }
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Cargoline server active on http://127.0.0.1:${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});
