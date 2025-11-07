import express from "express";
import TurnosControlador from "../../controladores/turnosControlador.js";
import apicache from "apicache";

const router = express.Router();
const turnosControlador = new TurnosControlador();
let cache = apicache.middleware;

router.post("/", cache("5 minutes"), turnosControlador.createTurno);
router.get("/", cache("5 minutes"), turnosControlador.readTurnos);
router.get("/:id", cache("5 minutes"), turnosControlador.buscarTurnoPorId);
router.put("/:id", cache("5 minutes"), turnosControlador.updateTurno);
router.delete("/:id", cache("5 minutes"), turnosControlador.deleteTurno);

export { router };
