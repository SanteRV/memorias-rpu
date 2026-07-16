const { query } = require('../../_lib/db');
const { enforceRateLimit } = require('../../_lib/rateLimit');
const { sanitizeInput } = require('../../_lib/upload');

module.exports = async (req, res) => {
  const { id } = req.query;

  if (!/^\d+$/.test(String(id))) {
    return res.status(400).json({ success: false, message: 'ID inválido' });
  }

  try {
    if (req.method === 'GET') {
      if (
        enforceRateLimit(req, res, {
          name: 'dedi-read',
          max: 120,
          windowMs: 60 * 1000
        })
      ) {
        return;
      }
      const r = await query(
        'SELECT id, de_nombre, mensaje, created_at FROM dedicatorias WHERE perfil_id = $1 ORDER BY created_at ASC',
        [id]
      );
      return res.status(200).json({ success: true, data: r.rows });
    }

    if (req.method === 'POST') {
      // Hasta 10 dedicatorias por hora e IP
      if (
        enforceRateLimit(req, res, {
          name: 'dedi-write',
          max: 10,
          windowMs: 60 * 60 * 1000
        })
      ) {
        return;
      }

      const perfil = await query('SELECT id FROM perfiles WHERE id = $1', [id]);
      if (perfil.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Perfil no encontrado' });
      }

      const body = req.body || {};
      const de_nombre = sanitizeInput(String(body.de_nombre || ''));
      const mensaje = sanitizeInput(String(body.mensaje || ''));

      if (de_nombre.length < 2 || de_nombre.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Tu nombre debe tener entre 2 y 100 caracteres'
        });
      }
      if (mensaje.length < 5 || mensaje.length > 300) {
        return res.status(400).json({
          success: false,
          message: 'La dedicatoria debe tener entre 5 y 300 caracteres'
        });
      }

      const r = await query(
        'INSERT INTO dedicatorias (perfil_id, de_nombre, mensaje) VALUES ($1, $2, $3) RETURNING id, de_nombre, mensaje, created_at',
        [id, de_nombre, mensaje]
      );
      return res.status(201).json({ success: true, data: r.rows[0] });
    }

    res.setHeader('Allow', 'GET, POST');
    return res
      .status(405)
      .json({ success: false, message: 'Método no permitido' });
  } catch (error) {
    console.error('Error en /api/perfiles/[id]/dedicatorias:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Error interno del servidor' });
  }
};
