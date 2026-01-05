const pool = require('./config/database');

async function dropBadIndex() {
    try {
        console.log('Dropping bad unique constraint/index on Reportes.cliente...');
        await pool.query('ALTER TABLE "Reportes" DROP CONSTRAINT IF EXISTS "Reportes_cliente_key";');
        await pool.query('DROP INDEX IF EXISTS "Reportes_cliente_key";');
        console.log('Drop successful.');
        process.exit(0);
    } catch (err) {
        console.error('Error dropping index:', err);
        process.exit(1);
    }
}

dropBadIndex();
