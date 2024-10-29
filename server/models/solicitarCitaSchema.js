// Cita.js
const mongoose = require("mongoose");

// Esquema para el historial de citas
const CitaSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true
  },
  hora: {
    type: String,
    required: true,
    match: [/^[0-9]{2}:[0-9]{2}$/, "El horario debe estar en formato HH:MM"]
  },
  psicologo: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Psicologos',
      required: true
    },
    Nombre: {
      type: String,
      required: true
    },
    Telefono: {
      type: String,
      required: true
    }
  },
  motivo: {
    type: String,
    required: true
  }
});

// Exportar el modelo de Cita
module.exports = mongoose.model("Citas", CitaSchema);
