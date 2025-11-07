import TurnosServicio from "../servicios/turnosServicio.js";

export default class TurnosControlador {
  constructor() {
    this.turnosServicio = new TurnosServicio();
  }

  /**
   * (Antes 'create')
   * Crea un turno.
   * La validación de 'orden', 'hora_desde', 'hora_hasta'
   * se delega al middleware 'validarCampos' en la ruta.
   */
  create = async (req, res) => {
    try {
      const turno = req.body;

      // 1. Llamamos al servicio (asumimos que el método se llama 'create')
      const nuevoTurno = await this.turnosServicio.create(turno);

      // 2. Devolvemos el objeto completo
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

  /**
   * (Antes 'read')
   * Lista todos los turnos.
   */
  read = async (req, res) => {
    try {
      // 1. Llamamos al servicio (asumimos que el método se llama 'read')
      const turnos = await this.turnosServicio.read();

      // 2. Respuesta estandarizada
      res.json({ estado: true, datos: turnos });
    } catch (error) {
      console.error("Error en GET /turnos:", error);
      res.status(500).json({ estado: false, mensaje: "Error en el servidor" });
    }
  };

  /**
   * (Antes 'buscarTurnoPorId', estandarizado a 'buscarPorId')
   * Busca un turno por su ID.
   */
  buscarPorId = async (req, res) => {
    try {
      const id = req.params.id;

      // 1. Llamamos al servicio (asumimos 'buscarPorId')
      const turno = await this.turnosServicio.buscarPorId(id);

      if (!turno) {
        return res
          .status(404)
          .json({ estado: false, mensaje: "Turno no encontrado" });
      }

      // 2. Respuesta estandarizada
      res.json({ estado: true, turno: turno });
    } catch (error) {
      console.error("Error en GET /turnos/:id:", error);
      res.status(500).json({ estado: false, mensaje: "Error en el servidor" });
    }
  };

  /**
   * (Se mantiene 'update')
   * Actualiza un turno.
   */
  update = async (req, res) => {
    try {
      const id = req.params.id;
      const turno = req.body;

      // 1. Llamamos al servicio
      const turnoActualizado = await this.turnosServicio.update(id, turno);

      if (!turnoActualizado) {
        return res.status(404).json({
          estado: false,
          mensaje: "ID inválido o turno no encontrado",
        });
      }

      // 2. Respuesta estandarizada
      res.json({
        estado: true,
        mensaje: "Turno actualizado correctamente",
        turno: turnoActualizado, // Devolvemos el objeto actualizado
      });
    } catch (error) {
      console.error("Error en PUT /turnos/:id:", error);
      res.status(500).json({ estado: false, mensaje: "Error en el servidor" });
    }
  };

  /**
   * (Antes 'delete', cambiado a 'delete')
   * Elimina un turno (borrado lógico).
   */
  delete = async (req, res) => {
    try {
      const id = req.params.id;

      // 1. Llamamos al servicio (asumimos 'delete')
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
