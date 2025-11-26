const { Pool }=require('pg');
require("dotenv").config();


const poolL = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,

});

poolL.on("connect", () => {
  console.log("Connected to the database");
});

poolL.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

module.exports= poolL;