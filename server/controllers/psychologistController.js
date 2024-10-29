// controllers/psychologistController.js
const Psychologist = require('../models/PsychologistSchema');

// Obtener datos del psicólogo
const getPsychologistData = async (req, res) => {
  try {
    const psychologist = await Psychologist.findOne(); // Ajusta la consulta según tus necesidades
    if (!psychologist) {
      return res.status(404).json({ message: 'Psychologist not found' });
    }
    res.status(200).json(psychologist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching psychologist data', error });
  }
};

// Actualizar datos del psicólogo
const updatePsychologistData = async (req, res) => {
  const { id } = req.params; // Asegúrate de que estás recibiendo el ID correctamente
  const updatedData = req.body;

  try {
    // Lógica para actualizar los datos en la base de datos
    const updatedPsychologist = await Psychologist.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedPsychologist) {
      return res.status(404).json({ message: 'Psychologist not found' });
    }
    res.status(200).json(updatedPsychologist); // Envía los datos actualizados como respuesta
  } catch (error) {
    res.status(500).json({ message: 'Error updating psychologist data', error });
  }
};

module.exports = {
  getPsychologistData,
  updatePsychologistData,
};