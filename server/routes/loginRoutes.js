const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const pacientesController = require('../controllers/pacientesController')

// Ruta para el inicio de sesión
router.post('/login', loginController.iniciarSesion);
router.post('/login/patient',pacientesController.iniciarSesionPaciente); // Asegúrate de que esta línea esté presente


module.exports = router;
