const { query } = require('../../_lib/db');
const { enforceRateLimit } = require('../../_lib/rateLimit');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res
      .status(405)
      .json({ success: false, message: 'Método no permitido' });
  }

  if (
    enforceRateLimit(req, res, {
      name: 'exp-read',
      max: 60,
      windowMs: 60 * 1000
    })
  ) {
    return;
  }

  try {
    const { departamento } = req.query;
    // Limitar longitud del parámetro de búsqueda
    if (typeof departamento === 'string' && departamento.length > 60) {
      return res
        .status(400)
        .json({ success: false, message: 'Parámetro inválido' });
    }
    const result = await query(
      'SELECT * FROM experiencias WHERE LOWER(departamento) LIKE LOWER($1) ORDER BY created_at DESC',
      [`%${departamento}%`]
    );
    return res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error en /api/experiencias/departamento:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Error interno del servidor' });
  }
};
