// Importa el modelo correcto para psicólogos
const Psychologists = require('../models/PsychologistSchema'); // Asegúrate de que la ruta sea correcta
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const iniciarSesion = async (req, res) => {
  const { Correo, Contraseña } = req.body; // Obtén correo y contraseña del body

  try {
    // Buscar al psicólogo por correo en la base de datos
    const psicologo = await Psychologists.findOne({ Correo });

    // Si no se encuentra el psicólogo, retorna un error
    if (!psicologo) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar si la contraseña es correcta comparando la que se recibe con la almacenada
    const esContraseñaCorrecta = await bcrypt.compare(Contraseña, psicologo.Contraseña);
    if (!esContraseñaCorrecta) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Obtener el tipo de usuario
    let tipoUsuario = '';
    switch (psicologo.TipoUsuario) {
      case 'Administrador':
        tipoUsuario = 'Administrador';
        break;
      case 'Psicologo':
        tipoUsuario = 'Psicologo';
        break;
      case 'Paciente':
        tipoUsuario = 'Paciente';
        break;
      default:
        tipoUsuario = 'Desconocido';
        break;
    }

    // Crear un token JWT con una duración de 8 horas
    const token = jwt.sign({ userId: psicologo._id }, process.env.JWT_SECRET, { expiresIn: '8h' });

    // Devolver el token, tipo de usuario y algunos datos del usuario
    return res.status(200).json({ token, tipo: tipoUsuario, usuario: { Correo: psicologo.Correo, Nombre: psicologo.Nombre, TipoUsuario: tipoUsuario } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { iniciarSesion };
