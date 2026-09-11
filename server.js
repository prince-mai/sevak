// SEVAK Platform - Lightweight HTTP & API Server (Node 18+)

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const db = {
  bookings: [],
  quotes: []
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

function readBody(req, limitBytes = 200000) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > limitBytes) {
        reject(new Error('payload_too_large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function safeFilePath(pathname) {
  const rel = pathname === '/' ? 'index.html' : decodeURIComponent(pathname).replace(/^\/+/, '');
  const resolved = path.resolve(PUBLIC_DIR, rel);
  const rootWithSep = PUBLIC_DIR.endsWith(path.sep) ? PUBLIC_DIR : PUBLIC_DIR + path.sep;
  if (resolved !== PUBLIC_DIR && !resolved.startsWith(rootWithSep)) return null;
  return resolved;
}

function sendNotFound(res) {
  const notFoundPage = path.join(PUBLIC_DIR, '404.html');
  fs.readFile(notFoundPage, (err, data) => {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(err ? '404 Not Found' : data);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname.startsWith('/api/')) {
    if (pathname === '/api/stats' && req.method === 'GET') {
      sendJson(res, 200, {
        activeBookings: db.bookings.length,
        totalQuotes: db.quotes.length,
        citiesCovered: ['Patna', 'Muzaffarpur', 'Gaya', 'Bhagalpur', 'Darbhanga', 'Begusarai']
      });
      return;
    }

    if (pathname === '/api/bookings' && req.method === 'GET') {
      sendJson(res, 200, db.bookings);
      return;
    }

    if (pathname === '/api/bookings' && req.method === 'POST') {
      try {
        const bookingData = JSON.parse(await readBody(req));
        const newBooking = {
          ...bookingData,
          id: bookingData.id || ('SEV-' + Date.now().toString().slice(-8)),
          status: bookingData.status || 'Received',
          createdAt: bookingData.createdAt || new Date().toISOString()
        };
        db.bookings.unshift(newBooking);
        sendJson(res, 201, { success: true, booking: newBooking });
      } catch (e) {
        sendJson(res, e.message === 'payload_too_large' ? 413 : 400, { error: 'Invalid JSON payload' });
      }
      return;
    }

    if (pathname === '/api/quotes' && req.method === 'GET') {
      sendJson(res, 200, db.quotes);
      return;
    }

    if (pathname === '/api/quotes' && req.method === 'POST') {
      try {
        const quoteData = JSON.parse(await readBody(req));
        const newQuote = {
          ...quoteData,
          id: quoteData.id || ('QT-' + Date.now().toString().slice(-6)),
          status: quoteData.status || 'New request',
          submittedAt: quoteData.submittedAt || new Date().toISOString()
        };
        db.quotes.unshift(newQuote);
        sendJson(res, 201, { success: true, quote: newQuote });
      } catch (e) {
        sendJson(res, e.message === 'payload_too_large' ? 413 : 400, { error: 'Invalid JSON payload' });
      }
      return;
    }

    sendJson(res, 404, { error: 'API endpoint not found' });
    return;
  }

  const filePath = safeFilePath(pathname);
  if (!filePath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      sendNotFound(res);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const cache = ext === '.html' ? 'no-cache' : 'public, max-age=86400';
    res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': cache });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`SEVAK server: http://localhost:${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin.html`);
});
