const cors = require("cors");
const express = require("express");

const dotenv = require("dotenv");

//iniciar imports
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3001;

//iniciar middleware
app.use(cors());
app.use(express.json());

// Importar rutas
const AreasRoutes = require("./routes/areas.js");
const CompaniesRoutes = require("./routes/companies.js");
const IntermedioAreasRoutes = require("./routes/intermedioAreas.js");
const ReportesRoutes = require("./routes/reportes.js");
const ClientesRoutes = require("./routes/clientes.js");
const RolesRoutes = require("./routes/roles.js");
const UsuariosRoutes = require("./routes/usuarios.js");

// Registrar rutas
app.use("/Areas", AreasRoutes);
app.use("/Companies", CompaniesRoutes);
app.use("/AreasEnCompany", IntermedioAreasRoutes);
app.use("/Reportes", ReportesRoutes);
app.use("/Clientes", ClientesRoutes);
app.use("/Roles", RolesRoutes);
app.use("/Usuarios", UsuariosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
