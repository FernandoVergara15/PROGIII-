import express from "express";
import { body } from "express-validator";
import validarCampos from "../../middlewares/validarCampos.js";
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";
import apicache from "apicache";
import ServiciosControlador from "../../controladores/serviciosControlador.js";

const serviciosControlador = new ServiciosControlador();
const router = express.Router();
let cache = apicache.middleware;

const validacionesServicio = [
  body("descripcion").notEmpty().withMessage("La descripción es necesaria"),
  body("importe")
    .notEmpty()
    .withMessage("El importe es necesario")
    .isFloat({ min: 0 })
    .withMessage("El importe debe ser un número"),
  validarCampos,
];

/**
 * @swagger
 * tags:
 *   name: Servicios
 *   description: Endpoints para la gestión de servicios de eventos
 */

/**
 * @swagger
 * /api/v1/servicios:
 *   get:
 *     summary: Lista todos los servicios
 *     description: Devuelve todos los servicios disponibles en el sistema.
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de servicios obtenida correctamente
 *       '401':
 *         description: No autenticado
 *       '500':
 *         description: Error interno del servidor
 */
router.get(
  "/",
  autorizarUsuarios([1, 2, 3]),
  cache("5 minutes"),
  serviciosControlador.read
);

/**
 * @swagger
 * /api/v1/servicios/{servicio_id}:
 *   get:
 *     summary: Obtiene un servicio por su ID
 *     description: Permite a administradores y empleados ver la información de un servicio específico.
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio a buscar
 *     responses:
 *       '200':
 *         description: Servicio encontrado
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No autorizado
 *       '404':
 *         description: Servicio no encontrado
 *       '500':
 *         description: Error interno del servidor
 */
router.get(
  "/:servicio_id",
  autorizarUsuarios([1, 2]),
  cache("2 minutes"),
  serviciosControlador.buscarPorId
);

/**
 * @swagger
 * /api/v1/servicios:
 *   post:
 *     summary: Crea un nuevo servicio
 *     description: Solo administradores y empleados pueden registrar nuevos servicios.
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion
 *               - importe
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: "Servicio de catering"
 *               importe:
 *                 type: number
 *                 format: float
 *                 example: 15000
 *     responses:
 *       '201':
 *         description: Servicio creado exitosamente
 *       '400':
 *         description: Error de validación en los datos
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No autorizado
 *       '500':
 *         description: Error interno del servidor
 */
router.post(
  "/",
  autorizarUsuarios([1, 2]),
  validacionesServicio,
  serviciosControlador.create
);

/**
 * @swagger
 * /api/v1/servicios/{servicio_id}:
 *   put:
 *     summary: Actualiza un servicio existente
 *     description: Solo administradores y empleados pueden modificar los datos de un servicio.
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: "Servicio de fotografía profesional"
 *               importe:
 *                 type: number
 *                 example: 20000
 *     responses:
 *       '200':
 *         description: Servicio actualizado exitosamente
 *       '400':
 *         description: Datos inválidos
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No autorizado
 *       '404':
 *         description: Servicio no encontrado
 *       '500':
 *         description: Error interno del servidor
 */
router.put(
  "/:servicio_id",
  autorizarUsuarios([1, 2]),
  validacionesServicio,
  serviciosControlador.update
);

/**
 * @swagger
 * /api/v1/servicios/{servicio_id}:
 *   delete:
 *     summary: Elimina (borrado lógico) un servicio
 *     description: Solo administradores y empleados pueden delete un servicio. El borrado es lógico, no físico.
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio a delete
 *     responses:
 *       '200':
 *         description: Servicio eliminado correctamente
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No autorizado
 *       '404':
 *         description: Servicio no encontrado
 *       '500':
 *         description: Error interno del servidor
 */
router.delete(
  "/:servicio_id",
  autorizarUsuarios([1, 2]),
  serviciosControlador.delete
);

export { router };
