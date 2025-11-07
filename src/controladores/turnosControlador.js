import TurnosServicio from "../servicios/turnosServicio.js";

export default class TurnosControlador {
  constructor() {
    this.turnosServicio = new TurnosServicio();
  }

  create = async (req, res) => {
    try {
      const turno = req.body;

      const nuevoTurno = await this.turnosServicio.create(turno);

     
      res.status(201).json({
        estado: true,
        mensaje: "Turno creado correctamente",
        turno: nuevoTurno,
      });
    } catch (error) {
      console.error("Error en POST /turnos:", error);
      res.status(500).json({ estado: false, mensaje: "Error en el servidor" });
    }
  };


  read = async (req, res) => {
    try {
     
      const turnos = await this.turnosServicio.read();

     
      res.json({ estado: true, datos: turnos });
    } catch (error) {
      console.error("Error en GET /turnos:", error);
      res.status(500).json({ estado: false, mensaje: "Error en el servidor" });
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const id = req.params.id;

      const turno = await this.turnosServicio.buscarPorId(id);

      if (!turno) {
        return res
          .status(404)
          .json({ estado: false, mensaje: "Turno no encontrado" });
      }

      res.json({ estado: true, turno: turno });
    } catch (error) {
      console.error("Error en GET /turnos/:id:", error);
      res.status(500).json({ estado: false, mensaje: "Error en el servidor" });
    }
  };

  update = async (req, res) => {
    try {
      const id = req.params.id;
      const turno = req.body;

      const turnoActualizado = await this.turnosServicio.update(id, turno);

      if (!turnoActualizado) {
        return res.status(404).json({
          estado: false,
          mensaje: "ID inválido o turno no encontrado",
        });
      }

      res.json({
        estado: true,
        mensaje: "Turno actualizado correctamente",
        turno: turnoActualizado,
      });
    } catch (error) {
      console.error("Error en PUT /turnos/:id:", error);
      res.status(500).json({ estado: false, mensaje: "Error en el servidor" });
    }
  };

  delete = async (req, res) => {
    try {
      const id = req.params.id;

      const filasAfectadas = await this.turnosServicio.delete(id);

      if (!filasAfectadas) {
        return res
          .status(404)
          .json({ estado: false, mensaje: "ID inválido o turno ya inactivo" });
      }

      res.json({ estado: true, mensaje: "Turno eliminado correctamente" });
    } catch (error) {
      console.error("Error en DELETE /turnos/:id:", error);
      res.status(500).json({ estado: false, mensaje: "Error en el servidor" });
    }
  };
}
