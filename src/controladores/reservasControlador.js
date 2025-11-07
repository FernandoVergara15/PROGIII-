import ReservasServicio from "../servicios/reservasServicio.js";
const formatosPermitidos = ["pdf", "csv"];

export default class ReservasControlador {
  constructor() {
    this.reservasServicio = new ReservasServicio();
  }

  create = async (req, res) => {
    try {
      const {
        fecha_reserva,
        salon_id,
        usuario_id,
        turno_id,
        foto_cumpleaniero,
        tematica,
        importe_salon,
        importe_total,
        servicios,
      } = req.body;

      const reserva = {
        fecha_reserva,
        salon_id,
        usuario_id,
        turno_id,
        foto_cumpleaniero,
        tematica,
        importe_salon,
        importe_total,
        servicios,
      };

      const nuevaReserva = await this.reservasServicio.create(reserva);

      if (!nuevaReserva) {
        return res.status(404).json({
          estado: false,
          mensaje: "Reserva no creada",
        });
      }

      res.json({
        estado: true,
        mensaje: "Reserva creada!",
        salon: nuevaReserva,
      });
    } catch (err) {
      console.log("Error en POST /reservas/", err);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };

  read = async (req, res) => {
    try {
      const { usuario_id, tipo_usuario } = req.user;

      let filtro = {};

      if (tipo_usuario === 3) {
        filtro.usuario_id = usuario_id;
      }

      const reservas = await this.reservasServicio.read(filtro);

      res.json({
        estado: true,
        datos: reservas,
      });
    } catch (err) {
      console.log("Error en GET /reservas", err);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const reserva_id = req.params.reserva_id;
      const reserva = await this.reservasServicio.buscarPorId(reserva_id);

      if (!reserva) {
        return res.status(404).json({
          estado: false,
          mensaje: "Reserva no encontrada.",
        });
      }

      res.json({
        estado: true,
        reserva: reserva,
      });
    } catch (err) {
      console.log("Error en GET /reservas/reservas_id", err);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };

  update = async (req, res) => {
    try {
      const { reserva_id } = req.params;

      const {
        fecha_reserva,
        salon_id,
        usuario_id,
        turno_id,
        foto_cumpleaniero,
        tematica,
        importe_salon,
        importe_total,
        servicios,
      } = req.body;

      const reserva = {
        fecha_reserva,
        salon_id,
        usuario_id,
        turno_id,
        foto_cumpleaniero,
        tematica,
        importe_salon,
        importe_total,
        servicios,
      };

      const reservaActualizada = await this.reservasServicio.update(
        reserva_id,
        reserva
      );

      if (!reservaActualizada) {
        return res.status(404).json({
          estado: false,
          mensaje: "Reserva no encontrada.",
        });
      }

      res.json({
        estado: true,
        mensaje: "Reserva actualizada correctamente!",
        reserva: reservaActualizada,
      });
    } catch (err) {
      console.log(`Error en PUT /reservas/${req.params.reserva_id}`, err);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };

  delete = async (req, res) => {
    try {
      const { reserva_id } = req.params;
      const resultado = await this.reservasServicio.delete(reserva_id);

      if (!resultado) {
        return res.status(404).json({
          estado: false,
          mensaje: "Reserva no encontrada o ya eliminada.",
        });
      }

      res.json({
        estado: true,
        mensaje: "Reserva eliminada (desactivada) correctamente.",
      });
    } catch (err) {
      console.log(`Error en DELETE /reservas/${req.params.reserva_id}`, err);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };

  informe = async (req, res) => {
    try {
      const formato = req.query.formato;

      if (!formato || !formatosPermitidos.includes(formato)) {
        return res.status(400).send({
          estado: "Falla",
          mensaje: "Formato inválido para el informe.",
        });
      }

      const { buffer, path, headers } =
        await this.reservasServicio.generarInforme(formato);

      // setear la cabecera de respuesta
      res.set(headers);

      if (formato === "pdf") {
        res.status(200).end(buffer);
      } else if (formato === "csv") {
        res.status(200).download(path, (err) => {
          if (err) {
            return res.status(500).send({
              estado: "Falla",
              mensaje: " No se pudo generar el informe.",
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        estado: "Falla",
        mensaje: "Error interno en servidor.",
      });
    }
  };

  estadisticas = async (req, res) => {
    try {
      const datos = await this.reservasServicio.obtenerEstadisticas();

      res.json({
        estado: true,
        datos: datos,
      });
    } catch (err) {
      console.log("Error en GET /reservas/estadisticas:", err);
      res.status(500).json({
        estado: false,
        mensaje: "Error interno del servidor.",
      });
    }
  };
}
