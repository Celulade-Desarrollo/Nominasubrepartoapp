const pool = require('./config/database');

async function refactorDBToPEP() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('1. Ensuring Companies.elemento_pep is UNIQUE...');
        // We might need to handle duplicates if any, but assuming cleanliness for now or error will raise.
        await client.query('ALTER TABLE "Companies" ADD CONSTRAINT "Companies_elemento_pep_key" UNIQUE ("elemento_pep");');

        console.log('2. Dropping FK constraint on Reportes...');
        await client.query('ALTER TABLE "Reportes" DROP CONSTRAINT IF EXISTS "Reportes_cliente_fkey";');

        console.log('3. Converting Reportes.cliente column back to TEXT to hold PEP...');
        // Converting UUID column to text.
        await client.query('ALTER TABLE "Reportes" ALTER COLUMN "cliente" TYPE text;');

        console.log('4. Cleaning Reportes table (TRUNCATE) to avoid FK inconsistencies...');
        await client.query('TRUNCATE TABLE "Reportes";');

        console.log('5. Adding new FK constraint referencing Companies(elemento_pep)...');
        await client.query('ALTER TABLE "Reportes" ADD CONSTRAINT "Reportes_cliente_fkey" FOREIGN KEY ("cliente") REFERENCES "Companies"("elemento_pep") ON UPDATE CASCADE;');

        await client.query('COMMIT');
        console.log('Database refactor to PEP successful!');
        process.exit(0);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error during refactor:', err);
        process.exit(1);
    } finally {
        client.release();
    }
}

refactorDBToPEP();
