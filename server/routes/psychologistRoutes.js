const express = require('express');
const router = express.Router();
const Psychologist = require('../models/PsychologistSchema');

// Ruta para obtener todos los psicólogos
router.get('/psicologos', async (req, res) => {
    try {
        const psicologos = await Psychologist.find();
        res.json(psicologos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener psicólogos' });
    }
});

// Ruta para actualizar datos de un psicólogo (incluidos los horarios)
router.put('/psicologos/:id', async (req, res) => {
    try {
        const updatedPsicologo = await Psychologist.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPsicologo);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar psicólogo' });
    }
});

module.exports = router;
