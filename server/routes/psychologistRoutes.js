const express = require('express');
const router = express.Router();
const Psychologist = require('../models/PsychologistSchema'); // Asegúrate de que esta ruta sea correcta
const { getPsychologistData, updatePsychologistData } = require('../controllers/psychologistController'); // Importa tus controladores

// Ruta para obtener todos los psicólogos
router.get('/psicologos', async (req, res) => {
    try {
        const psicologos = await Psychologist.find(); // Asegúrate de usar el modelo correcto
        res.json(psicologos); // Devuelve los datos como JSON
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener psicólogos' });
    }
});

// Ruta para actualizar datos de un psicólogo
router.put('/psicologos/:id', updatePsychologistData);

module.exports = router;
