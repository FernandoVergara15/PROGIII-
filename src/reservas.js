import express from "express";
import passport from "passport";
import morgan from "morgan";
import fs from "fs";

import { estrategia, validacion } from "./config/passport.js";

import { router as v1AuthRouter } from "./v1/rutas/authRoutes.js";
import { router as v1ReservasRutas } from "./v1/rutas/reservasRutas.js";
import { router as v1UsuariosRutas } from "./v1/rutas/usuariosRutas.js";
import { router as v1ServiciosRutas } from "./v1/rutas/serviciosRutas.js";
import { router as v1SalonesRutas } from "./v1/rutas/salonesRutas.js";
import { router as v1TurnosRutas } from "./v1/rutas/turnosRutas.js";
const app = express();

app.use(express.json());
passport.use(estrategia);
passport.use(validacion);
app.use(passport.initialize());

// morgan
let log = fs.createWriteStream("./access.log", { flags: "a" });
app.use(morgan("combined"));
app.use(morgan("combined", { stream: log }));

// --- RUTAS PÚBLICAS ---
app.use("/api/v1/auth", v1AuthRouter);

// --- Middlewares ---
app.use(express.json());
// 4. SIRVE LA DOCUMENTACIÓN (Ruta pública)

// --- RUTAS PROTEGIDAS ---
app.use(
  "/api/v1/reservas",
  passport.authenticate("jwt", { session: false }),
  v1ReservasRutas
);
app.use(
  "/api/v1/usuarios",
  passport.authenticate("jwt", { session: false }),
  v1UsuariosRutas
);
app.use(
  "/api/v1/servicios",
  passport.authenticate("jwt", { session: false }),
  v1ServiciosRutas
);
app.use(
  "/api/v1/salones",
  passport.authenticate("jwt", { session: false }),
  v1SalonesRutas
);
app.use(
  "/api/v1/turnos",
  passport.authenticate("jwt", { session: false }),
  v1TurnosRutas
);

// Configurar dotenv para cargar variables de entorno
export default app;
