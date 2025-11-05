import { conexion } from "./conexion.js";

export default class Turnos {
  // Crear un turno
  createTurno = async (turno) => {
    // Obtener el último ID para no saltarse ninguno
    const [[{ turno_id: ultimoId } = { turno_id: 0 }]] = await conexion.query(
      "SELECT turno_id FROM turnos ORDER BY turno_id DESC LIMIT 1"
    );

    const siguienteId = ultimoId + 1;

    const sql = `INSERT INTO turnos (turno_id, orden, hora_desde, hora_hasta)
                 VALUES (?, ?, ?, ?)`;
    await conexion.query(sql, [
      siguienteId,
      turno.orden,
      turno.hora_desde,
      turno.hora_hasta,
    ]);

    return siguienteId;
  };

  // Obtener todos los turnos activos
  readTurnos = async () => {
    const sql = "SELECT * FROM turnos WHERE activo = 1";
    const [turnos] = await conexion.query(sql);
    return turnos;
  };

  // Buscar un turno por ID
  buscarTurnoPorId = async (turno_id) => {
    const sql = "SELECT * FROM turnos WHERE turno_id = ?";
    const [result] = await conexion.query(sql, [turno_id]);
    if (result.length === 0) return null;
    return result[0];
  };

  // Actualizar un turno existente
  updateTurno = async (id, turno) => {
    const campos = Object.keys(turno);
    const valores = Object.values(turno);

    const setClause = campos.map((campo) => `${campo} = ?`).join(", ");
    const parametros = [...valores, id];

    const sql = `UPDATE turnos SET ${setClause} WHERE turno_id = ?`;
    const [result] = await conexion.query(sql, parametros);

    if (result.affectedRows === 0) return null;
    return this.buscarTurnoPorId(id);
  };

  // Eliminar un turno (marcar como inactivo)
  deleteTurno = async (id) => {
    const [result] = await conexion.query(
      "UPDATE turnos SET activo = 0 WHERE turno_id = ? AND activo = 1",
      [id]
    );
    return result.affectedRows;
  };
}

export const turnos = new Turnos();
