import { conexion } from "./conexion.js";
/* para que sirve este archivo?
En este archivo se define la clase Salones
que maneja las operaciones CRUD
mediante métodos asincrónicos para la
tabla 'salones' en la base de datos.
*/

/* exportamos la clase al igual
 que se puede exportar una función
o una variable  para usarla en otro archivo .js
*/
export default class Salones {
  /*se tiene que usar funcion flecha
  para que el this funcione correctamente
  en los métodos asincrónicos
  a función flecha no tiene su propio this
  toma el this del contexto donde se define
  en este caso la clase Salones*/

  createSalon = async (salon) => {
    // verifica por cual ID va y no salta ninguno
    const [[{ salon_id: ultimoId } = { salon_id: 0 }]] = await conexion.query(
      "SELECT salon_id FROM salones ORDER BY salon_id DESC LIMIT 1"
    );

    const siguienteId = ultimoId + 1;

    // Insertar el nuevo salón
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

  readSalones = async () => {
    const sql = "SELECT * FROM salones WHERE activo = 1";
    const [salones] = await conexion.query(sql);
    return salones;
  };

  buscarSalonPorId = async (salon_id) => {
    const sql = "SELECT * FROM salones WHERE salon_id = ?";
    const [result] = await conexion.query(sql, salon_id);
    if (result.length === 0) {
      return null; // o lanzar un error si se configura previamente
    }
    return result[0];
  };

  updateSalon = async (id, salon) => {
    const camposAActualizar = Object.keys(salon);
    const valoresAActualizar = Object.values(salon);

    const Valores = camposAActualizar.map((campo) => `${campo} = ?`).join(", ");
    const parametro = [...valoresAActualizar, id];
    const sql = `UPDATE salones SET ${Valores} WHERE salon_id = ?`;
    const [result] = await conexion.query(sql, parametro);
    if (result.affectedRows === 0) {
      return null; // o lanzar un error si se configura previamente
    }
    return this.buscarSalonPorId(id);
  };

  deleteSalon = async (id) => {
    const [result] = await conexion.query(
      "UPDATE salones SET activo = 0 WHERE salon_id = ? AND activo = 1",
      id
    );
    return result.affectedRows;
  };
}

export const salones = new Salones();
