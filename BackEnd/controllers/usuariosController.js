const poolL = require("../config/database");

// GET all usuarios with rol info
function GetUsuarios(req, resp) {
    poolL.query(
        `SELECT 
      u."id",
      u."created_at",
      u."documento_id",
      u."nombre_usuario",
      u."rol",
      u."email",
      r."nombre_rol"
    FROM "Usuarios" u
    LEFT JOIN "roles" r ON u."rol" = r."id"
    ORDER BY u."created_at" DESC`,
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al obtener usuarios:", err);
            } else {
                resp.json(res.rows);
            }
        }
    );
}

// GET usuario by ID
function GetUsuarioById(req, resp) {
    poolL.query(
        `SELECT 
      u."id",
      u."created_at",
      u."documento_id",
      u."nombre_usuario",
      u."rol",
      u."email",
      r."nombre_rol"
    FROM "Usuarios" u
    LEFT JOIN "roles" r ON u."rol" = r."id"
    WHERE u."id" = $1`,
        [req.params.id],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al obtener usuario:", err);
            } else {
                resp.json(res.rows[0]);
            }
        }
    );
}

// GET usuario by documento_id (para login)
function GetUsuarioByDocumento(req, resp) {
    poolL.query(
        `SELECT 
      u."id",
      u."created_at",
      u."documento_id",
      u."nombre_usuario",
      u."password",
      u."rol",
      u."email",
      r."nombre_rol"
    FROM "Usuarios" u
    LEFT JOIN "roles" r ON u."rol" = r."id"
    WHERE u."documento_id" = $1`,
        [req.params.documentoId],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al obtener usuario por documento:", err);
            } else {
                resp.json(res.rows[0]);
            }
        }
    );
}

// GET usuarios by rol
function GetUsuariosByRol(req, resp) {
    poolL.query(
        `SELECT 
      u."id",
      u."created_at",
      u."documento_id",
      u."nombre_usuario",
      u."rol",
      u."email",
      r."nombre_rol"
    FROM "Usuarios" u
    LEFT JOIN "roles" r ON u."rol" = r."id"
    WHERE u."rol" = $1
    ORDER BY u."nombre_usuario"`,
        [req.params.rolId],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al obtener usuarios por rol:", err);
            } else {
                resp.json(res.rows);
            }
        }
    );
}

// POST create new usuario
function PostUsuario(req, resp) {
    const { documento_id, nombre_usuario, password, rol, email } = req.body;

    poolL.query(
        `INSERT INTO "Usuarios"("documento_id", "nombre_usuario", "password", "rol", "email") 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [documento_id, nombre_usuario, password, rol, email],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al crear usuario:", err);
            } else {
                // No devolver la contraseña
                const user = res.rows[0];
                delete user.password;
                resp.status(201).json(user);
            }
        }
    );
}

// PUT update usuario by ID
function PutUsuarioById(req, resp) {
    const { documento_id, nombre_usuario, password, rol, email } = req.body;
    const id = req.params.id;

    // Construir la consulta dinámicamente
    const campos = [];
    const valores = [];
    let contador = 1;

    if (documento_id !== undefined) {
        campos.push(`"documento_id"=$${contador}`);
        valores.push(documento_id);
        contador++;
    }
    if (nombre_usuario !== undefined) {
        campos.push(`"nombre_usuario"=$${contador}`);
        valores.push(nombre_usuario);
        contador++;
    }
    if (password !== undefined) {
        campos.push(`"password"=$${contador}`);
        valores.push(password);
        contador++;
    }
    if (rol !== undefined) {
        campos.push(`"rol"=$${contador}`);
        valores.push(rol);
        contador++;
    }
    if (email !== undefined) {
        campos.push(`"email"=$${contador}`);
        valores.push(email);
        contador++;
    }

    if (campos.length === 0) {
        resp.status(400).json({ error: "No se proporcionaron campos para actualizar" });
        return;
    }

    valores.push(id);
    const comandoSQL = `UPDATE "Usuarios" SET ${campos.join(", ")} WHERE "id"=$${contador} RETURNING *`;

    poolL.query(comandoSQL, valores, (err, res) => {
        if (err) {
            resp.status(err.status || 500).json({ error: err.message });
            console.error("❌ Error al actualizar usuario:", err);
        } else {
            // No devolver la contraseña
            const user = res.rows[0];
            if (user) delete user.password;
            resp.json(user);
        }
    });
}

// DELETE usuario by ID
function DeleteUsuarioById(req, resp) {
    poolL.query(
        `DELETE FROM "Usuarios" WHERE "id" = $1 RETURNING *`,
        [req.params.id],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al eliminar usuario:", err);
            } else {
                if (res.rowCount === 0) {
                    resp.status(404).json({ error: "Usuario no encontrado" });
                } else {
                    const user = res.rows[0];
                    delete user.password;
                    resp.json({ message: "Usuario eliminado", deleted: user });
                }
            }
        }
    );
}

module.exports = {
    GetUsuarios,
    GetUsuarioById,
    GetUsuarioByDocumento,
    GetUsuariosByRol,
    PostUsuario,
    PutUsuarioById,
    DeleteUsuarioById
};
