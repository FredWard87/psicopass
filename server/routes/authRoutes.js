const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Psychologists = require('../models/PsychologistSchema');
const Patients = require('../models/pacienteSchema');
const dotenv = require('dotenv');

dotenv.config();

// Ruta para verificar el token JWT
router.post('/verifyToken', async (req, res) => {
  const token = req.body.token;

  // Verificar si el token fue proporcionado
  if (!token) {
    return res.status(400).json({ error: 'Token no proporcionado' });
  }

  try {
    // Verifica el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Busca al usuario en la colección de psicólogos
    let usuario = await Psychologists.findById(decoded.userId);

    // Si no se encuentra en psicólogos, buscar en pacientes
    if (!usuario) {
      usuario = await Patients.findById(decoded.userId);
    }

    // Si el usuario no se encuentra en ninguna colección
    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Retorna la información del usuario
    return res.status(200).json({
      Correo: usuario.Correo,
      Nombre: usuario.Nombre,
      TipoUsuario: usuario.TipoUsuario || 'Paciente',
      ID: usuario._id
    });
  } catch (err) {
    // Manejo de errores de token
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    } else {
      console.error(err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

module.exports = router;
