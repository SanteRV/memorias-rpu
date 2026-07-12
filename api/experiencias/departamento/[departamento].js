const { query } = require('../../_lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res
      .status(405)
      .json({ success: false, message: 'Método no permitido' });
  }

  try {
    const { departamento } = req.query;
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
