const usuariosController = require("../controllers/usuariosController.js");
const express = require("express");

const router = express.Router();

// GET all usuarios
router.get("/", (req, resp) => {
    usuariosController.GetUsuarios(req, resp);
});

// GET usuario by ID
router.get("/id/:id", (req, resp) => {
    usuariosController.GetUsuarioById(req, resp);
});

// GET usuario by Email
router.get("/email/:email", (req, resp) => {
    usuariosController.GetUsuarioByEmail(req, resp);
});

// GET usuario by documento_id (para login)
router.get("/documento/:documentoId", (req, resp) => {
    usuariosController.GetUsuarioByDocumento(req, resp);
});

// GET usuarios by rol
router.get("/rol/:rolId", (req, resp) => {
    usuariosController.GetUsuariosByRol(req, resp);
});

// POST create new usuario
router.post("/", (req, resp) => {
    usuariosController.PostUsuario(req, resp);
});

// PUT update usuario by ID
router.put("/:id", (req, resp) => {
    usuariosController.PutUsuarioById(req, resp);
});

// DELETE usuario by ID
router.delete("/:id", (req, resp) => {
    usuariosController.DeleteUsuarioById(req, resp);
});

module.exports = router;
