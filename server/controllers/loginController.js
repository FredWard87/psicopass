const Psychologists = require('../models/PsychologistSchema');
const Patients = require('../models/pacienteSchema'); // Importa el modelo de pacientes
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const iniciarSesion = async (req, res) => {
  const { Correo, Contraseña } = req.body;

  try {
    // Buscar primero al usuario como psicólogo
    let usuario = await Psychologists.findOne({ Correo });
    let tipoUsuario = '';

    // Si no se encuentra como psicólogo, buscar como paciente
    if (usuario) {
      tipoUsuario = usuario.TipoUsuario; // Psicólogo o Administrador
    } else {
      usuario = await Patients.findOne({ Correo });
      tipoUsuario = usuario ? 'Paciente' : null;
    }

    // Si no se encuentra el usuario en ninguna colección
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    const esContraseñaCorrecta = await bcrypt.compare(Contraseña, usuario.Contraseña);
    if (!esContraseñaCorrecta) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Crear un token JWT con una duración de 8 horas
    const token = jwt.sign({ userId: usuario._id, tipoUsuario }, process.env.JWT_SECRET, { expiresIn: '8h' });

    // Devolver el token, tipo de usuario y algunos datos del usuario
    return res.status(200).json({
      token,
      tipo: tipoUsuario,
      usuario: {
        Correo: usuario.Correo,
        Nombre: usuario.Nombre,
        TipoUsuario: tipoUsuario
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { iniciarSesion };
