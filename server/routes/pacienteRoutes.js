const express = require('express');
const router = express.Router();
const { registrarPaciente, iniciarSesionPaciente, obtenerPaciente, actualizarPaciente } = require('../controllers/pacientesController');

// Ruta para registrar un nuevo paciente
router.post('/registro', registrarPaciente);

// Ruta para iniciar sesión
router.post('/login/patient', iniciarSesionPaciente); // Asegúrate de que esta línea esté presente

// Ruta para obtener los datos de un paciente por ID
router.get('/:id', obtenerPaciente);

// Ruta para actualizar un paciente por ID
router.put('/:id', actualizarPaciente);

module.exports = router;
