const Busboy = require('busboy');
const path = require('path');
const { put } = require('@vercel/blob');
const { query } = require('../_lib/db');

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

    busboy.on('field', (name, value) => {
      fields[name] = value;
    });

    busboy.on('file', (name, stream, info) => {
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

    busboy.on('finish', () => resolve({ fields, file, fileTooBig }));
    busboy.on('error', reject);
    busboy.end(rawBody);
  });
}

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const result = await query(
        'SELECT * FROM experiencias ORDER BY created_at DESC'
      );
      return res.status(200).json({ success: true, data: result.rows });
    }

    if (req.method === 'POST') {
      const rawBody = await readRawBody(req);
      const { fields, file, fileTooBig } = await parseMultipart(req, rawBody);

      if (fileTooBig) {
        return res.status(400).json({
          success: false,
          message: 'La foto supera el tamaño máximo de 4MB'
        });
      }
      if (file && file.invalid) {
        return res.status(400).json({
          success: false,
          message: 'Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'
        });
      }

      let { nombre, departamento, experiencia } = fields;
      if (!nombre || !departamento || !experiencia) {
        return res.status(400).json({
          success: false,
          message: 'Faltan campos requeridos: nombre, departamento y experiencia'
        });
      }

      nombre = sanitizeInput(nombre);
      departamento = sanitizeInput(departamento);
      experiencia = sanitizeInput(experiencia);

      if (nombre.length < 3 || nombre.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'El nombre debe tener entre 3 y 100 caracteres'
        });
      }
      if (experiencia.length < 10 || experiencia.length > 500) {
        return res.status(400).json({
          success: false,
          message: 'La experiencia debe tener entre 10 y 500 caracteres'
        });
      }

      let foto_url = null;
      if (file) {
        const blob = await put(`fotos/experiencia${file.ext}`, file.buffer, {
          access: 'public',
          contentType: file.mimeType,
          addRandomSuffix: true
        });
        foto_url = blob.url;
      }

      const result = await query(
        'INSERT INTO experiencias (nombre, departamento, experiencia, foto_url) VALUES ($1, $2, $3, $4) RETURNING *',
        [nombre, departamento, experiencia, foto_url]
      );

      return res.status(201).json({
        success: true,
        message: 'Experiencia compartida exitosamente',
        data: result.rows[0]
      });
    }

    res.setHeader('Allow', 'GET, POST');
    return res
      .status(405)
      .json({ success: false, message: 'Método no permitido' });
  } catch (error) {
    console.error('Error en /api/experiencias:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Error interno del servidor' });
  }
};
