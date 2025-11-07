import app from "./reservas.js";
import setupSwagger from "./config/swagger.js";

//  Configurar Swagger
//  (debe ir antes de iniciar el servidor)
setupSwagger(app);

process.loadEnvFile();

const PORT = process.env.PUERTO;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
