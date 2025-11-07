import express from "express";
import { body } from "express-validator";
import validarCampos from "../../middlewares/validarCampos.js";
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";
import UsuariosControlador from "../../controladores/usuariosControlador.js";

const usuariosControlador = new UsuariosControlador();
const router = express.Router();

const validacionesCrear = [
  body("nombre").notEmpty().withMessage("El nombre es requerido"),
  body("apellido").notEmpty().withMessage("El apellido es requerido"),
  body("nombre_usuario")
    .notEmpty()
    .isEmail()
    .withMessage("El email (nombre_usuario) es inválido"),
  body("contrasenia")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("tipo_usuario")
    .notEmpty()
    .isInt({ min: 1, max: 3 })
    .withMessage("El tipo de usuario es inválido (debe ser 1, 2 o 3)"),
  validarCampos,
];

const validacionesUpdate = [
  body("nombre").notEmpty().withMessage("El nombre es requerido"),
  body("apellido").notEmpty().withMessage("El apellido es requerido"),
  body("nombre_usuario")
    .notEmpty()
    .isEmail()
    .withMessage("El email (nombre_usuario) es inválido"),
  body("tipo_usuario")
    .notEmpty()
    .isInt({ min: 1, max: 3 })
    .withMessage("El tipo de usuario es inválido (debe ser 1, 2 o 3)"),
  validarCampos,
];

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para la gestión de usuarios (solo administradores)
 */

/**
 * @swagger
 * /api/v1/usuarios:
 *   post:
 *     summary: Crea un nuevo usuario
 *     description: Solo los administradores pueden crear nuevos usuarios.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - nombre_usuario
 *               - contrasenia
 *               - tipo_usuario
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan"
 *               apellido:
 *                 type: string
 *                 example: "Pérez"
 *               nombre_usuario:
 *                 type: string
 *                 format: email
 *                 example: "juan.perez@email.com"
 *               contrasenia:
 *                 type: string
 *                 example: "123456"
 *               tipo_usuario:
 *                 type: integer
 *                 enum: [1, 2, 3]
 *                 example: 2
 *                 description: "1 = Admin, 2 = Empleado, 3 = Cliente"
 *     responses:
 *       '201':
 *         description: Usuario creado exitosamente
 *       '400':
 *         description: Datos inválidos
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No autorizado (solo admins)
 *       '500':
 *         description: Error interno del servidor
 */
router.post(
  "/",
  autorizarUsuarios([1]),
  validacionesCrear,
  usuariosControlador.create
);

/**
 * @swagger
 * /api/v1/usuarios:
 *   get:
 *     summary: Lista todos los usuarios
 *     description: Solo administradores y empleados pueden ver la lista completa de usuarios.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de usuarios obtenida correctamente
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No autorizado
 *       '500':
 *         description: Error interno del servidor
 */
router.get("/", autorizarUsuarios([1, 2]), usuariosControlador.read);

/**
 * @swagger
 * /api/v1/usuarios/{usuario_id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     description: Solo administradores y empleados pueden consultar datos de usuarios.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a buscar
 *     responses:
 *       '200':
 *         description: Usuario encontrado
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No autorizado
 *       '404':
 *         description: Usuario no encontrado
 *       '500':
 *         description: Error interno del servidor
 */
router.get(
  "/:usuario_id",
  autorizarUsuarios([1, 2]),
  usuariosControlador.buscarPorId
);

/**
 * @swagger
 * /api/v1/usuarios/{usuario_id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     description: Solo los administradores pueden modificar los datos de un usuario.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "María"
 *               apellido:
 *                 type: string
 *                 example: "García"
 *               nombre_usuario:
 *                 type: string
 *                 example: "maria.garcia@email.com"
 *               tipo_usuario:
 *                 type: integer
 *                 enum: [1, 2, 3]
 *                 example: 3
 *     responses:
 *       '200':
 *         description: Usuario actualizado exitosamente
 *       '400':
 *         description: Datos inválidos
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No autorizado
 *       '404':
 *         description: Usuario no encontrado
 *       '500':
 *         description: Error interno del servidor
 */
router.put(
  "/:usuario_id",
  autorizarUsuarios([1]),
  validacionesUpdate,
  usuariosControlador.update
);

/**
 * @swagger
 * /api/v1/usuarios/{usuario_id}:
 *   delete:
 *     summary: Elimina (borrado lógico) un usuario
 *     description: Solo los administradores pueden eliminar usuarios. El borrado es lógico, no físico.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       '200':
 *         description: Usuario eliminado exitosamente
 *       '401':
 *         description: No autenticado
 *       '403':
 *         description: No autorizado
 *       '404':
 *         description: Usuario no encontrado
 *       '500':
 *         description: Error interno del servidor
 */
router.delete(
  "/:usuario_id",
  autorizarUsuarios([1]),
  usuariosControlador.delete
);

export { router };
