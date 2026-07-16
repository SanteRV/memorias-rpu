const Busboy = require('busboy');
const path = require('path');

// Vercel limita el body a ~4.5MB, dejamos margen
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = /jpeg|jpg|png|gif|webp/;

function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '').substring(0, 500);
}

function readRawBody(req) {
  if (Buffer.isBuffer(req.body)) return Promise.resolve(req.body);
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function parseMultipart(req, rawBody) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({
      headers: req.headers,
      limits: { fileSize: MAX_FILE_SIZE, files: 1 }
    });
    const fields = {};
    let file = null;
    let fileTooBig = false;
    let fileMeta = null;

    busboy.on('field', (name, value) => {
      fields[name] = value;
    });

    busboy.on('file', (name, stream, info) => {
      fileMeta = { filename: info.filename, mimeType: info.mimeType };
      const ext = path.extname(info.filename || '').toLowerCase();
      const okType =
        ALLOWED_TYPES.test(ext.slice(1)) && ALLOWED_TYPES.test(info.mimeType);
      const chunks = [];
      stream.on('limit', () => {
        fileTooBig = true;
        stream.resume();
      });
      stream.on('data', (c) => chunks.push(c));
      stream.on('end', () => {
        if (okType && !fileTooBig && chunks.length) {
          file = {
            buffer: Buffer.concat(chunks),
            ext,
            mimeType: info.mimeType,
            invalid: false
          };
        } else if (!okType && info.filename) {
          file = { invalid: true };
        }
      });
    });

    busboy.on('finish', () => resolve({ fields, file, fileTooBig, fileMeta }));
    busboy.on('error', reject);
    busboy.end(rawBody);
  });
}

// Verifica que el contenido del archivo sea realmente una imagen
// (magic bytes), no solo que la extensión lo diga.
function isRealImage(buffer) {
  if (!buffer || buffer.length < 12) return false;
  const jpg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const png =
    buffer[0] === 0x89 && buffer[1] === 0x50 &&
    buffer[2] === 0x4e && buffer[3] === 0x47;
  const gif =
    buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46;
  const webp =
    buffer[8] === 0x57 && buffer[9] === 0x45 &&
    buffer[10] === 0x42 && buffer[11] === 0x50;
  return jpg || png || gif || webp;
}

module.exports = {
  MAX_FILE_SIZE,
  ALLOWED_TYPES,
  sanitizeInput,
  readRawBody,
  parseMultipart,
  isRealImage
};
