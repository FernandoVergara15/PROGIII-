import express from "express";
import SalonesControlador from "../../controladores/salonesControlador.js";
import { body } from "express-validator";
import validar from "../../middlewares/middleSalones.js";
import apicache from "apicache";

//instanciar la clase para podewr usar sus metodos
const salonesControlador = new SalonesControlador();
const router = express.Router();
 /* segun voy haciendo solicitudes
 el cache gestiona las solicitudes y no deja pasar
 mas de una solicitud en el tiempo que le indico
 si llega otra solicitud en ese tiempo responde con el cache */
let cache = apicache.middleware;

router.post(
  "/",
  cache("5 minutes"),
  [
    body("titulo").notEmpty().withMessage("falta el valor titulo"),
    body("direccion").notEmpty().withMessage("falta el valor direccion"),
    body("capacidad")
      .notEmpty()
      .withMessage("falta el valor capacidad")
      .isInt({ min: 1 })
      .withMessage("La capacidad debe ser numero"),
    body("importe")
      .notEmpty()
      .withMessage("falta el valor importe")
      .isInt({ min: 1 })
      .withMessage("El importe debe ser numero"),
    validar,
  ],
  salonesControlador.createSalon
);
// YA TENGO CLARO EL MIDDLEWARE LUEGO MODIFICO LAS DEMAS RUTAS
// al igual en el controlador

router.get("/", cache("5 minutes"), salonesControlador.readSalones);
router.get("/:id", cache("5 minutes"), salonesControlador.buscarSalonPorId);
router.put("/:id", cache("5 minutes"), salonesControlador.updateSalon);
 /* delete no elimina el registro de la base de datos
 solo lo pone en inactivo
 como se pidio en clase */
router.delete("/:id", cache("5 minutes"), salonesControlador.deleteSalon);

export { router };
