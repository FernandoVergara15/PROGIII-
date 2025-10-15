import { validationResult } from "express-validator";

/* agaar los errores de las validaciones
y si hay errores responder con un json
si no hay errores llamar al next()
primero se ejecutan LOS TRY CATCH 
EN EL CONTROLADOR luego este middleware
LO SE POR LAS RESPUESTAS AL CLIENTE 

cuando borraba el validadaor if, else if
    caia  directamente en el catch 
    luego de colocar el middleware directamente 
    toma el error del catch 
    lo gestiona y responde con el json
    sin caer en el catch

*/

const validar = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

export default validar;
