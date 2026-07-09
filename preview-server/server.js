#!/usr/bin/env node
/**
 * Scriptable Widget Preview Server
 * 
 * A lightweight HTTP server that serves the widget preview environment,
 * widget scripts, and the collection browser API.
 * 
 * Usage: node server.js [port]
 * Default port: 8888
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.argv[2]) || 8888;
const ROOT = path.resolve(__dirname, '..');
const COLLECTION_DIR = path.join(ROOT, 'collection');
const WIDGETS_DIR = path.join(ROOT, 'widgets');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

function getMime(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME[ext] || 'application/octet-stream';
}

function safeJoin(base, target) {
  const targetPath = path.posix.normalize('/' + target).slice(1);
  return path.join(base, targetPath);
}

function listCollection() {
  const results = [];
  if (!fs.existsSync(COLLECTION_DIR)) return results;
  
  const authors = fs.readdirSync(COLLECTION_DIR).filter(d => 
    fs.statSync(path.join(COLLECTION_DIR, d)).isDirectory()
  );

  for (const author of authors) {
    const authorDir = path.join(COLLECTION_DIR, author);
    const files = fs.readdirSync(authorDir).filter(f => f.endsWith('.js'));
    for (const file of files) {
      results.push({
        name: file.replace(/\.js$/, ''),
        path: `${author}/${file}`,
        source: `github.com/${author}`,
        size: fs.statSync(path.join(authorDir, file)).size,
      });
    }
  }
  return results;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = url.pathname;

  console.log(`${new Date().toISOString()} ${req.method} ${pathname}`);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API routes
  if (pathname === '/api/collection') {
    const items = listCollection();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(items));
    return;
  }

  if (pathname.startsWith('/api/file/')) {
    const filePath = decodeURIComponent(pathname.replace('/api/file/', ''));
    const fullPath = safeJoin(COLLECTION_DIR, filePath);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(content);
    } else {
      res.writeHead(404);
      res.end('File not found');
    }
    return;
  }

  // Mock API for widget data
  if (pathname === '/api/network-speed') {
    const data = {
      downloadSpeed: Math.floor(Math.random() * 50000 + 5000) / 1000, // Mbps
      uploadSpeed: Math.floor(Math.random() * 10000 + 1000) / 1000,
      ping: Math.floor(Math.random() * 50 + 5),
      signal: Math.floor(Math.random() * 30 + 70),
      networkType: 'WiFi',
      ssid: 'MyHome-5G',
      ip: '192.168.1.' + Math.floor(Math.random() * 254 + 1),
      timestamp: Date.now(),
    };
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
    return;
  }

  if (pathname === '/api/vocabulary/today') {
    // Return format matching widget's expected fields: word, phonetic, pos, def, defCn
    const data = {
      word: 'ephemeral',
      phonetic: '/ɪˈfemərəl/',
      pos: 'adj.',
      def: 'lasting for a very short time; transient',
      defCn: '短暂的；瞬息的',
      examples: [
        { en: 'Fame in the modern world is an ephemeral thing.', cn: '现代社会中，名声不过是转瞬即逝的东西。' },
        { en: 'The ephemeral nature of digital data concerns archivists.', cn: '数字数据的短暂性令档案管理员担忧。' }
      ],
      roots: [
        { part: 'epi-', meaning: 'on, upon' },
        { part: 'hemera', meaning: 'day (Greek)' },
        { part: '-al', meaning: 'adjective suffix' }
      ],
      literalMeaning: 'lasting only a day',
      derivatives: [
        { word: 'ephemerality', pos: 'n.', def: '短暂性' },
        { word: 'ephemerally', pos: 'adv.', def: '短暂地' },
        { word: 'ephemeris', pos: 'n.', def: '星历表' }
      ],
      synonyms: ['transient', 'fleeting', 'momentary', 'evanescent'],
      antonyms: ['permanent', 'eternal', 'perpetual', 'enduring'],
      level: 'GRE',
      timestamp: Date.now(),
    };
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
    return;
  }

  // Static file serving
  if (pathname === '/') pathname = '/index.html';

  // Try public dir first, then root
  const publicPath = path.join(__dirname, 'public', pathname);
  const rootPath = safeJoin(ROOT, pathname);

  let filePath = null;
  if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
    filePath = publicPath;
  } else if (fs.existsSync(rootPath) && fs.statSync(rootPath).isFile()) {
    filePath = rootPath;
  }

  if (filePath) {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': getMime(filePath) });
    res.end(content);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found: ' + pathname);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  Scriptable Widget Preview Server               ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  Local:   http://localhost:${PORT}              ║`);
  console.log(`║  Network: http://0.0.0.0:${PORT}                ║`);
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('\nAvailable widgets:');
  console.log('  - Network Speed Monitor');
  console.log('  - Vocabulary Builder');
  console.log('\nPress Ctrl+C to stop.');
});
