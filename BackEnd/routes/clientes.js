const clientesController = require("../controllers/clientesController.js");

const express = require("express");

const routerL = express.Router();

routerL.get("/", (req, resp) => {
  clientesController.GetClientes(req, resp);
});
routerL.get("/:id", (req, resp) => {
  clientesController.GetClienteById(req, resp);
});
routerL.post("/", (req, resp) => {
  clientesController.PostClienteByName(req, resp);
});
routerL.put("/:id", (req, resp) => {
  clientesController.PutClienteById(req, resp);
});


module.exports=routerL;