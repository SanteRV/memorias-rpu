const { Client } = require('pg');
require('dotenv').config();

async function setupDatabase() {
  // Primero conectarse a la base de datos 'postgres' por defecto
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres', // Base de datos por defecto
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    await client.connect();
    console.log('✓ Conectado a PostgreSQL');

    // Verificar si la base de datos ya existe
    const checkDB = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'intercambio_nacional'"
    );

    if (checkDB.rows.length === 0) {
      // Crear la base de datos
      await client.query('CREATE DATABASE intercambio_nacional');
      console.log('✓ Base de datos "intercambio_nacional" creada exitosamente');
    } else {
      console.log('⚠ La base de datos "intercambio_nacional" ya existe');
    }

    await client.end();

    // Ahora conectarse a la nueva base de datos y crear las tablas
    const dbClient = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: 'intercambio_nacional',
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    await dbClient.connect();
    console.log('✓ Conectado a la base de datos "intercambio_nacional"');

    // Crear la tabla experiencias
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS experiencias (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        ciudad VARCHAR(255) NOT NULL,
        experiencia TEXT NOT NULL,
        foto_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Tabla "experiencias" creada exitosamente');

    // Crear índices
    await dbClient.query(`
      CREATE INDEX IF NOT EXISTS idx_experiencias_ciudad ON experiencias(ciudad);
    `);
    console.log('✓ Índice en ciudad creado');

    await dbClient.query(`
      CREATE INDEX IF NOT EXISTS idx_experiencias_created_at ON experiencias(created_at DESC);
    `);
    console.log('✓ Índice en created_at creado');

    // Crear función para actualizar updated_at
    await dbClient.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    console.log('✓ Función update_updated_at_column creada');

    // Verificar si el trigger ya existe antes de crearlo
    const checkTrigger = await dbClient.query(`
      SELECT 1 FROM pg_trigger WHERE tgname = 'update_experiencias_updated_at';
    `);

    if (checkTrigger.rows.length === 0) {
      await dbClient.query(`
        CREATE TRIGGER update_experiencias_updated_at
        BEFORE UPDATE ON experiencias
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `);
      console.log('✓ Trigger update_experiencias_updated_at creado');
    } else {
      console.log('⚠ Trigger update_experiencias_updated_at ya existe');
    }

    // Verificar que todo esté funcionando
    const result = await dbClient.query('SELECT COUNT(*) FROM experiencias');
    console.log(`✓ Tabla verificada. Total de experiencias: ${result.rows[0].count}`);

    await dbClient.end();

    console.log('\n🎉 ¡Base de datos configurada exitosamente!');
    console.log('📝 Ahora puedes usar la aplicación para compartir experiencias');

  } catch (error) {
    console.error('❌ Error al configurar la base de datos:', error.message);
    process.exit(1);
  }
}

setupDatabase();
