import { conexion } from "./conexion.js";

export default class Usuarios {
  read = async (filtro = {}) => {
    let sql = `SELECT 
                  usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, activo 
               FROM usuarios 
               WHERE activo = 1`;

    const params = [];

    if (filtro.tipo_usuario) {
      sql += " AND tipo_usuario = ?";
      params.push(filtro.tipo_usuario);
    }

    const [rows] = await conexion.execute(sql, params);
    return rows;
  };

  buscarPorId = async (usuario_id) => {
    const sql = `SELECT 
                    usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, activo 
                 FROM usuarios 
                 WHERE usuario_id = ? AND activo = 1`;

    const [rows] = await conexion.execute(sql, [usuario_id]);

    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  };

  create = async (usuario) => {
    const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario } =
      usuario;

    const sql = `INSERT INTO usuarios 
                 (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, activo, creado, modificado) 
                 VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())`;

    const params = [
      nombre,
      apellido,
      nombre_usuario,
      contrasenia,
      tipo_usuario,
    ];

    const [result] = await conexion.execute(sql, params);

    if (result.affectedRows === 0) {
      return null;
    }

    return this.buscarPorId(result.insertId);
  };

  update = async (usuario_id, usuario) => {
    const { nombre, apellido, nombre_usuario, tipo_usuario, foto } = usuario;

    const sql = `UPDATE usuarios SET 
                    nombre = ?,
                    apellido = ?,
                    nombre_usuario = ?,
                    tipo_usuario = ?,
                    foto = ?,
                    modificado = NOW()
                 WHERE usuario_id = ? AND activo = 1`;

    const params = [
      nombre,
      apellido,
      nombre_usuario,
      tipo_usuario,
      foto,
      usuario_id,
    ];

    const [result] = await conexion.execute(sql, params);

    if (result.affectedRows === 0) {
      return null;
    }

    return this.buscarPorId(usuario_id);
  };

  delete = async (usuario_id) => {
    const sql = `UPDATE usuarios SET 
                   activo = 0, 
                   modificado = NOW() 
                 WHERE usuario_id = ? AND activo = 1`;

    const [result] = await conexion.execute(sql, [usuario_id]);

    if (result.affectedRows === 0) {
      return null;
    }
    return true;
  };

  buscarPorNombreUsuario = async (nombre_usuario) => {
    const sql = `SELECT 
                    u.usuario_id, 
                    u.nombre_usuario, 
                    u.contrasenia, -- Devuelve el HASH
                    CONCAT(u.nombre, ' ', u.apellido) as usuario, 
                    u.tipo_usuario
                 FROM usuarios AS u
                 WHERE u.nombre_usuario = ? AND u.activo = 1;`;

    const [result] = await conexion.query(sql, [nombre_usuario]);
    return result[0];
  };

  buscarParaPayload = async (usuario_id) => {
    const sql = `SELECT CONCAT(u.nombre, ' ', u.apellido) as usuario, u.tipo_usuario, u.usuario_id
                 FROM usuarios AS u
                 WHERE u.usuario_id = ? AND u.activo = 1;`;

    const [result] = await conexion.query(sql, [usuario_id]);
    return result[0];
  };

  updateFoto = async (usuario_id, foto) => {
    const sql = `
    UPDATE usuarios 
    SET foto = ?, modificado = NOW() 
    WHERE usuario_id = ? AND activo = 1
  `;
    const params = [foto, usuario_id];

    const [result] = await conexion.execute(sql, params);

    if (result.affectedRows === 0) return null;

    return this.buscarPorId(usuario_id);
  };
}
