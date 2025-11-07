import Turnos from "../db/turnos.js";

export default class TurnosServicio {
  constructor() {
    this.turnos = new Turnos();
  }

  // Crear un turno
  createTurno = (turno) => {
    return this.turnos.createTurno(turno);
  };

  // Obtener todos los turnos activos
  readTurnos = () => {
    return this.turnos.readTurnos();
  };

  // Buscar un turno por su ID
  buscarTurnoPorId = (turno_id) => {
    return this.turnos.buscarTurnoPorId(turno_id);
  };

  // Actualizar un turno existente
  updateTurno = (id, turno) => {
    return this.turnos.updateTurno(id, turno);
  };

  // Eliminar un turno (marcar como inactivo)
  deleteTurno = (id) => {
    return this.turnos.deleteTurno(id);
  };
}
