import SalonesServicio from "../servicios/salonesServicio.js";

export default class SalonesControlador {
  constructor() {
    this.salonesServicio = new SalonesServicio();
  }
  create = async (req, res) => {
    try {
      // desestructuración
      const { titulo, direccion, capacidad, importe } = req.body;

      const id = await this.salonesServicio.create({
        titulo,
        direccion,
        capacidad,
        importe,
      });
      res
        .status(201)
        .json({ estado: true, mensaje: `Salón creado con ID: ${id}` });
    } catch (error) {
      console.log("error en POST /salones", error);
      res.status(500).json({ estado: false, mensaje: "Error en el servidor" });
    }
  };

  read = async (req, res) => {
    try {
      const { pagina = 1, limite = 8 } = req.query;
      const salones = await this.salonesServicio.read();

      const salonesPaginados = salones
        .filter((s) => s.activo)
        .slice((pagina - 1) * limite, pagina * limite);

      res.json({ estado: true, mensaje: salonesPaginados });
    } catch (error) {
      console.error("Error en GET /salones:", error);
      res.status(500).json({ estado: false, mensaje: "Error en el servidor" });
    }
  };

  buscarPorId = async (req, res) => {
    try {
      const id = req.params.id;
      const salon = await this.salonesServicio.buscarPorId(id);
      if (!salon) {
        return res.status(404).json({
          estado: false,
          mensaje: "ese ID no existe en la base de datos",
        });
      } else if (salon.activo === 0) {
        return res
          .status(404)
          .json({ estado: false, mensaje: "Salón inactivo" });
      }

      res.json({ estado: true, mensaje: salon });
    } catch (error) {
      console.error("Error en GET /salones/:id:", error);
      res.status(500).json({ estado: false, mensaje: "Error en el servidor" });
    }
  };

  update = async (req, res) => {
    try {
      const id = req.params.id;
      const { titulo, direccion, capacidad, importe } = req.body;
      const salon = { titulo, direccion, capacidad, importe };
      const filasAfectadas = await this.salonesServicio.update(id, salon);
      if (filasAfectadas === null) {
        return res.status(400).json({
          estado: false,
          mensaje: "debes ingresar un ID valido a modificar",
        });
      }

      res.json({ estado: true, mensaje: "Salón actualizado correctamente" });
    } catch (error) {
      console.error("Error en PUT /salones/:id:", error);
      res.status(500).json({ estado: false, mensaje: "Error en el servidor" });
    }
  };

  delete = async (req, res) => {
    try {
      const id = req.params.id;
      const salon = { activo: 0 };
      // inicializo el id en 0 para que no falle
      const filasAfectadas = await this.salonesServicio.delete(id, salon);
      if (!filasAfectadas) {
        // si es diferente a 0 o es decir mayor de los id creados
        // no existe el id
        return res.status(404).json({
          estado: false,
          mensaje: "ingrese un ID válido para eliminarlo",
        });
      }
      res.json({ estado: true, mensaje: "Salón eliminado correctamente" });
    } catch (error) {
      console.error("Error en DELETE /salones/:id:", error);
      res.status(500).json({ estado: false, mensaje: "Error en el servidor" });
    }
  };
}
