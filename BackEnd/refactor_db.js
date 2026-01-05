const pool = require('./config/database');

async function refactorDB() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('Dropping incorrect FK constraint...');
        await client.query('ALTER TABLE "Reportes" DROP CONSTRAINT IF EXISTS "Reportes_cliente_fkey";');

        console.log('Cleaning up invalid data (non-UUID values) from "cliente" column...');
        // Delete rows where cliente is not a valid UUID
        // Using regex to match UUID structure
        await client.query(`DELETE FROM "Reportes" WHERE "cliente" IS NOT NULL AND "cliente" !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';`);

        console.log('Converting "cliente" column to UUID...');
        await client.query('ALTER TABLE "Reportes" ALTER COLUMN "cliente" TYPE uuid USING "cliente"::uuid;');

        console.log('Adding correct FK constraint referencing Companies(id)...');
        await client.query('ALTER TABLE "Reportes" ADD CONSTRAINT "Reportes_cliente_fkey" FOREIGN KEY ("cliente") REFERENCES "Companies"("id");');

        await client.query('COMMIT');
        console.log('Database refactor successful!');
        process.exit(0);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error during refactor:', err);
        process.exit(1);
    } finally {
        client.release();
    }
}

refactorDB();
