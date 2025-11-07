import { conexion } from "./conexion.js";

export default class Turnos {

  create = async (turno) => {
    const { orden, hora_desde, hora_hasta } = turno;

    const sql = `INSERT INTO turnos (orden, hora_desde, hora_hasta, activo, creado, modificado)
                 VALUES (?, ?, ?, 1, NOW(), NOW())`;
    
    const params = [orden, hora_desde, hora_hasta];
    const [result] = await conexion.execute(sql, params);

    if (result.affectedRows === 0) {
      return null;
    }
    return this.buscarPorId(result.insertId);
  };

  read = async () => {
    const sql = "SELECT * FROM turnos WHERE activo = 1";
    const [turnos] = await conexion.execute(sql);
    return turnos;
  };

  buscarPorId = async (turno_id) => {
    const sql = "SELECT * FROM turnos WHERE turno_id = ? AND activo = 1";
    const [rows] = await conexion.execute(sql, [turno_id]);
    
    if (rows.length === 0) return null;
    return rows[0]; // Devuelve el objeto, no un array
  };

  update = async (id, turno) => {
    const { orden, hora_desde, hora_hasta } = turno;

    const sql = `UPDATE turnos SET 
                   orden = ?, 
                   hora_desde = ?, 
                   hora_hasta = ?, 
                   modificado = NOW() 
                 WHERE turno_id = ? AND activo = 1`;
                 
    const params = [orden, hora_desde, hora_hasta, id];
    const [result] = await conexion.execute(sql, params);

    if (result.affectedRows === 0) return null;
    return this.buscarPorId(id);
  };

  delete = async (id) => {
    const sql = `UPDATE turnos SET 
                   activo = 0, 
                   modificado = NOW() 
                 WHERE turno_id = ? AND activo = 1`;
                 
    const [result] = await conexion.execute(sql, [id]);
    return result.affectedRows > 0 ? true : null;
  };
}