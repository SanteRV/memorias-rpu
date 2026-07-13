// Rate limiting en memoria por instancia serverless. Se reinicia en cada
// cold start: no reemplaza a un WAF, pero frena picos de abuso y scraping
// sin infraestructura extra. Cada endpoint pasa su propio nombre/límite.
const buckets = new Map();

function clientIp(req) {
  return (
    req.headers['x-real-ip'] ||
    String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    'unknown'
  );
}

/**
 * @returns {{ limited: boolean, retryAfter?: number }}
 */
function rateLimit(req, { name, max, windowMs }) {
  const key = `${name}:${clientIp(req)}`;
  const now = Date.now();
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs);

  if (hits.length >= max) {
    const retryMs = windowMs - (now - hits[0]);
    return { limited: true, retryAfter: Math.max(1, Math.ceil(retryMs / 1000)) };
  }

  hits.push(now);
  buckets.set(key, hits);
  // Tope de memoria por instancia
  if (buckets.size > 10000) buckets.clear();
  return { limited: false };
}

/** Aplica el límite y responde 429 si corresponde. Devuelve true si cortó. */
function enforceRateLimit(req, res, opts) {
  const result = rateLimit(req, opts);
  if (result.limited) {
    res.setHeader('Retry-After', String(result.retryAfter));
    res.status(429).json({
      success: false,
      message: 'Demasiadas solicitudes, intente de nuevo más tarde'
    });
    return true;
  }
  return false;
}

module.exports = { rateLimit, enforceRateLimit, clientIp };
