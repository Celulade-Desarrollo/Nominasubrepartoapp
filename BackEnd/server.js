
const poolL =require('./config/database.js')

console.log('Starting server...');

poolL.query(`SELECT "AreasTrabajos"."NombreArea" FROM "AreasTrabajos"`, (err, res) => {
  if (err) {
    console.error("❌ Error al conectar:", err);
  } else {
    console.log("✅ Conexión exitosa! Hora del servidor:", res.rows);
  }
});