import { conexion } from "./conexion.js";

export default class Turnos {
  /**
   * 💡 CORREGIDO:
   * (Antes 'create')
   * Asume que 'turno_id' es AUTO_INCREMENT.
   * Inserta los campos estándar (activo, creado, modificado).
   */
  create = async (turno) => {
    const { orden, hora_desde, hora_hasta } = turno;

    const sql = `INSERT INTO turnos (orden, hora_desde, hora_hasta, activo, creado, modificado)
                 VALUES (?, ?, ?, 1, NOW(), NOW())`;
    
    const params = [orden, hora_desde, hora_hasta];
    
    // Usamos .execute para consultas con '?'
    const [result] = await conexion.execute(sql, params);

    if (result.affectedRows === 0) {
      return null;
    }
    // Devolvemos el objeto completo
    return this.buscarPorId(result.insertId);
  };

  /**
   * 💡 CORREGIDO:
   * (Antes 'read', renombrado a 'buscarTodos')
   */
  read = async () => {
    const sql = "SELECT * FROM turnos WHERE activo = 1";
    const [turnos] = await conexion.execute(sql);
    return turnos;
  };

  /**
   * 💡 CORREGIDO:
   * (Antes 'buscarTurnoPorId', renombrado a 'buscarPorId')
   * Añadido 'AND activo = 1' para consistencia.
   */
  buscarPorId = async (turno_id) => {
    const sql = "SELECT * FROM turnos WHERE turno_id = ? AND activo = 1";
    const [rows] = await conexion.execute(sql, [turno_id]);
    
    if (rows.length === 0) return null;
    return rows[0]; // Devuelve el objeto, no un array
  };

  /**
   * 💡 CORREGIDO:
   * (Antes 'update')
   * Se reemplazó la lógica de Object.keys por una consulta estática,
   * legible y segura. Añadido 'modificado' y 'activo'.
   */
  update = async (id, turno) => {
    const { orden, hora_desde, hora_hasta } = turno;

    const sql = `UPDATE turnos SET 
                   orden = ?, 
                   hora_desde = ?, 
                   hora_hasta = ?, 
                   modificado = NOW() 
                 WHERE turno_id = ? AND activo = 1`;
                 
    const params = [orden, hora_desde, hora_hasta, id];
    const [result] = await conexion.execute(sql, params);

    if (result.affectedRows === 0) return null;
    
    // Devuelve el objeto actualizado
    return this.buscarPorId(id);
  };

  /**
   * 💡 CORREGIDO:
   * (Antes 'delete', renombrado a 'eliminar')
   * Añadido 'modificado = NOW()'
   * Devuelve 'true' o 'null' para consistencia.
   */
  delete = async (id) => {
    const sql = `UPDATE turnos SET 
                   activo = 0, 
                   modificado = NOW() 
                 WHERE turno_id = ? AND activo = 1`;
                 
    const [result] = await conexion.execute(sql, [id]);
    
    // Devuelve 'true' si fue exitoso, 'null' si no encontró nada
    return result.affectedRows > 0 ? true : null;
  };
}