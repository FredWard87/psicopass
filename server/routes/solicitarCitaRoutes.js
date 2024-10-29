const express = require('express');
const router = express.Router();
const {
  solicitarCita,
  obtenerCitasPorPaciente,
  posponerCita,
  cancelarCita
} = require('../controllers/solicitarCita');

// Ruta para solicitar una cita
router.post('/solicitar', solicitarCita);

// Ruta para obtener las citas de un paciente
router.get('/:pacienteId/citas', obtenerCitasPorPaciente);

// Ruta para posponer una cita
router.put('/posponer/:id', posponerCita);

// Ruta para cancelar una cita
router.delete('/cancelar/:id', cancelarCita);

module.exports = router;