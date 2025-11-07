import Reservas from "../db/reservas.js";
import ReservasServicios from "../db/reservas_servicios.js";
import NotificacionesService from "./notificacionesServicio.js";
import InformesService from "./informesServicio.js";

export default class ReservasServicio {
  constructor() {
    this.reserva = new Reservas();
    this.reservas_servicios = new ReservasServicios();
    this.notificacioes_servicios = new NotificacionesService();
    this.informes = new InformesService();
  }

  read = (filtro = {}) => {
    return this.reserva.read(filtro);
  };

  buscarPorId = (reserva_id) => {
    return this.reserva.buscarPorId(reserva_id);
  };

  create = async (reserva) => {
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
    } = reserva;

    const nuevaReserva = {
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
      importe_total,
    };

    const result = await this.reserva.create(nuevaReserva);

    if (!result) {
      return null;
    }

    // CREO LAS RELACIONES RESERVAS-SERVICIOS
    await this.reservas_servicios.create(result.reserva_id, servicios);

    // BUSCO LOS DATOS PARA LA NOTIFICACION, LEYENDO DESDE LA BASE DE DATOS (DATOS CREADOS)
    const datosParaNotificacion = await this.reserva.datosParaNotificacion(
      result.reserva_id
    );

    // ENVIO NOTIFICACION
    this.notificacioes_servicios
      .enviarCorreo(datosParaNotificacion)
      .catch((err) => {
        console.error("Error asíncrono al enviar email de reserva:", err);
      });

    return this.reserva.buscarPorId(result.reserva_id);
  };

  update = async (reserva_id, reserva) => {
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
    } = reserva;

    const reservaData = {
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
      importe_total,
    };

    const result = await this.reserva.update(reserva_id, reservaData);

    if (!result) {
      return null;
    }

    if (servicios && Array.isArray(servicios)) {
      await this.reservas_servicios.sincronizar(reserva_id, servicios);
    }

    const datosParaNotificacion = await this.reserva.datosParaNotificacion(
      reserva_id
    );

    if (datosParaNotificacion) {
      this.notificacioes_servicios
        .update(datosParaNotificacion)
        .catch((err) => {
          console.error(
            "Error asíncrono al enviar email de actualización:",
            err
          );
        });
    }
    return this.reserva.buscarPorId(reserva_id);
  };

  delete = async (reserva_id) => {
    const resultado = await this.reserva.delete(reserva_id);

    if (!resultado) {
      return null;
    }
    return resultado;
  };

  generarInforme = async (formato) => {
    if (formato === "pdf") {
      const datosReporte = await this.reserva.buscarDatosReporteCsv();

      const pdf = await this.informes.informeReservasPdf(datosReporte);

      return {
        buffer: pdf,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Dispositon": 'inline; filename = "reporte3010.pdf"',
        },
      };
    } else if (formato === "csv") {
      const datosReporte = await this.reserva.buscarDatosReporteCsv();

      const csv = await this.informes.informeReservasCsv(datosReporte);

      return {
        path: csv,
        headers: {
          "Content-Type": "text/csv",
          "Content-Dispositon": 'attachment; filename = "reporte.csv"',
        },
      };
    }
  };

  obtenerEstadisticas = async () => {
    return await this.reserva.estadistica();
  };

  
}
