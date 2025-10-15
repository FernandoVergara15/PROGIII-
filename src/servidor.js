import app from "./reservas.js";

process.loadEnvFile();

const PORT = process.env.PUERTO;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
