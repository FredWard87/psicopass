const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuarios = require('../models/PsychologistSchema');
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

    // Busca al usuario en la base de datos usando el ID del token decodificado
    const usuario = await Usuarios.findById(decoded.userId);

    // Si el usuario no es encontrado
    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Retorna la información del usuario
    return res.status(200).json({
      Correo: usuario.Correo,
      Nombre: usuario.Nombre,
      TipoUsuario: usuario.TipoUsuario,
      ID: usuario._id // Asegúrate de usar "_id" si estás usando MongoDB
    });
  } catch (err) {
    // Verificar si el error es por un token inválido
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    } else {
      // Otros errores no relacionados con el token
      console.error(err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

module.exports = router;
