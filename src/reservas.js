import express from "express";
import passport from "passport";
import morgan from "morgan";
import fs from "fs";

// --- 1. IMPORTA SWAGGER ---
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import { estrategia, validacion } from "./config/passport.js";
// ... (tus imports de rutas)
import { router as v1AuthRouter } from "./v1/rutas/authRoutes.js";
import { router as v1ReservasRutas } from "./v1/rutas/reservasRutas.js";
import { router as v1UsuariosRutas } from "./v1/rutas/usuariosRutas.js";
import { router as v1ServiciosRutas } from "./v1/rutas/serviciosRutas.js";
import { router as v1SalonesRutas } from "./v1/rutas/salonesRutas.js";

const app = express();

// --- 2. CONFIGURACIÓN DE SWAGGER ---
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Salones de Fiestas (PROG 3)",
      version: "1.0.0",
      description: "Documentación de la API de Reservas de Salones",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ReservaInput: {
          type: "object",
          properties: { /* ... (tus propiedades de reserva) ... */ },
        },
        UsuarioInput: {
          type: "object",
          properties: { /* ... (tus propiedades de usuario) ... */ },
        },
      },
    },
    security: [ { bearerAuth: [] } ],
  },
  // ---- ¡IMPORTANTE! Asegúrate que esta ruta sea correcta ----
  apis: ["./src/v1/rutas/*.js"], 
};

// 3. CREA LAS ESPECIFICACIONES
const specs = swaggerJsdoc(swaggerOptions);

// --- Middlewares ---
app.use(express.json());
passport.use(estrategia);
passport.use(validacion);
app.use(passport.initialize());
// ... (morgan logs) ...

// --- RUTAS PÚBLICAS ---
app.use("/api/v1/auth", v1AuthRouter);

// 4. SIRVE LA DOCUMENTACIÓN (Ruta pública)
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

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

export default app;