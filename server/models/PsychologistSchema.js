const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Esquema para Horarios con validaciones
const WeeklyScheduleSchema = new mongoose.Schema({
  semanaInicio: {
    type: Date,
    required: true
  },
  semanaFin: {
    type: Date,
  },
  horaInicio: {
    type: String,
    required: true,
    match: [/^[0-9]{2}:[0-9]{2}$/, "El horario debe estar en formato HH:MM"]
  },
  horaFin: {
    type: String,
    required: true,
    match: [/^[0-9]{2}:[0-9]{2}$/, "El horario debe estar en formato HH:MM"]
  }
});

// Esquema para la experiencia laboral
const ExperienciaLaboralSchema = new mongoose.Schema({
  años: { type: Number, required: true },
  áreasDeEspecialización: { type: [String], required: true },
  tiposDeTerapia: { type: [String], required: true }
});

// Esquema principal para Psicólogos
const PsychologistSchema = new mongoose.Schema({
  Nombre: { type: String, required: true },
  Correo: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Por favor ingrese un correo válido"]
  },
  Contraseña: { type: String, required: true },
  Puesto: {
    type: String,
    required: function() {
      return this.TipoUsuario === 'auditor';
    }
  },
  TipoUsuario: { type: String, required: true },
  Telefono: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Por favor ingrese un número de teléfono válido de 10 dígitos"]
  },
  Horario: { type: [WeeklyScheduleSchema], default: [] },
  Filosofía: { type: String, required: false }, // Nuevo campo
  DescripciónDeTratamiento: { type: String, required: false }, // Nuevo campo
  ExperienciaLaboral: { type: [ExperienciaLaboralSchema], default: [] }, // Nuevo campo de experiencia laboral
}, {
  timestamps: true // Marca las fechas de creación y actualización
});

// Hash de la contraseña antes de guardar
PsychologistSchema.pre('save', async function(next) {
  if (this.isModified('Contraseña')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.Contraseña = await bcrypt.hash(this.Contraseña, salt);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Método para verificar la contraseña
PsychologistSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.Contraseña);
};

module.exports = mongoose.model("Psicologos", PsychologistSchema);
