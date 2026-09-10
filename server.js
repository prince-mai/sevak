// SEVAK Platform - Lightweight High Performance HTTP & API Server
// Uses built-in Node.js modules (compatible with Node 18+ and agy-node)

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
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

// In-Memory Database for bookings & quotes (with initial Patna seed data)
const db = {
  bookings: [
    {
      id: 'SEV-8921',
      serviceName: 'AC Jet Cleaning & Gas Check',
      category: 'Electrical',
      customerName: 'Aman Verma',
      phone: '+91 98350 12345',
      address: 'Flat 402, Shanti Vihar, Boring Road, Patna',
      area: 'Boring Road, Patna',
      date: 'Today, 2:30 PM',
      status: 'In-Transit',
      amount: 699,
      paymentMethod: 'UPI (PhonePe)',
      technician: {
        name: 'Rakesh Kumar',
        phone: '+91 94310 88761',
        rating: 4.9,
        jobsDone: 342,
        badge: 'Verified Master Electrician'
      },
      otp: '4829',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'SEV-8922',
      serviceName: 'Full Bathroom Descaling & Tank Clean',
      category: 'Plumbing',
      customerName: 'Pooja Singh',
      phone: '+91 99340 55432',
      address: 'House 14, Road No. 3, Kankarbagh, Patna',
      area: 'Kankarbagh, Patna',
      date: 'Today, 4:00 PM',
      status: 'Assigned',
      amount: 1250,
      paymentMethod: 'Cash on Service',
      technician: {
        name: 'Manoj Paswan',
        phone: '+91 97712 33419',
        rating: 4.8,
        jobsDone: 218,
        badge: 'Certified Senior Plumber'
      },
      otp: '7103',
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'SEV-8923',
      serviceName: 'Termite Warranty Treatment (3 BHK)',
      category: 'Pest Control',
      customerName: 'Dr. S. K. Sinha',
      phone: '+91 94302 99881',
      address: 'Bailey Road, Near Saguna More, Danapur, Patna',
      area: 'Danapur / Saguna More',
      date: 'Tomorrow, 10:00 AM',
      status: 'Confirmed',
      amount: 2499,
      paymentMethod: 'UPI (Google Pay)',
      technician: null,
      otp: '9312',
      createdAt: new Date(Date.now() - 10800000).toISOString()
    }
  ],
  quotes: [
    {
      id: 'QT-501',
      customerName: 'Ruban Memorial Hospital',
      contactPerson: 'Arvind Sharma (Admin)',
      phone: '+91 93340 77112',
      category: 'AMC & Project Services',
      projectType: 'Hospital 24/7 Electrical & Plumbing AMC',
      location: 'Patliputra Colony, Patna',
      estimatedValue: '₹ 1,80,000 / yr',
      status: 'Survey Scheduled',
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
      notes: 'Requires 24/7 dedicated standby technician + weekly generator & electrical panel audit.'
    },
    {
      id: 'QT-502',
      customerName: 'Rameshwaram Heights RWA',
      contactPerson: 'Col. R. P. Singh (Retd.)',
      phone: '+91 98352 44109',
      category: 'Civil & Renovation',
      projectType: 'Exterior Terrace Waterproofing & Rain Drainage',
      location: 'Rajendra Nagar, Patna',
      estimatedValue: '₹ 95,000',
      status: 'Quote Sent',
      submittedAt: new Date(Date.now() - 172800000).toISOString(),
      notes: '4,500 sq.ft terrace elastomeric polyurethane waterproof coating with 5-year warranty.'
    }
  ]
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS Headers for seamless local/client requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // REST API Endpoints
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');

    if (pathname === '/api/stats' && req.method === 'GET') {
      const stats = {
        activeBookings: db.bookings.length,
        totalQuotes: db.quotes.length,
        activeTechnicians: 48,
        patnaCoverage: '98.5%',
        averageRating: 4.89,
        revenueToday: db.bookings.reduce((sum, b) => sum + (b.amount || 0), 0) + 18450,
        citiesCovered: ['Patna', 'Muzaffarpur', 'Gaya', 'Bhagalpur', 'Darbhanga', 'Begusarai']
      };
      res.writeHead(200);
      res.end(JSON.stringify(stats));
      return;
    }

    if (pathname === '/api/bookings' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify(db.bookings));
      return;
    }

    if (pathname === '/api/bookings' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => (body += chunk));
      req.on('end', () => {
        try {
          const bookingData = JSON.parse(body);
          const newBooking = {
            id: 'SEV-' + Math.floor(1000 + Math.random() * 9000),
            ...bookingData,
            status: 'Assigned',
            technician: {
              name: 'Sanjeev Kumar Sinha',
              phone: '+91 94314 ' + Math.floor(10000 + Math.random() * 90000),
              rating: 4.9,
              jobsDone: 412,
              badge: 'SEVAK Gold Certified Partner'
            },
            otp: String(Math.floor(1000 + Math.random() * 9000)),
            createdAt: new Date().toISOString()
          };
          db.bookings.unshift(newBooking);
          res.writeHead(201);
          res.end(JSON.stringify({ success: true, booking: newBooking }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        }
      });
      return;
    }

    if (pathname === '/api/quotes' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify(db.quotes));
      return;
    }

    if (pathname === '/api/quotes' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => (body += chunk));
      req.on('end', () => {
        try {
          const quoteData = JSON.parse(body);
          const newQuote = {
            id: 'QT-' + Math.floor(500 + Math.random() * 500),
            ...quoteData,
            status: 'Survey Scheduled',
            submittedAt: new Date().toISOString()
          };
          db.quotes.unshift(newQuote);
          res.writeHead(201);
          res.end(JSON.stringify({ success: true, quote: newQuote }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        }
      });
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'API endpoint not found' }));
    return;
  }

  // Static File Serving
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

  // Security check: prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 SEVAK Bihar Super-Platform Server running at:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`👉 Admin Operations Hub: http://localhost:${PORT}/admin.html`);
  console.log(`=======================================================`);
});
