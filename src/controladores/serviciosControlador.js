import ServiciosServicio from "../servicios/serviciosServ.js";

export default class ServiciosControlador {
  constructor() {
    this.serviciosServicio = new ServiciosServicio();
  }

  create = async (req, res) => {
    try {
      const servicio = req.body;

      const nuevoServicio = await this.serviciosServicio.create(servicio);

      res.status(201).json({
        estado: true,
        mensaje: "Servicio creado correctamente.",
        servicio: nuevoServicio,
      });
    } catch (err) {
      console.log("Error en POST /servicios:", err);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };

  read = async (req, res) => {
    try {
      const servicios = await this.serviciosServicio.read();

      res.json({
        estado: true,
        datos: servicios,
      });
    } catch (err) {
      console.log("Error en GET /servicios:", err);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const { servicio_id } = req.params;
      const servicio = await this.serviciosServicio.buscarPorId(servicio_id);

      if (!servicio) {
        return res.status(404).json({
          estado: false,
          mensaje: "Servicio no encontrado.",
        });
      }

      res.json({
        estado: true,
        servicio: servicio,
      });
    } catch (err) {
      console.log("Error en GET /servicios/:servicio_id:", err);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };

  update = async (req, res) => {
    try {
      const { servicio_id } = req.params;
      const servicio = req.body;

      const servicioActualizado = await this.serviciosServicio.update(
        servicio_id,
        servicio
      );

      if (!servicioActualizado) {
        return res.status(404).json({
          estado: false,
          mensaje: "Servicio no encontrado.",
        });
      }

      res.json({
        estado: true,
        mensaje: "Servicio actualizado correctamente.",
        servicio: servicioActualizado,
      });
    } catch (err) {
      console.log(`Error en PUT /servicios/${req.params.servicio_id}:`, err);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };

  delete = async (req, res) => {
    try {
      const { servicio_id } = req.params;

      const resultado = await this.serviciosServicio.delete(servicio_id);

      if (!resultado) {
        return res.status(404).json({
          estado: false,
          mensaje: "Servicio no encontrado o ya eliminado.",
        });
      }

      res.json({
        estado: true,
        mensaje: "Servicio eliminado (desactivado) correctamente.",
      });
    } catch (err) {
      console.log(`Error en DELETE /servicios/${req.params.servicio_id}:`, err);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };
}
