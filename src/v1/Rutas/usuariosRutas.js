import express from "express";
import { body } from "express-validator";
import multer from "multer";

import validarCampos from "../../middlewares/validarCampos.js";
import autorizarUsuarios from "../../middlewares/autorizarUsuarios.js";
import UsuariosControlador from "../../controladores/usuariosControlador.js";
import { storage } from "../../config/multer.js"; // Asegúrate que este path sea correcto

const usuariosControlador = new UsuariosControlador();
const router = express.Router();
const upload = multer({ storage });

// --------------------
// Validaciones
// --------------------

// Crear usuario (multipart/form-data)
const validacionesCrearConFoto = [
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
  validarCampos,
];

// Actualizar usuario (JSON)
const validacionesUpdate = [
  body("nombre").notEmpty().withMessage("El nombre es requerido"),
  body("apellido").notEmpty().withMessage("El apellido es requerido"),
  // ... otras validaciones de update
  validarCampos,
];

// --------------------
// Swagger Tags
// --------------------

/**
 * @swagger
 * tags:
 *   - name: Usuarios
 *     description: Endpoints para la gestión de usuarios
 */

// --------------------
// Rutas
// --------------------

/**
 * @swagger
 * /api/v1/usuarios:
 *   post:
 *     summary: Crea un nuevo usuario (con foto)
 *     description: Solo los administradores pueden crear nuevos usuarios. Recibe multipart/form-data.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - nombre_usuario
 *               - contrasenia
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Cristiano"
 *               apellido:
 *                 type: string
 *                 example: "Noaveira"
 *               nombre_usuario:
 *                 type: string
 *                 format: email
 *                 example: "ninguno@correo.com"
 *               contrasenia:
 *                 type: string
 *                 example: "ninguno"
 *               tipo_usuario:
 *                 type: integer
 *                 example: 3
 *                 description: "Hardcodeado por el frontend (3 = Cliente)"
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: "Archivo de imagen (opcional)"
 *     responses:
 *       '201':
 *         description: Usuario creado exitosamente
 *       '400':
 *         description: Datos inválidos
 *       '403':
 *         description: No autorizado
 */
router.post(
  "/",
  autorizarUsuarios([1]),
  upload.single("foto"),
  validacionesCrearConFoto,
  usuariosControlador.create
);

/**
 * @swagger
 * /api/v1/usuarios:
 *   get:
 *     summary: Lista todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de usuarios
 */
router.get("/", autorizarUsuarios([1, 2]), usuariosControlador.read);

/**
 * @swagger
 * /api/v1/usuarios/{usuario_id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Usuario encontrado
 *       '404':
 *         description: Usuario no encontrado
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
 *     summary: Actualiza un usuario existente (datos de texto)
 *     description: Solo Admins. Actualiza datos de perfil, NO la foto.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       '200':
 *         description: Usuario actualizado
 *       '404':
 *         description: Usuario no encontrado
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
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Usuario eliminado
 *       '404':
 *         description: Usuario no encontrado
 */
router.delete(
  "/:usuario_id",
  autorizarUsuarios([1]),
  usuariosControlador.delete
);

/**
 * @swagger
 * /api/v1/usuarios/{usuario_id}/foto:
 *   put:
 *     summary: Actualiza la foto de un usuario
 *     description: Permite a un usuario (o admin) actualizar su foto de perfil.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: "Archivo de imagen"
 *     responses:
 *       '200':
 *         description: Foto actualizada
 *       '404':
 *         description: Usuario no encontrado
 */
router.put(
  "/:usuario_id/foto",
  autorizarUsuarios([3]),
  upload.single("foto"),
  usuariosControlador.updateFoto
);

export { router };
