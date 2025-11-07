import { conexion } from "./conexion.js";

export default class Servicios {
  read = async () => {
    const sql = "SELECT * FROM servicios WHERE activo = 1";
    const [servicios] = await conexion.execute(sql);
    return servicios;
  };

  buscarPorId = async (servicio_id) => {
    const sql = "SELECT * FROM servicios WHERE servicio_id = ? AND activo = 1";

    const [rows] = await conexion.execute(sql, [servicio_id]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  };

  create = async (servicio) => {
    const { descripcion, importe } = servicio;

    const sql = `INSERT INTO servicios 
                 (descripcion, importe, activo, creado, modificado) 
                 VALUES (?, ?, 1, NOW(), NOW())`;

    const params = [descripcion, importe];
    const [result] = await conexion.execute(sql, params);

    if (result.affectedRows === 0) {
      return null;
    }

    return this.buscarPorId(result.insertId);
  };

  update = async (servicio_id, servicio) => {
    const { descripcion, importe } = servicio;

    const sql = `UPDATE servicios SET
                    descripcion = ?, 
                    importe = ?,
                    modificado = NOW() 
                 WHERE servicio_id = ? AND activo = 1`;

    const params = [descripcion, importe, servicio_id];
    const [result] = await conexion.execute(sql, params);

    if (result.affectedRows === 0) {
      return null;
    }

    return this.buscarPorId(servicio_id);
  };

  delete = async (servicio_id) => {
    const sql = `UPDATE servicios SET 
                   activo = 0, 
                   modificado = NOW() 
                 WHERE servicio_id = ? AND activo = 1`;

    const params = [servicio_id];
    const [result] = await conexion.execute(sql, params);

    if (result.affectedRows === 0) {
      return null;
    }

    return true;
  };
}
