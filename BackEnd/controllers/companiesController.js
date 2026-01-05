const poolL = require("../config/database");

// GET all companies
function GetCompanies(req, resp) {
    poolL.query(
        `SELECT * FROM "Companies" ORDER BY "created_at" DESC`,
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al obtener companies:", err);
            } else {
                resp.json(res.rows);
            }
        }
    );
}

// GET company by ID
function GetCompanyById(req, resp) {
    poolL.query(
        `SELECT * FROM "Companies" WHERE "id" = $1`,
        [req.params.id],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al obtener company:", err);
            } else {
                resp.json(res.rows[0]);
            }
        }
    );
}

// POST create new company
function PostCompany(req, resp) {
    const { nombre_company, elemento_pep } = req.body;

    poolL.query(
        `INSERT INTO "Companies"("nombre_company", "elemento_pep") VALUES ($1, $2) RETURNING *`,
        [nombre_company, elemento_pep],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al crear company:", err);
            } else {
                resp.status(201).json(res.rows[0]);
            }
        }
    );
}

// PUT update company by ID
function PutCompanyById(req, resp) {
    const { nombre_company, elemento_pep } = req.body;
    const id = req.params.id;

    let comandoSQL;
    let valores = [];

    if (nombre_company && elemento_pep) {
        comandoSQL = `UPDATE "Companies" SET "nombre_company"=$1, "elemento_pep"=$2 WHERE "id"=$3 RETURNING *`;
        valores = [nombre_company, elemento_pep, id];
    } else if (nombre_company) {
        comandoSQL = `UPDATE "Companies" SET "nombre_company"=$1 WHERE "id"=$2 RETURNING *`;
        valores = [nombre_company, id];
    } else if (elemento_pep) {
        comandoSQL = `UPDATE "Companies" SET "elemento_pep"=$1 WHERE "id"=$2 RETURNING *`;
        valores = [elemento_pep, id];
    } else {
        resp.status(400).json({ error: "No se proporcionaron campos para actualizar" });
        return;
    }

    poolL.query(comandoSQL, valores, (err, res) => {
        if (err) {
            resp.status(err.status || 500).json({ error: err.message });
            console.error("❌ Error al actualizar company:", err);
        } else {
            resp.json(res.rows[0]);
        }
    });
}

// DELETE company by ID
function DeleteCompanyById(req, resp) {
    poolL.query(
        `DELETE FROM "Companies" WHERE "id" = $1 RETURNING *`,
        [req.params.id],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al eliminar company:", err);
            } else {
                if (res.rowCount === 0) {
                    resp.status(404).json({ error: "Company no encontrada" });
                } else {
                    resp.json({ message: "Company eliminada", deleted: res.rows[0] });
                }
            }
        }
    );
}

module.exports = { GetCompanies, GetCompanyById, PostCompany, PutCompanyById, DeleteCompanyById };
