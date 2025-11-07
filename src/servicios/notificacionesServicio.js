import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";
/* preferi darle formato a la fecha en la consulta query 
sql en  /db/reservas_servicios.js"; para que asi 
concuerde buscarPorID y datosParaNotificacion */

export default class NotificacionesService {
  enviarCorreo = async (datosCorreo) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const plantillaPath = path.join(
      __dirname,
      "../utiles/handlebars/plantilla.hbs"
    );
    const plantilla = fs.readFileSync(plantillaPath, "utf-8");

    const template = handlebars.compile(plantilla);
    const datos = {
      fecha: datosCorreo.fecha,
      salon: datosCorreo.salon,
      turno: datosCorreo.turno,
    };
    const correoHtml = template(datos);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    if (!datosCorreo || !datosCorreo.correoElectronico) {
      console.error(
        "Error de lógica: Se intentó enviar un correo sin destinatario. La DB devolvió NULL."
      );
 
      throw new Error(
        "No se proporcionó un destinatario de email (correoElectronico está nulo)."
      );
    }
    const mailOptions = {
      to: datosCorreo.correoElectronico,
      from: `no-reply@tuempresa.com`, // El 'from' puede ser ficticio
      subject: "Confirmación de tu Reserva",
      html: correoHtml,
    };


    try {

      const info = await transporter.sendMail(mailOptions);

      console.log("Correo de notificación enviado:", info.messageId);
    } catch (error) {
      
      console.error(
        "Error en NotificacionesService al enviar correo:",
        error.message
      );

     
      throw new Error(
        `Error interno al intentar enviar el correo: ${error.message}`
      );
    }
  };



  update = async (datosCorreo) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const plantillaPath = path.join(
      __dirname,
      "../utiles/handlebars/update.hbs"
    );
    const plantilla = fs.readFileSync(plantillaPath, "utf-8");

    const template = handlebars.compile(plantilla);
    const datos = {
      fecha: datosCorreo.fecha,
      salon: datosCorreo.salon,
      turno: datosCorreo.turno,
    };
    const correoHtml = template(datos);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    if (!datosCorreo || !datosCorreo.correoElectronico) {
      console.error(
        "Error de lógica: Se intentó enviar un correo sin destinatario. La DB devolvió NULL."
      );

      throw new Error(
        "No se proporcionó un destinatario de email (correoElectronico está nulo)."
      );
    }
    const mailOptions = {
      to: datosCorreo.correoElectronico,
      from: `no-reply@tuempresa.com`, 
      subject: "Modificacion de tu Reserva",
      html: correoHtml,
    };

    try {
      const info = await transporter.sendMail(mailOptions);

      console.log("Correo de notificación enviado:", info.messageId);
    } catch (error) {
      console.error(
        "Error en NotificacionesService al enviar correo:",
        error.message
      );

      throw new Error(
        `Error interno al intentar enviar el correo: ${error.message}`
      );
    }
  };
}
