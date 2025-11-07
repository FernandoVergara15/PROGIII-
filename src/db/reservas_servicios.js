import { conexion } from "./conexion.js";

export default class ReservasServicio {
  create = async (reserva_id, servicios) => {
    try {
      /* para iniciar una transaccion 
        necesitar usar la conexion tenemos que usar
        un beginTransaction y como tenemos que esperar
        porque esta conectada a la base, como siempre 
        usamos el await */
      await conexion.beginTransaction();
      for (const servicio of servicios) {
        const sql = `INSERT INTO reservas_servicios(reserva_id,servicio_id,importe) VALUES (?,?,?);`;
        conexion.query(sql, [
          reserva_id,
          servicio.servicio_id,
          servicio.importe,
        ]);
      }
      await conexion.commit();
      return true;
    } catch (error) {
      await conexion.rollback();
      console.log(`error ${error}`);
      return false;
    }
  };

  sincronizar = async (reserva_id, servicios) => {
    // 1. Borrar todos los servicios anteriores de esta reserva
    const sqlDelete = "DELETE FROM reservas_servicios WHERE reserva_id = ?";
    await conexion.execute(sqlDelete, [reserva_id]);

    // 2. Volver a insertar los servicios nuevos
    //    Reutilizamos la lógica del método 'create'
    return this.create(reserva_id, servicios);
  };
}
