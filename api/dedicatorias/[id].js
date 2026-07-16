const { query } = require('../_lib/db');
const { enforceRateLimit } = require('../_lib/rateLimit');

function requireAdmin(req) {
  const adminKey = process.env.ADMIN_API_KEY;
  return Boolean(adminKey) && req.headers['x-api-key'] === adminKey;
}

// Moderación: eliminar una dedicatoria puntual (solo admin)
module.exports = async (req, res) => {
  const { id } = req.query;

  if (!/^\d+$/.test(String(id))) {
    return res.status(400).json({ success: false, message: 'ID inválido' });
  }

  if (
    enforceRateLimit(req, res, {
      name: 'exp-delete',
      max: 20,
      windowMs: 60 * 1000
    })
  ) {
    return;
  }

  try {
    if (req.method === 'DELETE') {
      if (!requireAdmin(req)) {
        return res
          .status(401)
          .json({ success: false, message: 'No autorizado' });
      }
      const r = await query(
        'DELETE FROM dedicatorias WHERE id = $1 RETURNING id',
        [id]
      );
      if (r.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Dedicatoria no encontrada' });
      }
      return res
        .status(200)
        .json({ success: true, message: 'Dedicatoria eliminada' });
    }

    res.setHeader('Allow', 'DELETE');
    return res
      .status(405)
      .json({ success: false, message: 'Método no permitido' });
  } catch (error) {
    console.error('Error en /api/dedicatorias/[id]:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Error interno del servidor' });
  }
};
