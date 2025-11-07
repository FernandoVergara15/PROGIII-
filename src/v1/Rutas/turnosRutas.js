import express from "express";
import { body } from "express-validator";
import validarCampos from "../../middlewares/validarCampos.js";
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";
import apicache from "apicache";

import TurnosControlador from "../../controladores/turnosControlador.js";

const turnosControlador = new TurnosControlador();
const router = express.Router();
let cache = apicache.middleware;

// --- Validaciones Reutilizables ---
const validacionesTurno = [
  body("orden")
    .notEmpty().withMessage("El 'orden' es requerido")
    .isInt({ min: 1 }).withMessage("El 'orden' debe ser un número"),
  body("hora_desde")
    .notEmpty().withMessage("La 'hora_desde' es requerida")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("El formato de 'hora_desde' debe ser HH:MM"),
  body("hora_hasta")
    .notEmpty().withMessage("La 'hora_hasta' es requerida")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("El formato de 'hora_hasta' debe ser HH:MM"),
  validarCampos, // Envía errores de validación como 400
];

// -----------------------------------------------------------------
// RUTAS Y DOCUMENTACIÓN SWAGGER
// -----------------------------------------------------------------

/**
 * @swagger
 * tags:
 *   name: Turnos
 *   description: Gestión de los turnos de los salones.
 */

/**
 * @swagger
 * /api/v1/turnos:
 *   get:
 *     summary: Lista todos los turnos (para todos los roles)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de turnos
 */
router.get(
  "/",
  autorizarUsuarios([1, 2, 3]),
  cache("10 minutes"),
  turnosControlador.read
);

/**
 * @swagger
 * /api/v1/turnos/{id}:
 *   get:
 *     summary: Busca un turno por ID (para todos los roles)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El ID del turno a buscar
 *     responses:
 *       '200':
 *         description: Detalle del turno
 *       '404':
 *         description: Turno no encontrado
 */
router.get(
  "/:id",
  autorizarUsuarios([1, 2, 3]),
  cache("5 minutes"),
  turnosControlador.buscarPorId
);

/**
 * @swagger
 * /api/v1/turnos:
 *   post:
 *     summary: Crea un nuevo turno (Admins y Empleados)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TurnoInput'
 *     responses:
 *       '201':
 *         description: Turno creado
 *       '400':
 *         description: Datos inválidos (error de validación)
 */
router.post(
  "/",
  autorizarUsuarios([1, 2]),
  validacionesTurno,
  turnosControlador.create
);

/**
 * @swagger
 * /api/v1/turnos/{id}:
 *   put:
 *     summary: Actualiza un turno (Admins y Empleados)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El ID del turno a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TurnoInput'
 *     responses:
 *       '200':
 *         description: Turno actualizado
 *       '400':
 *         description: Datos inválidos
 *       '404':
 *         description: Turno no encontrado
 */
router.put(
  "/:id",
  autorizarUsuarios([1, 2]),
  validacionesTurno,
  turnosControlador.update
);

/**
 * @swagger
 * /api/v1/turnos/{id}:
 *   delete:
 *     summary: Elimina un turno (borrado lógico) (Admins y Empleados)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El ID del turno a eliminar
 *     responses:
 *       '200':
 *         description: Turno eliminado
 *       '404':
 *         description: Turno no encontrado
 */
router.delete(
  "/:id",
  autorizarUsuarios([1, 2]),
  turnosControlador.delete
);

export { router };
