const { del } = require('@vercel/blob');
const { query } = require('../_lib/db');
const { enforceRateLimit } = require('../_lib/rateLimit');

function requireAdmin(req) {
  const adminKey = process.env.ADMIN_API_KEY;
  return Boolean(adminKey) && req.headers['x-api-key'] === adminKey;
}

module.exports = async (req, res) => {
  const { id } = req.query;

  if (!/^\d+$/.test(String(id))) {
    return res
      .status(400)
      .json({ success: false, message: 'ID inválido' });
  }

  // Rate limit por instancia: lecturas amplias, borrados muy acotados
  const isDelete = req.method === 'DELETE';
  if (
    enforceRateLimit(req, res, {
      name: isDelete ? 'exp-delete' : req.method === 'POST' ? 'exp-like' : 'exp-read',
      max: isDelete ? 20 : req.method === 'POST' ? 120 : 60,
      windowMs: 60 * 1000
    })
  ) {
    return;
  }

  try {
    // POST = reaccionar (like / unlike). Público, solo mueve el contador.
    if (req.method === 'POST') {
      const accion = req.body && req.body.accion;
      const delta = accion === 'unlike' ? -1 : 1;
      const result = await query(
        'UPDATE experiencias SET reacciones = GREATEST(0, reacciones + $1) WHERE id = $2 RETURNING reacciones',
        [delta, id]
      );
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Experiencia no encontrada' });
      }
      return res
        .status(200)
        .json({ success: true, reacciones: result.rows[0].reacciones });
    }

    if (req.method === 'GET') {
      const result = await query('SELECT * FROM experiencias WHERE id = $1', [
        id
      ]);
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Experiencia no encontrada' });
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
        'SELECT foto_url FROM experiencias WHERE id = $1',
        [id]
      );
      if (existing.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Experiencia no encontrada' });
      }

      const fotoUrl = existing.rows[0].foto_url;
      if (fotoUrl && fotoUrl.startsWith('http')) {
        try {
          await del(fotoUrl);
        } catch (blobError) {
          // La foto puede no existir ya en Blob; no bloquea el borrado
          console.error('No se pudo eliminar la foto del Blob:', blobError);
        }
      }

      await query('DELETE FROM experiencias WHERE id = $1', [id]);
      return res
        .status(200)
        .json({ success: true, message: 'Experiencia eliminada exitosamente' });
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res
      .status(405)
      .json({ success: false, message: 'Método no permitido' });
  } catch (error) {
    console.error('Error en /api/experiencias/[id]:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Error interno del servidor' });
  }
};
