import Usuarios from "../db/usuarios.js";
import bcrypt from "bcrypt";

export default class UsuariosService {
  constructor() {
    this.usuarios = new Usuarios();
    this.saltRounds = 10;
  }

  create = async (usuario) => {
    try {
      const hash = await bcrypt.hash(usuario.contrasenia, this.saltRounds);

      const usuarioHasheado = {
        ...usuario,
        contrasenia: hash,
      };

      return await this.usuarios.create(usuarioHasheado);
    } catch (error) {
      console.error("Error al hashear la contraseña:", error);
      throw new Error("Error en el servicio al create usuario.");
    }
  };

  read = async (filtro = {}) => {
    return await this.usuarios.read(filtro);
  };

  buscarPorId = async (usuario_id) => {
    return await this.usuarios.buscarPorId(usuario_id);
  };

  update = async (usuario_id, usuario) => {
    const usuario_existente = await this.usuarios.buscarPorId(usuario_id);

    if (!usuario_existente) {
      return null; 
    }
    return await this.usuarios.update(usuario_id, usuario);
  };

  delete = async (usuario_id) => {
    return await this.usuarios.delete(usuario_id);
  };

  buscarPorNombreUsuario = async (nombre_usuario) => {
    return await this.usuarios.buscarPorNombreUsuario(nombre_usuario);
  };

  buscarParaPayload = async (usuario_id) => {
    return await this.usuarios.buscarParaPayload(usuario_id);
  };

  updateFoto = async (usuario_id, foto) => {
  const usuarioExistente = await this.usuarios.buscarPorId(usuario_id);
  if (!usuarioExistente) return null;

  return await this.usuarios.updateFoto(usuario_id, foto);
};

}
