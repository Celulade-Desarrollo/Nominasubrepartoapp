const poolL = require("../config/database");

// GET all reportes
function GetReportes(req, resp) {
    poolL.query(
        `SELECT 
      r."id",
      r."created_at",
      r."horas",
      r."fecha_trabajada",
      r."cliente",
      r."documento_id",
      r."area_trabajo",
      r."aprobado",
      c."nombre_company",
      a."nombre_area"
    FROM "Reportes" r
    LEFT JOIN "Companies" c ON r."cliente" = c."elemento_pep"
    LEFT JOIN "AreasTrabajos" a ON r."area_trabajo" = a."id"::text
    ORDER BY r."created_at" DESC`,
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al obtener reportes:", err);
            } else {
                resp.json(res.rows);
            }
        }
    );
}

// GET reporte by ID
function GetReporteById(req, resp) {
    poolL.query(
        `SELECT 
      r."id",
      r."created_at",
      r."horas",
      r."fecha_trabajada",
      r."cliente",
      r."documento_id",
      r."area_trabajo",
      r."aprobado",
      c."nombre_company",
      a."nombre_area"
    FROM "Reportes" r
    LEFT JOIN "Companies" c ON r."cliente" = c."elemento_pep"
    LEFT JOIN "AreasTrabajos" a ON r."area_trabajo" = a."id"::text
    WHERE r."id" = $1`,
        [req.params.id],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al obtener reporte:", err);
            } else {
                resp.json(res.rows[0]);
            }
        }
    );
}

// GET reportes by documento_id (útil para ver reportes de un empleado)
function GetReportesByDocumento(req, resp) {
    const documentoId = parseInt(req.params.documentoId);

    if (isNaN(documentoId)) {
        return resp.status(400).json({ error: "El documento debe ser un número válido" });
    }

    poolL.query(
        `SELECT 
      r."id",
      r."created_at",
      r."horas",
      r."fecha_trabajada",
      r."cliente",
      r."documento_id",
      r."area_trabajo",
      r."aprobado",
      c."nombre_company",
      a."nombre_area"
    FROM "Reportes" r
    LEFT JOIN "Companies" c ON r."cliente" = c."elemento_pep"
    LEFT JOIN "AreasTrabajos" a ON r."area_trabajo" = a."id"::text
    WHERE r."documento_id" = $1
    ORDER BY r."created_at" DESC`,
        [documentoId],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al obtener reportes por documento:", err);
            } else {
                resp.json(res.rows);
            }
        }
    );
}

// GET reportes by cliente (compañía)
function GetReportesByCliente(req, resp) {
    poolL.query(
        `SELECT 
      r."id",
      r."created_at",
      r."horas",
      r."fecha_trabajada",
      r."cliente",
      r."documento_id",
      r."area_trabajo",
      r."aprobado",
      c."nombre_company",
      a."nombre_area"
    FROM "Reportes" r
    LEFT JOIN "Companies" c ON r."cliente" = c."elemento_pep"
    LEFT JOIN "AreasTrabajos" a ON r."area_trabajo" = a."id"::text
    WHERE r."cliente" = $1
    ORDER BY r."created_at" DESC`,
        [req.params.clienteId],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al obtener reportes por cliente:", err);
            } else {
                resp.json(res.rows);
            }
        }
    );
}

// POST create new reporte
function PostReporte(req, resp) {
    const { horas, fecha_trabajada, cliente, documento_id, area_trabajo, aprobado } = req.body;

    // Si 'aprobado' no se envía, por defecto es null/0 (según la DB), pero aquí permitimos enviarlo.
    // Usamos $6 si existe, o DEFAULT si no.
    // Para simplificar, haremos una query condicional o pasaremos el valor (si es undefined, node-postgres lo maneja si la query lo espera? No, hay que construirlo o pasar null).
    // Mejor estrategia: Definir columnas dinámicas o simplemente asumir que 'aprobado' es opcional y si viene lo insertamos.

    // Simplificando: Si viene 'aprobado', lo insertamos. Si no, usamos null (o 0).
    const valAprobado = aprobado !== undefined ? aprobado : 0;

    poolL.query(
        `INSERT INTO "Reportes"("horas", "fecha_trabajada", "cliente", "documento_id", "area_trabajo", "aprobado") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [horas, fecha_trabajada, cliente, documento_id, area_trabajo, valAprobado],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al crear reporte:", err);
            } else {
                resp.status(201).json(res.rows[0]);
            }
        }
    );
}

// PUT update reporte by ID
function PutReporteById(req, resp) {
    const { horas, fecha_trabajada, cliente, documento_id, area_trabajo } = req.body;
    const id = req.params.id;

    // Construir la consulta dinámicamente
    const campos = [];
    const valores = [];
    let contador = 1;

    if (horas !== undefined) {
        campos.push(`"horas"=$${contador}`);
        valores.push(horas);
        contador++;
    }
    if (cliente !== undefined) {
        campos.push(`"cliente"=$${contador}`);
        valores.push(cliente);
        contador++;
    }
    if (fecha_trabajada !== undefined) {
        campos.push(`"fecha_trabajada"=$${contador}`);
        valores.push(fecha_trabajada);
        contador++;
    }
    if (documento_id !== undefined) {
        campos.push(`"documento_id"=$${contador}`);
        valores.push(documento_id);
        contador++;
    }
    if (area_trabajo !== undefined) {
        campos.push(`"area_trabajo"=$${contador}`);
        valores.push(area_trabajo);
        contador++;
    }
    if (req.body.aprobado !== undefined) {
        campos.push(`"aprobado"=$${contador}`);
        valores.push(req.body.aprobado);
        contador++;
    }

    if (campos.length === 0) {
        resp.status(400).json({ error: "No se proporcionaron campos para actualizar" });
        return;
    }

    valores.push(id);
    const comandoSQL = `UPDATE "Reportes" SET ${campos.join(", ")} WHERE "id"=$${contador} RETURNING *`;

    poolL.query(comandoSQL, valores, (err, res) => {
        if (err) {
            resp.status(err.status || 500).json({ error: err.message });
            console.error("❌ Error al actualizar reporte:", err);
        } else {
            resp.json(res.rows[0]);
        }
    });
}

// DELETE reporte by ID
function DeleteReporteById(req, resp) {
    poolL.query(
        `DELETE FROM "Reportes" WHERE "id" = $1 RETURNING *`,
        [req.params.id],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al eliminar reporte:", err);
            } else {
                if (res.rowCount === 0) {
                    resp.status(404).json({ error: "Reporte no encontrado" });
                } else {
                    resp.json({ message: "Reporte eliminado", deleted: res.rows[0] });
                }
            }
        }
    );
}

// GET reportes by coordinador_id (linked via IntermedioCoordinadores)
function GetReportesByCoordinador(req, resp) {
    const coordinadorId = req.params.coordinadorId;

    if (!coordinadorId) {
        return resp.status(400).json({ error: "Se requiere el ID del coordinador" });
    }

    poolL.query(
        `SELECT 
      r."id",
      r."created_at",
      r."horas",
      r."fecha_trabajada",
      r."cliente",
      r."documento_id",
      r."area_trabajo",
      r."aprobado",
      c."nombre_company",
      a."nombre_area",
      u."nombre_usuario" as "nombre_empleado"
    FROM "Reportes" r
    JOIN "IntermedioCoordinadores" ic ON r."cliente" = ic."cliente"
    LEFT JOIN "Companies" c ON r."cliente" = c."elemento_pep"
    LEFT JOIN "AreasTrabajos" a ON r."area_trabajo" = a."id"::text
    LEFT JOIN "Usuarios" u ON r."documento_id" = u."documento_id"
    WHERE ic."coordinador" = $1
    ORDER BY r."created_at" DESC`,
        [coordinadorId],
        (err, res) => {
            if (err) {
                resp.status(err.status || 500).json({ error: err.message });
                console.error("❌ Error al obtener reportes por coordinador:", err);
            } else {
                resp.json(res.rows);
            }
        }
    );
}

module.exports = {
    GetReportes,
    GetReporteById,
    GetReportesByDocumento,
    GetReportesByCliente,
    GetReportesByCoordinador,
    PostReporte,
    PutReporteById,
    DeleteReporteById
};
