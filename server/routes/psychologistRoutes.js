const express = require('express');
const router = express.Router();
const Psychologist = require('../models/PsychologistSchema');

// Ruta para obtener todos los psicólogos
router.get('/psicologos/:id', async (req, res) => {
    try {
        const psicologo = await Psychologist.findById(req.params.id);
        if (!psicologo) {
            return res.status(404).json({ message: 'Psicólogo no encontrado' });
        }
        res.json([psicologo]); // Mantenemos el formato de array para no modificar el frontend
    } catch (error) {
        console.error("Error al obtener psicólogo:", error);
        res.status(500).json({ message: 'Error al obtener psicólogo', error });
    }
});

router.get('/psicologos', async (req, res) => {
    try {
        const psicologos = await Psychologist.find();
        res.json(psicologos); // Devuelve todos los psicólogos
    } catch (error) {
        console.error("Error al obtener psicólogos:", error);
        res.status(500).json({ message: 'Error al obtener psicólogos', error });
    }
});
// Ruta para actualizar datos de un psicólogo (incluidos los horarios)
router.put('/psicologos/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedPsicologo = await Psychologist.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true // Valida los campos según el esquema
        });

        if (!updatedPsicologo) {
            return res.status(404).json({ message: 'Psicólogo no encontrado' });
        }
        res.json(updatedPsicologo);
    } catch (error) {
        console.error("Error al actualizar psicólogo:", error);
        res.status(500).json({ message: 'Error al actualizar psicólogo', error });
    }
});

module.exports = router;