import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config(); // carga las variables del .env


export const conexion = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});
