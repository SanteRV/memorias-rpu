const { put } = require('@vercel/blob');
const { subirImagen, cloudinaryConfigurado } = require('../_lib/cloudinary');
const { query } = require('../_lib/db');
const { enforceRateLimit } = require('../_lib/rateLimit');
const {
  sanitizeInput,
  readRawBody,
  parseMultipart,
  isRealImage
} = require('../_lib/upload');

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      if (
        enforceRateLimit(req, res, {
          name: 'perfil-read',
          max: 60,
          windowMs: 60 * 1000
        })
      ) {
        return;
      }
      const result = await query(
        `SELECT p.*,
                (SELECT count(*)::int FROM dedicatorias d WHERE d.perfil_id = p.id) AS dedicatorias
         FROM perfiles p
         ORDER BY p.created_at ASC`
      );
      return res.status(200).json({ success: true, data: result.rows });
    }

    if (req.method === 'POST') {
      // Máximo 5 perfiles por hora e IP (normalmente cada quien crea 1)
      if (
        enforceRateLimit(req, res, {
          name: 'perfil-write',
          max: 5,
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

      const rejectPost = (message, motivo) => {
        console.warn(
          `[PERFIL 400] ${motivo} | archivo=${fileMeta ? `${fileMeta.filename} (${fileMeta.mimeType})` : 'sin foto'}`
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
          'Esa foto no tiene un formato compatible. Usa JPG, PNG o WEBP.',
          'tipo/extension no permitido'
        );
      }

      let { nombre, universidad, departamento, frase } = fields;
      if (!nombre || !universidad || !departamento || !frase) {
        return rejectPost(
          'Faltan campos: nombre, universidad, departamento y frase',
          'campos faltantes'
        );
      }

      nombre = sanitizeInput(nombre);
      universidad = sanitizeInput(universidad);
      departamento = sanitizeInput(departamento);
      frase = sanitizeInput(frase);

      if (nombre.length < 3 || nombre.length > 100) {
        return rejectPost(
          'El nombre debe tener entre 3 y 100 caracteres',
          'longitud de nombre'
        );
      }
      if (universidad.length < 2 || universidad.length > 120) {
        return rejectPost(
          'La universidad debe tener entre 2 y 120 caracteres',
          'longitud de universidad'
        );
      }
      if (departamento.length > 60) {
        return rejectPost('Departamento inválido', 'departamento');
      }
      if (frase.length < 5 || frase.length > 200) {
        return rejectPost(
          'La frase debe tener entre 5 y 200 caracteres',
          'longitud de frase'
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
          const subida = await subirImagen(file.buffer);
          foto_url = subida.secure_url;
          foto_public_id = subida.public_id;
        } else {
          const blob = await put(`perfiles/foto${file.ext}`, file.buffer, {
            access: 'public',
            contentType: file.mimeType,
            addRandomSuffix: true
          });
          foto_url = blob.url;
        }
      }

      const result = await query(
        'INSERT INTO perfiles (nombre, universidad, departamento, frase, foto_url, foto_public_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [nombre, universidad, departamento, frase, foto_url, foto_public_id]
      );

      return res.status(201).json({
        success: true,
        message: '¡Bienvenido(a) al anuario!',
        data: result.rows[0]
      });
    }

    res.setHeader('Allow', 'GET, POST');
    return res
      .status(405)
      .json({ success: false, message: 'Método no permitido' });
  } catch (error) {
    console.error('Error en /api/perfiles:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Error interno del servidor' });
  }
};
