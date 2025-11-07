import Turnos from "../db/turnos.js";

export default class TurnosServicio {
  constructor() {
    this.turnos = new Turnos();
  }

  create = (turno) => {
    return this.turnos.create(turno);
  };

  read = () => {
    return this.turnos.read();
  };

  buscarTurnoPorId = (turno_id) => {
    return this.turnos.buscarTurnoPorId(turno_id);
  };

  update = (id, turno) => {
    return this.turnos.update(id, turno);
  };

  delete = (id) => {
    return this.turnos.delete(id);
  };
}
