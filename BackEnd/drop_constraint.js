const pool = require('./config/database');

async function dropConstraint() {
    try {
        console.log('Dropping constraint "Reportes_usuarioID_key"...');
        await pool.query('ALTER TABLE "Reportes" DROP CONSTRAINT IF EXISTS "Reportes_usuarioID_key";');
        console.log('Constraint dropped successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error removing constraint:', err);
        process.exit(1);
    }
}

dropConstraint();
