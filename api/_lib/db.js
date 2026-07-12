const { Pool } = require('pg');

// En Vercel la integración de Neon/Postgres inyecta la URL de conexión.
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL;

let pool;
let tableReady;

function getPool() {
  if (!pool) {
    if (!connectionString) {
      throw new Error(
        'Base de datos no configurada: falta DATABASE_URL / POSTGRES_URL'
      );
    }
    pool = new Pool({
      connectionString,
      // Neon exige SSL; en local (localhost) se omite
      ssl: connectionString.includes('localhost')
        ? false
        : { rejectUnauthorized: false },
      max: 1 // una conexión por instancia serverless
    });
  }
  return pool;
}

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS experiencias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    departamento VARCHAR(255) NOT NULL,
    experiencia TEXT NOT NULL,
    foto_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_experiencias_departamento
    ON experiencias (departamento);
  CREATE INDEX IF NOT EXISTS idx_experiencias_created_at
    ON experiencias (created_at DESC);
`;

async function query(text, params) {
  const p = getPool();
  if (!tableReady) {
    tableReady = p.query(SCHEMA);
  }
  await tableReady;
  return p.query(text, params);
}

module.exports = { query };
