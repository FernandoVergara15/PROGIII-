import Salones from "../db/salones.js";

export default class SalonesServicio {
  constructor() {
    this.salones = new Salones();
  }

  create = (salon) => {
    return this.salones.create(salon);
  };
  read = () => {
    return this.salones.read();
  };
  buscarPorId(salon_id) {
    return this.salones.buscarPorId(salon_id);
  }
  update(id, salon) {
    const existe = this.salones.update(id, salon);
    if (!existe) {
      return null;
    }
    return this.salones.update(id, salon);
  }
  delete(id) {
    return this.salones.delete(id);
  }
}
