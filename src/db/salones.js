import { conexion } from "./conexion.js";

export default class Salones {
  /*se tiene que usar funcion flecha
  para que el this funcione correctamente
  en los métodos asincrónicos
  a función flecha no tiene su propio this
  toma el this del contexto donde se define
  en este caso la clase Salones*/

  create = async (salon) => {

    const [[{ salon_id: ultimoId } = { salon_id: 0 }]] = await conexion.query(
      "SELECT salon_id FROM salones ORDER BY salon_id DESC LIMIT 1"
    );

    const siguienteId = ultimoId + 1;

    const sql = `INSERT INTO salones (salon_id, titulo, direccion, capacidad, importe)
      VALUES (?, ?, ?, ?, ?)`;
    await conexion.query(sql, [
      siguienteId,
      salon.titulo,
      salon.direccion,
      salon.capacidad,
      salon.importe ?? 1,
    ]);

    return siguienteId;
  };

  read = async () => {
    const sql = "SELECT * FROM salones WHERE activo = 1";
    const [salones] = await conexion.query(sql);
    return salones;
  };

  buscarPorId = async (salon_id) => {
    const sql = "SELECT * FROM salones WHERE salon_id = ?";
    const [result] = await conexion.query(sql, salon_id);
    if (result.length === 0) {
      return null; 
    }
    return result[0];
  };

  update = async (id, salon) => {
    const { titulo, direccion, capacidad, importe } = salon;

    const sql = `
    UPDATE salones SET 
      titulo = ?,
      direccion = ?,
      capacidad = ?,
      importe = ?,
      modificado = NOW()
    WHERE salon_id = ? AND activo = 1`;

    const params = [titulo, direccion, capacidad, importe, id];

    const [result] = await conexion.execute(sql, params);
    if (result.affectedRows === 0) {
      return null;
    }
    return this.buscarPorId(id);
  };

  delete = async (id) => {
    const [result] = await conexion.query(
      "UPDATE salones SET activo = 0 WHERE salon_id = ? AND activo = 1",
      id
    );
    return result.affectedRows;
  };
}
