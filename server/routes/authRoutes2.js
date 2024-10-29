const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Patients = require('../models/pacienteSchema');
const dotenv = require('dotenv');

dotenv.config();

router.post('/verifyToken2', async (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario =  await Patients.findById(decoded.id);

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json({
      Correo: usuario.Correo,
      Nombre: usuario.Nombre,
      TipoUsuario: usuario.TipoUsuario || 'Paciente',
      ID: usuario._id
    });
  } catch (err) {
    const errorMessage = err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido';
    return res.status(401).json({ error: errorMessage });
  }
});

module.exports = router;
