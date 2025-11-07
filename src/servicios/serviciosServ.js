// 1. Importa la capa de Repositorio (la que habla con la BD)
import Servicios from "../db/servicios.js";

export default class ServiciosServicio {
  constructor() {
    this.servicio = new Servicios();
  }

  read = async () => {
    return await this.servicio.read();
  };

  buscarPorId = async (servicio_id) => {
    return await this.servicio.buscarPorId(servicio_id);
  };

  create = async (servicio) => {
    return await this.servicio.create(servicio);
  };

  update = async (servicio_id, servicio) => {
    return await this.servicio.update(servicio_id, servicio);
  };

  delete = async (servicio_id) => {
    return await this.servicio.delete(servicio_id);
  };
}
