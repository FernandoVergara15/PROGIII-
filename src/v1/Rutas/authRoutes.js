import express from "express";
import AuthController from "../../controladores/authController.js";
import { body } from "express-validator";
import validarCampos from "../../middlewares/validarCampos.js";

const router = express.Router();
const authController = new AuthController();

const validacionesLogin = [
  body("nombre_usuario", "El correo electrónico es requerido!").not().isEmpty(),
  body(
    "nombre_usuario",
    "Revisar el formato del correo electrónico!"
  ).isEmail(),
  body("contrasenia", "La contraseña es requerida!").not().isEmpty(),
  validarCampos,
];

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para iniciar sesión y obtener el token JWT
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     description: Valida las credenciales y devuelve un token JWT para acceder a endpoints protegidos.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_usuario
 *               - contrasenia
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *                 format: email
 *                 example: usuario@correo.com
 *               contrasenia:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *     responses:
 *       '200':
 *         description: Login exitoso, devuelve el token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT generado
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       '400':
 *         description: Credenciales inválidas o datos faltantes
 *       '401':
 *         description: Error de autenticación
 *       '500':
 *         description: Error interno del servidor
 */
router.post("/login", validacionesLogin, authController.login);

export { router };
