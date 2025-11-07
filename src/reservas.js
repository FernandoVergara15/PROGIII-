import express from "express";
import { router as v1salonesRutas } from "./v1/Rutas/salonesRutas.js";

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

app.use("/api/v1/createSalones", v1salonesRutas);
app.use("/api/v1/readSalones", v1salonesRutas);
app.use("/api/v1/buscarSalonPorId", v1salonesRutas);
app.use("/api/v1/updateSalon", v1salonesRutas);
app.use("/api/v1/deleteSalon", v1salonesRutas);

// Configurar dotenv para cargar variables de entorno
export default app;