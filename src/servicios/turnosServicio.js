import Turnos from "../db/turnos.js";

export default class TurnosServicio {
  constructor() {
    this.turnos = new Turnos();
  }

  // Crear un turno
  create = (turno) => {
    return this.turnos.create(turno);
  };

  // Obtener todos los turnos activos
  read = () => {
    return this.turnos.read();
  };

  // Buscar un turno por su ID
  buscarTurnoPorId = (turno_id) => {
    return this.turnos.buscarTurnoPorId(turno_id);
  };

  // Actualizar un turno existente
  update = (id, turno) => {
    return this.turnos.update(id, turno);
  };

  // Eliminar un turno (marcar como inactivo)
  delete = (id) => {
    return this.turnos.delete(id);
  };
}
