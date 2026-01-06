const poolL = require("../config/database")

function GetAreas(req, resp) {

  poolL.query(
    `SELECT "id", "nombre_area", "activo", "created_at" FROM "AreasTrabajos"`,
    (err, res) => {
      if (err) {
        resp.status(err.status || 500).json({ error: err.message });
        console.error("❌ Error al conectar:", err);
      } else {
        resp.json(res.rows);
      }
    }
  );
}

function GetAreaById(req, resp) {
  poolL.query(
    `SELECT "id", "nombre_area", "activo", "created_at" FROM "AreasTrabajos" WHERE "id" = $1`,
    [req.params.id],
    (err, res) => {
      if (err) {
        resp.status(err.status || 500).json({ error: err.message });
        console.error("❌ Error al conectar:", err);
      } else {
        resp.json(res.rows[0]);
      }
    }
  );
}
;
function PostAreaByName(req, resp) {
  poolL.query(
    `INSERT INTO "AreasTrabajos"("nombre_area") VALUES ($1) RETURNING *`,
    [req.body.nombre_area],
    (err, res) => {
      if (err) {
        resp.status(err.status || 500).json({ error: err.message });
        console.error("❌ Error al conectar:", err);
      } else {
        resp.json(res.rows[0]);
      }
    }
  );
}
;
function PutAreaById(req, resp) {
  const nombreArea = req.body.nombre_area;
  const activo = req.body.activo;
  const id = req.params.id;

  let comandoSQL;
  let valores = [];


  if (nombreArea && activo !== undefined) {

    comandoSQL = `UPDATE "AreasTrabajos" SET "nombre_area"=$1, "activo"=$2 WHERE "id"=$3 `;
    valores = [nombreArea, activo, id];

  }
  else if (nombreArea) {
    comandoSQL = `UPDATE "AreasTrabajos" SET "nombre_area"=$1 Where "id"=$2`;
    valores = [nombreArea, id];

  }
  else if (activo !== undefined) {

    comandoSQL = `UPDATE "AreasTrabajos" SET "activo"=$1 Where "id"=$2`;
    valores = [activo, id];
  }
  else {
    resp.status(400).json({ error: "No se proporcionaron campos para actualizar" });
    return;
  }





  poolL.query(
    comandoSQL,
    valores,
    (err, res) => {
      if (err) {
        resp.status(err.status || 500).json({ error: err.message });
        console.error("❌ Error al conectar:", err);
      } else {
        resp.json(res.rows[0]);
      }
    }
  );
}

module.exports = { GetAreas, GetAreaById, PostAreaByName, PutAreaById };