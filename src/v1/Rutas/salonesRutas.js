import express from "express";
import SalonesControlador from "../../controladores/salonesControlador.js";
import { body } from "express-validator";
import validarCampos from "../../middlewares/validarCampos.js";
import apicache from "apicache";
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";

const salonesControlador = new SalonesControlador();
const router = express.Router();
let cache = apicache.middleware;

const validacionesSalon = [
  body("titulo").notEmpty().withMessage("falta el valor titulo"),
  body("direccion").notEmpty().withMessage("falta el valor direccion"),
  body("capacidad")
    .notEmpty()
    .withMessage("falta el valor capacidad")
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser número"),
  body("importe")
    .notEmpty()
    .withMessage("falta el valor importe")
    .isFloat({ min: 1 })
    .withMessage("El importe debe ser número"),
  validarCampos,
];

/**
 * @swagger
 * tags:
 *   name: Salones
 *   description: Endpoints para la gestión de salones de eventos
 */

/**
 * @swagger
 * /api/v1/salones:
 *   get:
 *     summary: Lista todos los salones disponibles
 *     description: Devuelve todos los salones activos en el sistema. Los clientes también pueden acceder.
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de salones obtenida correctamente
 *       '401':
 *         description: No autenticado (token inválido o ausente)
 *       '500':
 *         description: Error interno del servidor
 */
router.get(
  "/",
  autorizarUsuarios([1, 2, 3]),
  cache("5 minutes"),
  salonesControlador.read
);

/**
 * @swagger
 * /api/v1/salones/{id}:
 *   get:
 *     summary: Obtiene un salón por su ID
 *     description: Permite a administradores y empleados consultar la información detallada de un salón.
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón a buscar
 *     responses:
 *       '200':
 *         description: Salón encontrado
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No autorizado
 *       '404':
 *         description: Salón no encontrado
 *       '500':
 *         description: Error interno del servidor
 */
router.get(
  "/:id",
  autorizarUsuarios([1, 2]),
  cache("2 minutes"),
  salonesControlador.buscarPorId
);

/**
 * @swagger
 * /api/v1/salones:
 *   post:
 *     summary: Crea un nuevo salón
 *     description: Solo administradores y empleados pueden registrar nuevos salones.
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - direccion
 *               - capacidad
 *               - importe
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Salón Primavera"
 *               direccion:
 *                 type: string
 *                 example: "Av. Siempre Viva 742"
 *               capacidad:
 *                 type: integer
 *                 example: 100
 *               importe:
 *                 type: number
 *                 format: float
 *                 example: 25000
 *     responses:
 *       '201':
 *         description: Salón creado exitosamente
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
  validacionesSalon,
  salonesControlador.create
);

/**
 * @swagger
 * /api/v1/salones/{id}:
 *   put:
 *     summary: Actualiza un salón existente
 *     description: Solo administradores y empleados pueden actualizar la información de un salón.
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               direccion:
 *                 type: string
 *               capacidad:
 *                 type: integer
 *               importe:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Salón actualizado exitosamente
 *       '400':
 *         description: Datos inválidos
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No autorizado
 *       '404':
 *         description: Salón no encontrado
 *       '500':
 *         description: Error interno del servidor
 */
router.put(
  "/:id",
  autorizarUsuarios([1, 2]),
  validacionesSalon,
  salonesControlador.update
);

/**
 * @swagger
 * /api/v1/salones/{id}:
 *   delete:
 *     summary: Elimina (borrado lógico) un salón
 *     description: Solo administradores y empleados pueden delete un salón. El borrado es lógico, no físico.
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salón a delete
 *     responses:
 *       '200':
 *         description: Salón eliminado correctamente
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No autorizado
 *       '404':
 *         description: Salón no encontrado
 *       '500':
 *         description: Error interno del servidor
 */
router.delete("/:id", autorizarUsuarios([1, 2]), salonesControlador.delete);

export { router };
