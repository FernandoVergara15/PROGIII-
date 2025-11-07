import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalSrategy } from "passport-local";

// 👇 1. IMPORTAMOS CRYPTO (para MD5)
import crypto from 'crypto'; 
// import bcrypt from 'bcrypt'; // <-- No usamos bcrypt entonces

// 2. Importamos el servicio
import UsuariosService from "../servicios/usuariosService.js";

/**
 * ----------------------------------------------------
 * ESTRATEGIA: LOGIN (POST /auth/login)
 * ----------------------------------------------------
 */
const estrategia = new LocalSrategy({
    usernameField: 'nombre_usuario',
    passwordField: 'contrasenia'
  }, 
    async (nombre_usuario, contrasenia, done) => {
        try{
            const usuariosServicio = new UsuariosService();

            // 1. Buscamos al usuario (esto nos da el hash MD5 de la DB)
            const usuario = await usuariosServicio.buscarPorNombreUsuario(nombre_usuario);

            if (!usuario) {
                return done(null, false, { mensaje: 'Login incorrecto!' });
            }

            // ----> 💡 CORRECCIÓN: Volvemos a usar MD5 <----
            // 2. Hasheamos la contraseña que mandó el usuario (en texto plano)
            const hashAComparar = crypto.createHash('md5')
                                        .update(contrasenia)
                                        .digest('hex');

            // 3. Comparamos el hash nuevo (hashAComparar) con el hash
            //    que está guardado en la base de datos (usuario.contrasenia)
            if (hashAComparar !== usuario.contrasenia) {
                return done(null, false, { mensaje: 'Login incorrecto!' });
            }

            // 4. ¡Éxito!
            delete usuario.contrasenia;
            return done(null, usuario, { mensaje: 'Login correcto!'});
            
        } catch(exc) {
            done(exc);
        }
    }
);


/**
 * ----------------------------------------------------
 * ESTRATEGIA: VALIDACIÓN DE TOKEN (Para todas las demás rutas)
 * ----------------------------------------------------
 */
const validacion = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
    secretOrKey: process.env.JWT_SECRET     
  },
    async (jwtPayload, done) => {
        try {
            const usuariosServicio = new UsuariosService();

            // ----> 👍 MANTENEMOS ESTE CAMBIO <----
            //
            // Usamos 'buscarParaPayload' porque es más rápido y seguro.
            // Esto no tiene nada que ver con MD5 o Bcrypt.
            const usuario = await usuariosServicio.buscarParaPayload(jwtPayload.usuario_id);

            if(!usuario){
                return done(null, false, { mensaje: 'Token incorrecto!'});
            }

            return done(null, usuario); // Esto crea req.user
        } catch (error) {
            return done(error);
        }
    }       
)

export { estrategia, validacion };