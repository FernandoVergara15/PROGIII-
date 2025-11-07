import { conexion } from "./conexion.js";

export default class Reservas {
  read = async (filtro = {}) => {
    let sql = `
        SELECT 
            reserva_id,
            DATE_FORMAT(fecha_reserva, '%Y-%m-%d') AS fecha_reserva,
            salon_id,
            usuario_id,
            turno_id,
            foto_cumpleaniero,
            tematica,
            importe_salon,
            importe_total,
            activo,
            creado,
            modificado
        FROM reservas 
        WHERE activo = 1
    `;

    const params = [];

    if (filtro.usuario_id) {
      sql += " AND usuario_id = ?";
      params.push(filtro.usuario_id);
    }

    const [reservas] = await conexion.execute(sql, params);
    return reservas;
  };

  buscarPorId = async (id) => {
    const sql = `
        SELECT 
            reserva_id,
            DATE_FORMAT(fecha_reserva, '%Y-%m-%d') AS fecha_reserva,
            salon_id,
            usuario_id,
            turno_id,
            foto_cumpleaniero,
            tematica,
            importe_salon,
            importe_total,
            activo,
            creado,
            modificado
        FROM reservas 
        WHERE reserva_id = ? AND activo = 1
    `;

    const [rows] = await conexion.execute(sql, [id]);
    return rows[0];
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
    } = reserva;

    const sql = `INSERT INTO reservas 
                 (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total, creado, modificado) 
                 VALUES (?,?,?,?,?,?,?,?, NOW(), NOW())`;

    const [result] = await conexion.execute(sql, [
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
      importe_total,
    ]);

    if (result.affectedRows === 0) {
      return null;
    }

    return this.buscarPorId(result.insertId);
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
    } = reserva;

    const sql = `UPDATE reservas SET 
                  fecha_reserva = ?, 
                  salon_id = ?, 
                  usuario_id = ?, 
                  turno_id = ?, 
                  foto_cumpleaniero = ?, 
                  tematica = ?, 
                  importe_salon = ?, 
                  importe_total = ?,
                  modificado = NOW()
                WHERE reserva_id = ? AND activo = 1`;

    const params = [
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
      importe_total,
      reserva_id,
    ];

    const [result] = await conexion.execute(sql, params);

    if (result.affectedRows === 0) {
      return null;
    }

    return this.buscarPorId(reserva_id);
  };

  delete = async (reserva_id) => {
    const sql = `UPDATE reservas SET 
                   activo = 0, 
                   modificado = NOW() 
                 WHERE reserva_id = ? AND activo = 1`;

    const params = [reserva_id];
    const [result] = await conexion.execute(sql, params);

    if (result.affectedRows === 0) {
      return null;
    }

    return true;
  };

  datosParaNotificacion = async (reserva_id) => {
    const sql = `CALL obtenerDatosNotificacion(?)`;
    const [rows] = await conexion.execute(sql, [reserva_id]);
    const datos = rows[0];

    if (datos.length === 0) {
      return null;
    }
    return datos[0];
  };

  buscarEmailsAdmins = async () => {
    const sql = `
      SELECT nombre_usuario 
      FROM usuarios 
      WHERE tipo_usuario = 1 AND activo = 1
    `;
    
    const [rows] = await conexion.execute(sql);
    
    return rows.map(admin => admin.nombre_usuario);
  };

  buscarDatosReporteCsv = async () => {
    const sql = `CALL reporte_csv()`;
    const [result] = await conexion.query(sql);
    return result[0];
  };

  estadistica = async () => {
    const sql = `CALL estadistica_salones_por_cliente()`;
    const [rows] = await conexion.execute(sql);
    return rows[0];
  };
}
