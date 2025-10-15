// copiado desde https://sidorares.github.io/node-mysql2/docs
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config(); // carga las variables del .env

/* export 
se necesita exportarla para usarla
 en otros archivos.js por ejemplo
 en una nueva ruta donde acceda 
 algun tipo de recurso = tablas
  de la base de datos*/

export const conexion = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});
