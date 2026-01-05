const poolL=require("../config/database")

function GetClientes(req, resp) {

poolL.query(`SELECT "Companies"."nombre_company" FROM "Companies"`, (err, res) => {
  if (err) {
    resp.status(err.status || 500).json({ error: err.message });
    console.error("❌ Error al conectar:", err);
  } else {
    resp.json(res.rows);
  }
});
}

function GetClienteById(req, resp) {
  poolL.query(
    `SELECT "Companies"."nombre_company" FROM "Companies" WHERE "Companies"."elemento_pep" = $1`,
    [req.params.elemento_pep],
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

function PostClienteByName(req, resp) {
  poolL.query(
    `INSERT INTO "Companies"("nombre_company","elemento_pep") VALUES ($1,$2) RETURNING *`,
    [req.body.nombre_company, req.body.elemento_pep],
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

function PutClienteById(req, resp) {
 const nombreCliente=req.body.nombre_area;
 const elementoPEP=req.body.elemento_pep;
 const id=req.params.id;

 let comandoSQL;
 let valores=[];


 if(nombreArea && elementoPEP!==undefined){

  comandoSQL= `UPDATE "Companies" SET "nombre_company"=$1, "elemento_pep"=$2 WHERE "id"=$3 `;
  valores = [nombreArea, elementoPEP, id];

 }
 else if(nombreArea){
  comandoSQL=`UPDATE "Companies" SET "nombre_company"=$1 Where "id"=$2`;
  valores=[nombreArea, id];

 }
  else if(elementoPEP!==undefined  ){
  comandoSQL=`UPDATE "Companies" SET "elemento_pep"=$1 Where "id"=$2`;
  valores=[elementoPEP, id];
  }
  else{
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

module.exports = { GetClientes, GetClienteById, PostClienteByName, PutClienteById };