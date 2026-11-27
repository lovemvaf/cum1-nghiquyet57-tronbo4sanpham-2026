#!/usr/bin/env node
/**
 * Zero-dependency Offline HTTP Server for LẠC HỒNG SỐ V3 (`dist/`).
 * Supports Byte-Range streaming for MP4 video, WebVTT subtitles,
 * DOCX/PDF downloads, and both `/` and `/cum1-nghiquyet57-tronbo4sanpham-2026/`.
 */

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const BASE_PREFIX = '/cum1-nghiquyet57-tronbo4sanpham-2026';
const PORT = Number(process.env.PORT || 4175);
const HOST = '127.0.0.1';

const MIME_MAP = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.vtt': 'text/vtt; charset=utf-8',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
  console.error('KHONG TIM THAY thu muc dist/. Hay chay "pnpm run build" truoc khi trinh chieu offline.');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url || '/', `http://${HOST}:${PORT}`);
  let reqPath = decodeURIComponent(reqUrl.pathname);

  if (reqPath === '/' || reqPath === BASE_PREFIX) {
    res.writeHead(302, { Location: `${BASE_PREFIX}/` });
    res.end();
    return;
  }

  if (reqPath.startsWith(BASE_PREFIX)) {
    reqPath = reqPath.slice(BASE_PREFIX.length) || '/';
  }

  if (reqPath === '/') reqPath = '/index.html';

  const safeRel = path.normalize(reqPath).replace(/^(\.\.[/\\])+/, '').replace(/^[/\\]+/, '');
  let filePath = path.join(DIST_DIR, safeRel);

  if (!filePath.startsWith(DIST_DIR) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_MAP[ext] || 'application/octet-stream';
  const stat = fs.statSync(filePath);
  const rangeHeader = req.headers.range;

  if (rangeHeader && ext === '.mp4') {
    const match = /bytes=(\d+)-(\d*)/.exec(rangeHeader);
    if (match) {
      const start = Number(match[1]);
      const end = match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;
      if (start >= stat.size || start > end) {
        res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` });
        res.end();
        return;
      }
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
        'Content-Type': contentType,
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
      return;
    }
  }

  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size,
    'Accept-Ranges': 'bytes',
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`LAC HONG SO Offline Server dang chay tai: http://${HOST}:${PORT}${BASE_PREFIX}/`);
  console.log('Nhan Ctrl+C de dung may chu.');
});
