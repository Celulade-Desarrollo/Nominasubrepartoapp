const companiesController = require("../controllers/companiesController.js");
const express = require("express");

const router = express.Router();

// GET all companies
router.get("/", (req, resp) => {
    companiesController.GetCompanies(req, resp);
});

// GET company by ID
router.get("/:id", (req, resp) => {
    companiesController.GetCompanyById(req, resp);
});

// POST create new company
router.post("/", (req, resp) => {
    companiesController.PostCompany(req, resp);
});

// PUT update company by ID
router.put("/:id", (req, resp) => {
    companiesController.PutCompanyById(req, resp);
});

// DELETE company by ID
router.delete("/:id", (req, resp) => {
    companiesController.DeleteCompanyById(req, resp);
});

module.exports = router;
