import Turnos from "../db/turnos.js";

export default class TurnosControlador {
  constructor() {
    this.turnosServicio = new Turnos();
  }

  // Crear un turno
  createTurno = async (req, res) => {
    try {
      const { orden, hora_desde, hora_hasta } = req.body;

      if (!orden || !hora_desde || !hora_hasta) {
        return res.status(400).json({
          estado: false,
          mensaje: "Faltan datos obligatorios: orden, hora_desde, hora_hasta",
        });
      }

      const id = await this.turnosServicio.createTurno({
        orden,
        hora_desde,
        hora_hasta,
      });

      res
        .status(201)
        .json({ estado: true, mensaje: `Turno creado con ID: ${id}` });
    } catch (error) {
      console.error("Error en POST /turnos:", error);
      res.status(500).json({ estado: false, mensaje: "Error en el servidor" });
    }
  };

  // Listar todos los turnos
  readTurnos = async (req, res) => {
    try {
      const turnos = await this.turnosServicio.readTurnos();
      res.json({ estado: true, mensaje: turnos });
    } catch (error) {
      console.error("Error en GET /turnos:", error);
      res.status(500).json({ estado: false, mensaje: "Error en el servidor" });
    }
  };

  // Buscar turno por ID
  buscarTurnoPorId = async (req, res) => {
    try {
      const id = req.params.id;
      const turno = await this.turnosServicio.buscarTurnoPorId(id);

      if (!turno) {
        return res
          .status(404)
          .json({ estado: false, mensaje: "Turno no encontrado" });
      }

      res.json({ estado: true, mensaje: turno });
    } catch (error) {
      console.error("Error en GET /turnos/:id:", error);
      res.status(500).json({ estado: false, mensaje: "Error en el servidor" });
    }
  };

  // Actualizar turno
  updateTurno = async (req, res) => {
    try {
      const id = req.params.id;
      const { orden, hora_desde, hora_hasta } = req.body;

      const turnoActualizado = await this.turnosServicio.updateTurno(id, {
        orden,
        hora_desde,
        hora_hasta,
      });

      if (!turnoActualizado) {
        return res
          .status(404)
          .json({ estado: false, mensaje: "ID inválido o turno no encontrado" });
      }

      res.json({ estado: true, mensaje: "Turno actualizado correctamente" });
    } catch (error) {
      console.error("Error en PUT /turnos/:id:", error);
      res.status(500).json({ estado: false, mensaje: "Error en el servidor" });
    }
  };

  // Eliminar turno
  deleteTurno = async (req, res) => {
    try {
      const id = req.params.id;
      const filasAfectadas = await this.turnosServicio.deleteTurno(id);

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
