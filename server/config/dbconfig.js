const mongoose = require("mongoose");
const Usuarios = require('../models/usuariosSchema');

const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connection.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
mongoose.connection.on('connected', async () => {
  console.log('Conexión exitosa a MongoDB');

  try {
    // Busca un usuario root
    const user = await Usuarios.findOne({ Correo: 'fredyesparza08@gmail.com' });
    if (!user) {
      // Si no existe un usuario root, crea uno
      const rootUser = new Usuarios({
        Nombre: 'root',
        Correo: 'fredyesparza08@gmail.com',
        Contraseña: 'root321', // Asegúrate de encriptar esta contraseña en un entorno de producción
        Puesto: 'Global',
        Telefono: 4681297562,
        TipoUsuario: 'Administrador'
        // Agrega aquí cualquier otro campo que necesites
      });

      await rootUser.save();
      console.log("Usuario root creado");
    } else {
      console.log("Usuario root ya existe");
    }
  } catch (err) {
    console.error("Error al crear el usuario root:", err);
  }
});

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(err => console.error('Error al conectar a MongoDB:', err));

module.exports = mongoose;
