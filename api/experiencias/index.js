const Busboy = require('busboy');
const path = require('path');
const { put } = require('@vercel/blob');
const { subirImagen, cloudinaryConfigurado } = require('../_lib/cloudinary');
const { query } = require('../_lib/db');
const { enforceRateLimit } = require('../_lib/rateLimit');

// Vercel limita el body a ~4.5MB, dejamos margen
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = /jpeg|jpg|png|gif|webp/;

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

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      // Límite generoso para lectura (evita scraping masivo)
      if (
        enforceRateLimit(req, res, {
          name: 'exp-read',
          max: 60,
          windowMs: 60 * 1000
        })
      ) {
        return;
      }
      const result = await query(
        'SELECT * FROM experiencias ORDER BY created_at DESC'
      );
      return res.status(200).json({ success: true, data: result.rows });
    }

    if (req.method === 'POST') {
      // Límite estricto para escritura: 10 publicaciones por hora e IP
      if (
        enforceRateLimit(req, res, {
          name: 'exp-write',
          max: 10,
          windowMs: 60 * 60 * 1000
        })
      ) {
        return;
      }

      const rawBody = await readRawBody(req);
      const { fields, file, fileTooBig, fileMeta } = await parseMultipart(
        req,
        rawBody
      );

      // Registra el motivo de un rechazo (sin datos personales) para diagnóstico
      const rejectPost = (message, motivo) => {
        console.warn(
          `[POST 400] ${motivo} | archivo=${fileMeta ? `${fileMeta.filename} (${fileMeta.mimeType})` : 'sin foto'} | nombreLen=${(fields.nombre || '').length} | expLen=${(fields.experiencia || '').length}`
        );
        return res.status(400).json({ success: false, message });
      };

      if (fileTooBig) {
        return rejectPost(
          'La foto supera el tamaño máximo de 4MB',
          'archivo demasiado grande'
        );
      }
      if (file && file.invalid) {
        return rejectPost(
          'Esa foto no tiene un formato compatible. Usa JPG, PNG o WEBP (si es de iPhone, actívalo en Ajustes › Cámara › Formatos › "Más compatible", o toma captura de pantalla).',
          'tipo/extension no permitido'
        );
      }

      let { nombre, departamento, experiencia } = fields;
      if (!nombre || !departamento || !experiencia) {
        return rejectPost(
          'Faltan campos requeridos: nombre, departamento y experiencia',
          'campos faltantes'
        );
      }

      nombre = sanitizeInput(nombre);
      departamento = sanitizeInput(departamento);
      experiencia = sanitizeInput(experiencia);

      if (nombre.length < 3 || nombre.length > 100) {
        return rejectPost(
          'El nombre debe tener entre 3 y 100 caracteres',
          'longitud de nombre'
        );
      }
      if (experiencia.length < 10 || experiencia.length > 500) {
        return rejectPost(
          'La experiencia debe tener entre 10 y 500 caracteres',
          'longitud de experiencia'
        );
      }

      if (file && !file.invalid && !isRealImage(file.buffer)) {
        return rejectPost(
          'El archivo no es una imagen válida',
          'magic bytes no coinciden'
        );
      }

      let foto_url = null;
      let foto_public_id = null;
      if (file) {
        if (cloudinaryConfigurado()) {
          // Nuevo: Cloudinary (más espacio, CDN y optimización)
          const subida = await subirImagen(file.buffer);
          foto_url = subida.secure_url;
          foto_public_id = subida.public_id;
        } else {
          // Respaldo: Vercel Blob (mientras no estén las claves de Cloudinary)
          const blob = await put(`fotos/experiencia${file.ext}`, file.buffer, {
            access: 'public',
            contentType: file.mimeType,
            addRandomSuffix: true
          });
          foto_url = blob.url;
        }
      }

      const result = await query(
        'INSERT INTO experiencias (nombre, departamento, experiencia, foto_url, foto_public_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nombre, departamento, experiencia, foto_url, foto_public_id]
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
