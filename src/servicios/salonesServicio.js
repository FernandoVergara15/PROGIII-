import Salones from "../db/salones.js";

export default class SalonesServicio {
  constructor() {
    this.salones = new Salones();
  }

  createSalon = (salon) => {
    return this.salones.createSalon(salon);
  };
  readSalones = () => {
    return this.salones.readSalones();
  };
  buscarSalonPorId(salon_id) {
    return this.salones.buscarSalonPorId(salon_id);
  }
  updateSalon(id,salon) {
    return this.salones.updateSalon(id, salon);
  }
  deleteSalon(id) {
    return this.salones.deleteSalon(id);
  }
}
