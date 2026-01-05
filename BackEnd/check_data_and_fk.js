const pool = require('./config/database');

async function checkDataAndFK() {
    try {
        const targetId = 'de9b2482-c126-4c71-b762-b2cebfbfa0d8';

        // Check FK definition correctly quoted
        const resFK = await pool.query(`
      SELECT conname, pg_get_constraintdef(oid)
      FROM pg_constraint
      WHERE conrelid = '"Reportes"'::regclass AND contype = 'f';
    `);
        console.log('FK Constraints on Reportes:', resFK.rows);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDataAndFK();
