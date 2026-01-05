const intermedioController = require("../controllers/intermedioAreasController.js");
const express = require("express");

const router = express.Router();

// GET all intermedio records
router.get("/", (req, resp) => {
    intermedioController.GetIntermedio(req, resp);
});

// GET intermedio by ID
router.get("/:id", (req, resp) => {
    intermedioController.GetIntermedioById(req, resp);
});

// GET all areas by Company ID
router.get("/company/:companyId", (req, resp) => {
    intermedioController.GetIntermedioByCompany(req, resp);
});

// POST create new intermedio
router.post("/", (req, resp) => {
    intermedioController.PostIntermedio(req, resp);
});

// PUT update intermedio by ID
router.put("/:id", (req, resp) => {
    intermedioController.PutIntermedioById(req, resp);
});

// DELETE intermedio by ID
router.delete("/:id", (req, resp) => {
    intermedioController.DeleteIntermedioById(req, resp);
});

module.exports = router;
