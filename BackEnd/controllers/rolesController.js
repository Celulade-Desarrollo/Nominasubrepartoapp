const poolL = require("../config/database");

// GET all roles
function GetRoles(req, resp) {
    poolL.query(
        `SELECT * FROM "roles" ORDER BY "id" ASC`,
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al obtener roles:", err);
            } else {
                resp.json(res.rows);
            }
        }
    );
}

// GET rol by ID
function GetRolById(req, resp) {
    poolL.query(
        `SELECT * FROM "roles" WHERE "id" = $1`,
        [req.params.id],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al obtener rol:", err);
            } else {
                resp.json(res.rows[0]);
            }
        }
    );
}

// POST create new rol
function PostRol(req, resp) {
    const { nombre_rol } = req.body;

    poolL.query(
        `INSERT INTO "roles"("nombre_rol") VALUES ($1) RETURNING *`,
        [nombre_rol],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al crear rol:", err);
            } else {
                resp.status(201).json(res.rows[0]);
            }
        }
    );
}

// PUT update rol by ID
function PutRolById(req, resp) {
    const { nombre_rol } = req.body;
    const id = req.params.id;

    if (!nombre_rol) {
        resp.status(400).json({ error: "No se proporcionó nombre_rol para actualizar" });
        return;
    }

    poolL.query(
        `UPDATE "roles" SET "nombre_rol"=$1 WHERE "id"=$2 RETURNING *`,
        [nombre_rol, id],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al actualizar rol:", err);
            } else {
                resp.json(res.rows[0]);
            }
        }
    );
}

// DELETE rol by ID
function DeleteRolById(req, resp) {
    poolL.query(
        `DELETE FROM "roles" WHERE "id" = $1 RETURNING *`,
        [req.params.id],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al eliminar rol:", err);
            } else {
                if (res.rowCount === 0) {
                    resp.status(404).json({ error: "Rol no encontrado" });
                } else {
                    resp.json({ message: "Rol eliminado", deleted: res.rows[0] });
                }
            }
        }
    );
}

module.exports = { GetRoles, GetRolById, PostRol, PutRolById, DeleteRolById };
