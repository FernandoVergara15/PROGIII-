import express from "express";
import { body } from "express-validator";
import validarCampos from "../../middlewares/validarCampos.js";
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";
import ReservasControlador from "../../controladores/reservasControlador.js";

const reservasControlador = new ReservasControlador();
const router = express.Router();

const validacionesReservas = [
  body("fecha_reserva", "La fecha es necesaria.").notEmpty(),
  body("salon_id", "El salón es necesario.").notEmpty(),
  body("usuario_id", "El usuario es necesario.").notEmpty(),
  body("turno_id", "El turno es necesario.").notEmpty(),
  body("servicios", "Faltan los servicios de la reserva.").notEmpty().isArray(),
  body("servicios.*.importe")
    .isFloat()
    .withMessage("El importe debe ser numérico."),
  validarCampos,
];

/**
 * @swagger
 * tags:
 *   - name: Reservas
 *     description: Endpoints para la gestión de reservas
 */

/**
 * @swagger
 * /api/v1/reservas/informe:
 *   get:
 *     summary: Genera un informe de reservas (Solo Admins)
 *     description: Genera un archivo PDF o CSV con el reporte de reservas.
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: formato
 *         required: true
 *         schema:
 *           type: string
 *           enum: [csv, pdf]
 *         description: El formato del reporte (csv o pdf)
 *     responses:
 *       '200':
 *         description: Archivo (CSV o PDF) descargado
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           text/csv:
 *             schema:
 *               type: string
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No autorizado (solo Admins)
 *       '500':
 *         description: Error interno del servidor
 */
router.get("/informe", autorizarUsuarios([1]), reservasControlador.informe);

/**
 * @swagger
 * /api/v1/reservas/estadisticas:
 *   get:
 *     summary: Obtiene estadísticas de reservas (Solo Admins)
 *     description: Devuelve un JSON con estadísticas (ej. salones más reservados).
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Estadísticas en formato JSON
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No autorizado (solo Admins)
 *       '500':
 *         description: Error interno del servidor
 */
router.get(
  "/estadisticas",
  autorizarUsuarios([1]),
  reservasControlador.estadisticas
);

/**
 * @swagger
 * /api/v1/reservas:
 *   get:
 *     summary: Lista todas las reservas (filtrado por rol)
 *     description: |
 *       - Admins (1) y Empleados (2) ven todas las reservas.
 *       - Clientes (3) ven solo las reservas que crearon.
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de reservas exitosa
 *       '401':
 *         description: No autenticado (token inválido o no provisto)
 *       '500':
 *         description: Error interno del servidor
 */
router.get("/", autorizarUsuarios([1, 2, 3]), reservasControlador.read);

/**
 * @swagger
 * /api/v1/reservas/{reserva_id}:
 *   get:
 *     summary: Busca una reserva por su ID (Admins y Empleados)
 *     description: Obtiene el detalle de una reserva específica.
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El ID de la reserva a buscar
 *     responses:
 *       '200':
 *         description: Detalle de la reserva
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No autorizado
 *       '404':
 *         description: Reserva no encontrada
 *       '500':
 *         description: Error interno del servidor
 */
router.get(
  "/:reserva_id",
  autorizarUsuarios([1, 2]),
  reservasControlador.buscarPorId
);

/**
 * @swagger
 * /api/v1/reservas:
 *   post:
 *     summary: Crea una nueva reserva (Admins y Clientes)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservaInput'
 *     responses:
 *       '201':
 *         description: Reserva creada exitosamente
 *       '400':
 *         description: Datos inválidos (error de validación)
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No autorizado (ej. Empleado intentando create)
 *       '500':
 *         description: Error interno del servidor
 */
router.post(
  "/",
  autorizarUsuarios([1, 3]),
  validacionesReservas,
  reservasControlador.create
);

/**
 * @swagger
 * /api/v1/reservas/{reserva_id}:
 *   put:
 *     summary: Actualiza una reserva existente (Solo Admins)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El ID de la reserva a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservaInput'
 *     responses:
 *       '200':
 *         description: Reserva actualizada exitosamente
 *       '400':
 *         description: Datos inválidos (error de validación)
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No autorizado
 *       '404':
 *         description: Reserva no encontrada
 *       '500':
 *         description: Error interno del servidor
 */
router.put(
  "/:reserva_id",
  autorizarUsuarios([1]),
  validacionesReservas,
  reservasControlador.update
);

/**
 * @swagger
 * /api/v1/reservas/{reserva_id}:
 *   delete:
 *     summary: Elimina una reserva (borrado lógico) (Solo Admins)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El ID de la reserva a delete
 *     responses:
 *       '200':
 *         description: Reserva eliminada (desactivada) exitosamente
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No autorizado
 *       '404':
 *         description: Reserva no encontrada
 *       '500':
 *         description: Error interno del servidor
 */
router.delete(
  "/:reserva_id",
  autorizarUsuarios([1]),
  reservasControlador.delete
);

export { router };
