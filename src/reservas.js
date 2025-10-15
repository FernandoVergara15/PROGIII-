import express from "express";
import { router as v1salonesRutas } from "./v1/Rutas/salonesRutas.js";

const app = express();

app.use(express.json());

app.use("/api/v1/createSalones", v1salonesRutas);
app.use("/api/v1/readSalones", v1salonesRutas);
app.use("/api/v1/buscarSalonPorId", v1salonesRutas);
app.use("/api/v1/updateSalon", v1salonesRutas);
app.use("/api/v1/deleteSalon", v1salonesRutas);

// Configurar dotenv para cargar variables de entorno
export default app;
