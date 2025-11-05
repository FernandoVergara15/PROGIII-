import express from "express";
import { router as v1salonesRutas } from "./v1/Rutas/salonesRutas.js";
import { router as v1turnosRutas } from "./v1/Rutas/turnosRutas.js";

const app = express();

app.use(express.json());


// Una sola ruta
app.use("/api/v1/salones", v1salonesRutas);

app.use("/api/v1/turnos", v1turnosRutas);

console.log("Cargando rutas de salones y turnos");
/*
app.use("/api/v1/createSalones", v1salonesRutas);
app.use("/api/v1/readSalones", v1salonesRutas);
app.use("/api/v1/buscarSalonPorId", v1salonesRutas);
app.use("/api/v1/updateSalon", v1salonesRutas);
app.use("/api/v1/deleteSalon", v1salonesRutas);       */

// Configurar dotenv para cargar variables de entorno
export default app;  
