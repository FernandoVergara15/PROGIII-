import express from "express";
import handlebars from "handlebars";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import { conexion } from "./db/conexion.js";
dotenv.config();

/* fileURLToPath
para acceder a la ruta de la plantilla.hbs 
necesitamos la ubicacion del archivo index.js
para eso usamos:
*/
/*readFile
para leer el archivo en la ruta 
utiles/handlebars/plantilla.hbs
*/
/*path
para trabajar con rutas de archivos y directorios
en este caso donde se encuentra el index.js
*/

const app = express();

/* middleware
 para que parsee (analiza y entienda) 
lo que llega sera en formato JSON y muestre 
en consola debidamente y no undefined
*/
app.use(express.json());

app.get("/estado", (req, res) => {
  //res.json({'ok':true})
  res.status(201).send({ estado: true, mensaje: "Reserva Creada" });
});

/* 
cuando se genere una reserva nueva 
que le llegue al admin y al cliente, 
luego se usara para crear las reservas.
cuando se utilize como una funcion
no vamos a resivirlo del cliente
porque vamos a tener esos datos en la BD*/
app.post("/notificacion", async (req, res) => {
  console.log(req.body);
  // verificacion de datos segun el archivo. json
  if (
    !req.body.fecha ||
    !req.body.salon ||
    !req.body.turno ||
    !req.body.correoDestino
  ) {
    res
      .status(400)
      .send({ estado: false, mensaje: "Faltan datos requeridos!" });
  }
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    /*desestructuracion del objeto req.body 
      que esta definido en JSON esto 
      permite permite extraer varias propiedades
      en una sola línea y asignarlas a variables
      con el mismo nombre*/
    const { fecha, salon, turno, correoDestino } = req.body;
    const plantilla = path.join(
      __dirname,
      "utiles",
      "handlebars",
      "plantilla.hbs"
    );
    //console.log(plantilla);

    // leo la plantilla.hbs
    const datos = await readFile(plantilla, "utf-8");
    const template = handlebars.compile(datos);
    /*                                    
    Se utiliza Handlebars.compile para compilar la plantilla
    y luego se generan el HTML con los datos proporcionados
    */
    var html = template({ fecha, salon, turno, correoDestino });
    //console.log(html);

    //NODEMAILER configuracion del servicio
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    //configuracion del correo
    const mailOpciones = {
      from: process.env.EMAIL_USER,
      to: correoDestino,
      subject: "Notificación",
      html: html,
    };

    //envio del correo
    transporter.sendMail(mailOpciones, (error, info) => {
      if (error) {
        res.json({ estado: false, mensaje: "No se pudo enviar el correo" });
        return console.log(error);
      }
      console.log(info);
      res.json({ estado: true, mensaje: "Correo Enviado" });
    });
  } catch (error) {
    console.log(error);
  }
  //res.json({ ok: true, mensaje: "Correo Enviada" });
});

/* ruta para acceder a la base de datos
se ejecuta de forma asincronica
igualmente por que voy acceder a la base de datos */
app.get("/salones", async (req, res) => {
  // un try catch por si hay algun error
  try {
    const sql = "SELECT * FROM salones WHERE activo = 1";
    const [results, fields] = await conexion.query(sql);

    console.log(results); // results contains rows returned by server

    res.json({ ok: true, salones: results[0] });
  } catch (error) {
    console.log("error en GET /salones", error);
    res.status(500).json({ ok: false, mensaje: "Error en el servidor" });
  }
});

// ruta tipo GET para obtener 1 salon por su ID
// se define un query param para identificar el salon
// en la ruta se define :id
// para acceder a ese id se usa req.params.id
app.get("/salones/:salon_id", async (req, res) => {
  // un try catch por si hay algun error
  try {
    const salon_id = req.params.salon_id;
    /* SQL seguro con placeholder
      const sql = `SELECT * FROM salones WHERE salon_id = ? AND activo = 1`;
      */
    const sql = `SELECT * FROM salones WHERE activo = 1 AND salon_id = ?`;
    const [results, fields] = await conexion.query(sql, salon_id);
    // manejo de errores si no existe el salon
    if (results.length === 0) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Salon no encontrado" });
    }

    console.log(results); // results contains rows returned by server

    res.json({ estado: true, salon_id: results[0] });
  } catch (error) {
    console.log("error en GET /salones/:salon_id", error);
    res.status(500).json({ ok: false, mensaje: "Error en el servidor" });
  }
});

// ruta para crear un salon
app.post("/salones", async (req, res) => {
  try {
    if (
      !req.body.titulo ||
      !req.body.direccion ||
      !req.body.capacidad ||
      !req.body.importe
    ) {
      return res.status(400).json({
        estado: false,
        mensaje: "faltan campos requeridos",
      });
    }
    // desestructuracion del objeto req.body al igual que el post de notificacion
    const { titulo, direccion, capacidad, importe } = req.body;
    const valores = [titulo, direccion, capacidad, importe];
    const sql = `INSERT INTO salones (titulo, direccion, capacidad, importe) VALUES (?,?,?,?)`;
    const [results] = await conexion.query(sql, valores);
    console.log(results);

    /*luego las validaciones por ejemplo x > 0 
    se haran con un middleware seria el express
    validator*/

    res
      .status(201)
      // retorna el id del salon creado en la base de datos
      .json({
        estado: true,
        mensaje: `Salón creado con ID: ${results.insertId}`,
        salonCreado: {
          salon_id: results.insertId,
          titulo: titulo,
          direccion: direccion,
          capacidad: capacidad,
          importe: importe,
        },
      });
  } catch (error) {
    console.log("error en POST /salones", error);
    res.status(500).json({ ok: false, mensaje: "Error en el servidor" });
  }
});

// ruta para modificar un recurso en la BD
/* diferencia entre path y put 
patch modifica un campo
put modifica todo el recurso
en este caso se usa put por que se modifican todos los campos
se usa un query param para identificar el salon a modificar
se accede al ID con req.params.salon_id */
app.put("/salones/:salon_id", async (req, res) => {
  try {
    // capturo el ID del parametro de la ruta
    const salon_id = req.params.salon_id;
    // validacion de campos requeridos
    if (
      !req.body.titulo ||
      !req.body.direccion ||
      !req.body.capacidad ||
      !req.body.importe
    ) {
      return res.status(400).json({
        estado: false,
        mensaje: "faltan campos requeridos",
      });
    }
    // desestructuracion del objeto req.body
    const { titulo, direccion, capacidad, importe } = req.body;
    // valores a modificar en la BD
    const valores = [titulo, direccion, capacidad, importe, salon_id];
    // SQL seguro con placeholder
    const sql = `UPDATE salones SET titulo = ?, direccion = ?, capacidad = ?, importe = ? WHERE salon_id = ?`;
    // ejecuto la consulta en la BD
    const [results] = await conexion.query(sql, valores);
    console.log(results);
    // si no se modifico ningun registro es por que el ID no existe
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ estado: false, mensaje: "El ID de ese salon no existe" });
    }

    res.status(200).json({
      estado: true,
      mensaje: `Salón modificado con ID: ${salon_id}`,
    });
  } catch (error) {
    console.log("error en PUT /salones/:salon_id", error);
    res.status(500).json({ ok: false, mensaje: "Error en el servidor" });
  }
});

// ruta para eliminar un salon
// se usara un query param para identificar el salon a eliminar
// se accede al ID con req.params.salon_id
// eliminacion logica, no se elimina el registro de la BD
// solo se cambia el campo activo a 0
app.delete("/salones/:salon_id", async (req, res) => {
  try {
    // capturo el ID del parametro de la ruta
    const salon_id = req.params.salon_id;
    // SQL seguro con placeholder
    // const sql = `DELETE * FROM salones WHERE activo = 1 AND salon_id = ?`;
    // Eliminación lógica: solo actualizamos el campo activo
    const sql = `UPDATE salones SET activo = 0 WHERE salon_id = ? AND activo = 1`;
    // ejecuto la consulta en la BD
    const [results] = await conexion.query(sql, [salon_id]);
    // si no se modifico ningun registro es por que el ID no existe
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ estado: false, mensaje: "El ID de ese salon no existe" });
    }
    res.status(200).json({
      estado: true,
      mensaje: `Salón eliminado con ID: ${salon_id}`,
    });
  } catch (error) {
    console.log("error en DELETE /salones/:salon_id", error);
    res.status(500).json({ ok: false, mensaje: "Error en el servidor" });
  }
});

/*
no esta bueno colocar el puerto definido por que se 
usaran variables de entorno para mas seguridad con 
un arechivo.env que es donde estara el puerto, usuario
contraseña o una key para conectarnos a una API EXTERNA.
LUEGO de esto que se usa process.loadEnvFIle() para
que lea el archivo.env y procese el puerto definido
PUERTO= 3000

app.listen(3000, () =>{
    console.log(`servidor disponible`);
})
*/
process.loadEnvFile();
app.listen(process.env.PUERTO, () => {
  console.log(`servidor disponible en: ${process.env.PUERTO}`);
});
