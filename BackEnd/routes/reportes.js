const reportesController = require("../controllers/reportesController.js");
const express = require("express");

const router = express.Router();

// GET all reportes
router.get("/", (req, resp) => {
    reportesController.GetReportes(req, resp);
});

// GET reportes by coordinador (MUST BE BEFORE /:id)
router.get("/coordinador/:coordinadorId", (req, resp) => {
    reportesController.GetReportesByCoordinador(req, resp);
});

// GET reporte by ID
router.get("/:id", (req, resp) => {
    reportesController.GetReporteById(req, resp);
});

// GET reportes by documento_id (empleado)
router.get("/documento/:documentoId", (req, resp) => {
    reportesController.GetReportesByDocumento(req, resp);
});

// GET reportes by cliente (compañía)
router.get("/cliente/:clienteId", (req, resp) => {
    reportesController.GetReportesByCliente(req, resp);
});

// POST create new reporte
router.post("/", (req, resp) => {
    reportesController.PostReporte(req, resp);
});

// PUT update reporte by ID
router.put("/:id", (req, resp) => {
    reportesController.PutReporteById(req, resp);
});

// DELETE reporte by ID
router.delete("/:id", (req, resp) => {
    reportesController.DeleteReporteById(req, resp);
});

module.exports = router;
