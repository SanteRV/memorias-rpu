const { query } = require('../_lib/db');
const { enforceRateLimit } = require('../_lib/rateLimit');

// Todas las dedicatorias (para armar el anuario imprimible)
module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res
      .status(405)
      .json({ success: false, message: 'Método no permitido' });
  }

  if (
    enforceRateLimit(req, res, {
      name: 'dedi-read',
      max: 120,
      windowMs: 60 * 1000
    })
  ) {
    return;
  }

  try {
    const r = await query(
      'SELECT id, perfil_id, de_nombre, mensaje FROM dedicatorias ORDER BY perfil_id, created_at ASC'
    );
    return res.status(200).json({ success: true, data: r.rows });
  } catch (error) {
    console.error('Error en /api/dedicatorias:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Error interno del servidor' });
  }
};
