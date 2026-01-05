const areasController = require("../controllers/areasController.js");

const express = require("express");

const routerL = express.Router();

routerL.get("/", (req, resp) => {
  areasController.GetAreas(req, resp);
});
routerL.get("/:id", (req, resp) => {
  areasController.GetAreaById(req, resp);
});
routerL.post("/", (req, resp) => {
  areasController.PostAreaByName(req, resp);
});
routerL.put("/:id", (req, resp) => {
  areasController.PutAreaById(req, resp);
});


module.exports=routerL;