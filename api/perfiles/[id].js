const { borrarImagen } = require('../_lib/cloudinary');
const { query } = require('../_lib/db');
const { enforceRateLimit } = require('../_lib/rateLimit');

function requireAdmin(req) {
  const adminKey = process.env.ADMIN_API_KEY;
  return Boolean(adminKey) && req.headers['x-api-key'] === adminKey;
}

module.exports = async (req, res) => {
  const { id } = req.query;

  if (!/^\d+$/.test(String(id))) {
    return res.status(400).json({ success: false, message: 'ID inválido' });
  }

  if (
    enforceRateLimit(req, res, {
      name: req.method === 'DELETE' ? 'exp-delete' : 'perfil-read',
      max: req.method === 'DELETE' ? 20 : 60,
      windowMs: 60 * 1000
    })
  ) {
    return;
  }

  try {
    if (req.method === 'GET') {
      const result = await query('SELECT * FROM perfiles WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Perfil no encontrado' });
      }
      return res.status(200).json({ success: true, data: result.rows[0] });
    }

    if (req.method === 'DELETE') {
      if (!requireAdmin(req)) {
        return res
          .status(401)
          .json({ success: false, message: 'No autorizado' });
      }

      const existing = await query(
        'SELECT foto_public_id FROM perfiles WHERE id = $1',
        [id]
      );
      if (existing.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Perfil no encontrado' });
      }

      const publicId = existing.rows[0].foto_public_id;
      if (publicId) {
        try {
          await borrarImagen(publicId);
        } catch (e) {
          console.error('No se pudo eliminar la foto de Cloudinary:', e);
        }
      }

      await query('DELETE FROM perfiles WHERE id = $1', [id]);
      return res
        .status(200)
        .json({ success: true, message: 'Perfil eliminado' });
    }

    res.setHeader('Allow', 'GET, DELETE');
    return res
      .status(405)
      .json({ success: false, message: 'Método no permitido' });
  } catch (error) {
    console.error('Error en /api/perfiles/[id]:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Error interno del servidor' });
  }
};
