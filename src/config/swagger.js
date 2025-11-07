import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// 1. Opciones de Configuración (Igual que antes)
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Reservas Casa de Cumpleaños (PROG 3)",
      version: "1.0.0",
      description: "Documentación de la API de Reservas Casa de Cumpleaños",
    },
    // ---- Definimos la seguridad (JWT) ----
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Pega tu token JWT (obtenido de /auth/login)",
        },
      },
      // ---- Definimos los Schemas (Modelos de datos) ----
      schemas: {
        ReservaInput: {
          type: "object",
          properties: {
            fecha_reserva: {
              type: "string",
              format: "date",
              example: "2025-12-31",
            },
            salon_id: { type: "integer", example: 1 },
            usuario_id: { type: "integer", example: 3 },
            turno_id: { type: "integer", example: 1 },
            servicios: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  servicio_id: { type: "integer", example: 4 },
                  importe: { type: "number", example: 15000 },
                },
              },
            },
          },
        },
        UsuarioInput: {
          type: "object",
          properties: {
            nombre: { type: "string", example: "Juan" },
            apellido: { type: "string", example: "Perez" },
            nombre_usuario: {
              type: "string",
              example: "juan.perez@correo.com",
            },
            contrasenia: { type: "string", example: "mipassword123" },
            tipo_usuario: { type: "integer", example: 3 },
          },
        },
        // ... (Puedes añadir Schemas para Login, Salones, Servicios)
      },
    },
    // ---- Seguridad Global ----
    security: [
      {
        bearerAuth: [], // Aplica 'bearerAuth' a todos los endpoints
      },
    ],
  },
  // ---- Le dice a JSDoc dónde encontrar los comentarios ----
  apis: [
      "./src/v1/rutas/authRoutes.js",
      "./src/v1/rutas/usuariosRutas.js",
      "./src/v1/rutas/serviciosRutas.js",
      "./src/v1/rutas/salonesRutas.js",
      "./src/v1/rutas/reservasRutas.js",
      "./src/v1/rutas/turnosRutas.js",
  ], // ¡Ajusta esta ruta a tu proyecto!
};

// 2. Genera las especificaciones
const specs = swaggerJsdoc(swaggerOptions);

/**
 * Función que configura e inicializa Swagger UI en la app de Express.
 * @param {object} app - La instancia de la aplicación Express.
 */
const setupSwagger = (app) => {
  // 3. Crea la ruta pública para la UI de Swagger
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
  );
};

// 4. Exporta la función de configuración
export default setupSwagger;
