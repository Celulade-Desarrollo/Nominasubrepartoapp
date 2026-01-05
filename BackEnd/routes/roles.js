const rolesController = require("../controllers/rolesController.js");
const express = require("express");

const router = express.Router();

// GET all roles
router.get("/", (req, resp) => {
    rolesController.GetRoles(req, resp);
});

// GET rol by ID
router.get("/:id", (req, resp) => {
    rolesController.GetRolById(req, resp);
});

// POST create new rol
router.post("/", (req, resp) => {
    rolesController.PostRol(req, resp);
});

// PUT update rol by ID
router.put("/:id", (req, resp) => {
    rolesController.PutRolById(req, resp);
});

// DELETE rol by ID
router.delete("/:id", (req, resp) => {
    rolesController.DeleteRolById(req, resp);
});

module.exports = router;
