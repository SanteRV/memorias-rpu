const { Client } = require('pg');
require('dotenv').config();

async function migrateToDepartamento() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'intercambio_nacional',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    await client.connect();
    console.log('✓ Conectado a la base de datos');

    // Renombrar columna ciudad a departamento
    await client.query(`
      ALTER TABLE experiencias
      RENAME COLUMN ciudad TO departamento;
    `);
    console.log('✓ Columna renombrada de "ciudad" a "departamento"');

    // Actualizar el índice
    await client.query(`
      DROP INDEX IF EXISTS idx_experiencias_ciudad;
    `);
    console.log('✓ Índice antiguo eliminado');

    await client.query(`
      CREATE INDEX idx_experiencias_departamento ON experiencias(departamento);
    `);
    console.log('✓ Nuevo índice en "departamento" creado');

    // Verificar cambios
    const result = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'experiencias';
    `);

    console.log('\n✓ Estructura de la tabla actualizada:');
    result.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });

    await client.end();
    console.log('\n🎉 Migración completada exitosamente!');

  } catch (error) {
    console.error('❌ Error en la migración:', error.message);
    process.exit(1);
  }
}

migrateToDepartamento();
