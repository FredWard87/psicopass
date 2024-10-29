const Cita = require('../models/solicitarCitaSchema'); // Asegúrate de importar el modelo de Cita
const Psicologo = require('../models/PsychologistSchema'); // Importar el modelo de Psicólogo

// Controlador para solicitar una cita


exports.solicitarCita = async (req, res) => {
    const { fecha, hora, motivo, pacienteId } = req.body;
    const psicologoId = req.body.psicologoId;
  
    try {
      // Obtener la información completa del psicólogo
      const psicologo = await Psicologo.findById(psicologoId);
      if (!psicologo) {
        return res.status(404).json({ message: 'Psicólogo no encontrado' });
      }
  
      // Crear nueva cita con la información completa del psicólogo
      const nuevaCita = new Cita({
        fecha,
        hora,
        psicologo: {
          _id: psicologo._id,
          Nombre: psicologo.Nombre,
          Telefono: psicologo.Telefono
          // Agrega aquí otras propiedades relevantes del psicólogo
        },
        motivo,
        pacienteId,
        estado: 'confirmada'
      });
  
      await nuevaCita.save();
      res.status(201).json({ message: 'Cita solicitada con éxito', cita: nuevaCita });
    } catch (error) {
      console.error('Error al solicitar cita:', error);
      res.status(500).json({ message: 'Error al solicitar la cita', error });
    }
  };
// Controlador para obtener las citas de un paciente
exports.obtenerCitasPorPaciente = async (req, res) => {
  const { pacienteId } = req.params;

  try {
    const citas = await Cita.find({ pacienteId }).populate('psicologoId');
    res.status(200).json(citas);
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ message: 'Error al obtener las citas', error });
  }
};

// Controlador para posponer una cita
exports.posponerCita = async (req, res) => {
  const { motivo } = req.body;
  const { id } = req.params;

  try {
    const cita = await Cita.findById(id);
    if (!cita) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    cita.estado = 'pospuesta';
    cita.motivo = motivo || cita.motivo; // Actualiza el motivo si se proporciona
    await cita.save();

    res.status(200).json({ message: 'Cita pospuesta con éxito', cita });
  } catch (error) {
    console.error('Error al posponer cita:', error);
    res.status(500).json({ message: 'Error al posponer la cita', error });
  }
};

// Controlador para cancelar una cita
exports.cancelarCita = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await Cita.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Cita no encontrada' });
      }
  
      res.status(200).json({ message: 'Cita cancelada con éxito' });
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      res.status(500).json({ message: 'Error al cancelar la cita', error });
    }
  };
