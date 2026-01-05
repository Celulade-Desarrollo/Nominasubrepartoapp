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


const AreasRoutes = require("./routes/areas.js");

app.use("/Areas", AreasRoutes);


app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
