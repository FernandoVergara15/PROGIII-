import UsuariosServicio from "../servicios/usuariosService.js";

export default class UsuariosControlador {
  constructor() {
    this.usuariosServicio = new UsuariosServicio();
  }

  create = async (req, res) => {
    try {
      const usuario = req.body;
      const nuevoUsuario = await this.usuariosServicio.create(usuario);

      if (!nuevoUsuario) {
        return res.status(400).json({
          estado: false,
          mensaje: "No se pudo create el usuario (ej: email duplicado).",
        });
      }

      res.status(201).json({
        estado: true,
        mensaje: "Usuario creado correctamente.",
        usuario: nuevoUsuario,
      });
    } catch (err) {
      console.log("Error en POST /usuarios:", err);
      res.status(500).json({
        estado: false,
        mensaje: err.message || "Error interno del servidor.",
      });
    }
  };

  read = async (req, res) => {
    try {
      const filtro = {};

      const usuarios = await this.usuariosServicio.read(filtro);

      res.json({
        estado: true,
        datos: usuarios,
      });
    } catch (err) {
      console.log("Error en GET /usuarios:", err);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const usuario = await this.usuariosServicio.buscarPorId(usuario_id);

      if (!usuario) {
        return res.status(404).json({
          estado: false,
          mensaje: "Usuario no encontrado.",
        });
      }

      res.json({
        estado: true,
        usuario: usuario,
      });
    } catch (err) {
      console.log("Error en GET /usuarios/:usuario_id:", err);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };

  update = async (req, res) => {
    try {
      const usuario_id = req.params.usuario_id;

      const foto = req.file ? req.file.filename : null;
      console.log("Archivo subido:", foto);
      const datos = { ...req.body, foto };

      const usuarioActualizado = await this.usuariosServicio.update(
        usuario_id,
        datos
      );

      if (!usuarioActualizado) {
        return res.status(404).json({
          estado: false,
          mensaje: "Usuario no encontrado.",
        });
      }

      res.json({
        estado: true,
        mensaje: "Usuario actualizado correctamente.",
        usuario: usuarioActualizado,
      });
    } catch (err) {
      console.log(`Error en PUT /usuarios/${req.params.usuario_id}:`, err);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };

  delete = async (req, res) => {
    try {
      const { usuario_id } = req.params;

      const resultado = await this.usuariosServicio.delete(usuario_id);

      if (!resultado) {
        return res.status(404).json({
          estado: false,
          mensaje: "Usuario no encontrado o ya eliminado.",
        });
      }

      res.json({
        estado: true,
        mensaje: "Usuario eliminado (desactivado) correctamente.",
      });
    } catch (err) {
      console.log(`Error en DELETE /usuarios/${req.params.usuario_id}:`, err);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };

  updateFoto = async (req, res) => {
    try {
      const usuario_id = req.params.usuario_id;
      const foto = req.file ? req.file.filename : null;
      console.log(foto,"cargada")

      if (!foto) {
        return res.status(400).json({
          estado: false,
          mensaje: "No se envió ningún archivo de foto.",
        });
      }

      // llama al servicio que actualiza solo la foto
      const usuarioActualizado = await this.usuariosServicio.updateFoto(
        usuario_id,
        foto
      );

      if (!usuarioActualizado) {
        return res.status(404).json({
          estado: false,
          mensaje: "Usuario no encontrado.",
        });
      }

      res.json({
        estado: true,
        mensaje: "Foto actualizada correctamente.",
        usuario: usuarioActualizado,
      });
    } catch (err) {
      console.error(
        `Error en PUT /usuarios/${req.params.usuario_id}/foto:`,
        err
      );
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };
}
