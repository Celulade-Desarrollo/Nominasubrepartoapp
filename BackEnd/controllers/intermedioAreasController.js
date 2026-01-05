const poolL = require("../config/database");

// GET all intermedio areas
function GetIntermedio(req, resp) {
    poolL.query(
        `SELECT 
      i."id",
      i."created_at",
      i."company_cliente",
      i."area_cliente",
      c."nombre_company",
      a."nombre_area"
    FROM "IntermedioAreasEnCompany" i
    LEFT JOIN "Companies" c ON i."company_cliente" = c."id"
    LEFT JOIN "AreasTrabajos" a ON i."area_cliente" = a."id"
    ORDER BY i."created_at" DESC`,
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al obtener intermedio:", err);
            } else {
                resp.json(res.rows);
            }
        }
    );
}

// GET intermedio by ID
function GetIntermedioById(req, resp) {
    poolL.query(
        `SELECT 
      i."id",
      i."created_at",
      i."company_cliente",
      i."area_cliente",
      c."nombre_company",
      a."nombre_area"
    FROM "IntermedioAreasEnCompany" i
    LEFT JOIN "Companies" c ON i."company_cliente" = c."id"
    LEFT JOIN "AreasTrabajos" a ON i."area_cliente" = a."id"
    WHERE i."id" = $1`,
        [req.params.id],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al obtener intermedio:", err);
            } else {
                resp.json(res.rows[0]);
            }
        }
    );
}

// GET intermedio by Company ID (útil para obtener todas las áreas de una compañía)
function GetIntermedioByCompany(req, resp) {
    poolL.query(
        `SELECT 
      i."id",
      i."created_at",
      i."company_cliente",
      i."area_cliente",
      c."nombre_company",
      a."nombre_area"
    FROM "IntermedioAreasEnCompany" i
    LEFT JOIN "Companies" c ON i."company_cliente" = c."id"
    LEFT JOIN "AreasTrabajos" a ON i."area_cliente" = a."id"
    WHERE i."company_cliente" = $1
    ORDER BY a."nombre_area"`,
        [req.params.companyId],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al obtener intermedio por company:", err);
            } else {
                resp.json(res.rows);
            }
        }
    );
}

// POST create new intermedio (asignar área a compañía)
function PostIntermedio(req, resp) {
    const { company_cliente, area_cliente } = req.body;

    poolL.query(
        `INSERT INTO "IntermedioAreasEnCompany"("company_cliente", "area_cliente") VALUES ($1, $2) RETURNING *`,
        [company_cliente, area_cliente],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al crear intermedio:", err);
            } else {
                resp.status(201).json(res.rows[0]);
            }
        }
    );
}

// PUT update intermedio by ID
function PutIntermedioById(req, resp) {
    const { company_cliente, area_cliente } = req.body;
    const id = req.params.id;

    let comandoSQL;
    let valores = [];

    if (company_cliente && area_cliente) {
        comandoSQL = `UPDATE "IntermedioAreasEnCompany" SET "company_cliente"=$1, "area_cliente"=$2 WHERE "id"=$3 RETURNING *`;
        valores = [company_cliente, area_cliente, id];
    } else if (company_cliente) {
        comandoSQL = `UPDATE "IntermedioAreasEnCompany" SET "company_cliente"=$1 WHERE "id"=$2 RETURNING *`;
        valores = [company_cliente, id];
    } else if (area_cliente) {
        comandoSQL = `UPDATE "IntermedioAreasEnCompany" SET "area_cliente"=$1 WHERE "id"=$2 RETURNING *`;
        valores = [area_cliente, id];
    } else {
        resp.status(400).json({ error: "No se proporcionaron campos para actualizar" });
        return;
    }

    poolL.query(comandoSQL, valores, (err, res) => {
        if (err) {
            resp.status(err.status || 500).json({ error: err.message });
            console.error("❌ Error al actualizar intermedio:", err);
        } else {
            resp.json(res.rows[0]);
        }
    });
}

// DELETE intermedio by ID
function DeleteIntermedioById(req, resp) {
    poolL.query(
        `DELETE FROM "IntermedioAreasEnCompany" WHERE "id" = $1 RETURNING *`,
        [req.params.id],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al eliminar intermedio:", err);
            } else {
                if (res.rowCount === 0) {
                    resp.status(404).json({ error: "Registro intermedio no encontrado" });
                } else {
                    resp.json({ message: "Registro intermedio eliminado", deleted: res.rows[0] });
                }
            }
        }
    );
}

module.exports = {
    GetIntermedio,
    GetIntermedioById,
    GetIntermedioByCompany,
    PostIntermedio,
    PutIntermedioById,
    DeleteIntermedioById
};
