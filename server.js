// Serveur simple pour tester en local avec data.json en écriture
// Usage: node server.js
// Lance sur http://localhost:3000 — GET/PUT data.json fonctionnels
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  // CORS pour tests
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,X-Auth',
  };

  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors);
    return res.end();
  }

  let pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
  if (pathname === '/') pathname = '/index.html';

  // PUT data.json — écriture directe (online tout le temps)
  if (pathname === '/data.json' && req.method === 'PUT') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try { JSON.parse(body); } catch { res.writeHead(400, cors); return res.end('{"error":"invalid json"}'); }
      fs.writeFileSync(path.join(ROOT, 'data.json'), body);
      res.writeHead(200, { ...cors, 'Content-Type': 'application/json' });
      res.end('{"ok":true}');
      console.log('[PUT] data.json sauvegardé', new Date().toISOString());
    });
    return;
  }

  // Compat Worker: /data endpoint
  if (pathname === '/data') {
    if (req.method === 'GET') {
      const data = fs.existsSync(path.join(ROOT, 'data.json')) ? fs.readFileSync(path.join(ROOT, 'data.json'), 'utf8') : '{"settings":{"goal":0},"items":[]}';
      res.writeHead(200, { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      return res.end(data);
    }
    if (req.method === 'PUT') {
      let body = '';
      req.on('data', c => body += c);
      req.on('end', () => {
        try { JSON.parse(body); } catch { res.writeHead(400, cors); return res.end('{"error":"invalid json"}'); }
        fs.writeFileSync(path.join(ROOT, 'data.json'), body);
        res.writeHead(200, { ...cors, 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
        console.log('[PUT] /data -> data.json', new Date().toISOString());
      });
      return;
    }
  }

  const filePath = path.join(ROOT, pathname);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, cors);
    return res.end('not found');
  }
  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'application/octet-stream';
  res.writeHead(200, { ...cors, 'Content-Type': mime, 'Cache-Control': ext === '.json' ? 'no-store' : 'public, max-age=3600' });
  res.end(fs.readFileSync(filePath));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Resell en ligne sur http://localhost:${PORT}`);
  console.log(`  → data.json : GET/PUT directs (toujours en ligne)`);
  console.log(`  → Worker compat : GET/PUT /data`);
});
