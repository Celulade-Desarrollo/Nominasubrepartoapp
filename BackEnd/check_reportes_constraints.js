const pool = require('./config/database');

async function checkReportesConstraints() {
    try {
        const res = await pool.query(`
      SELECT conname, pg_get_constraintdef(oid)
      FROM pg_constraint
      WHERE conrelid = '"Reportes"'::regclass;
    `);
        console.log('Constraints on Reportes:', res.rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkReportesConstraints();
