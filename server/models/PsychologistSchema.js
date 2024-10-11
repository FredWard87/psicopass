const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const HorariosSchema = new mongoose.Schema({
  Lunes: { type: [String], default: [] },
  Martes: { type: [String], default: [] },
  Miércoles: { type: [String], default: [] },
  Jueves: { type: [String], default: [] },
  Viernes: { type: [String], default: [] },
  Sábado: { type: [String], default: [] },
  Domingo: { type: [String], default: [] }
});

const PsychologistSchema = new mongoose.Schema({
  Nombre: { type: String, required: true },
  Correo: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Por favor ingrese un correo válido"],
  },
  Contraseña: { type: String, required: true },
  Puesto: {
    type: String,
    required: function() {
      return this.TipoUsuario === 'auditor';
    }
  },
  TipoUsuario: { type: String },
  Telefono: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Por favor ingrese un número de teléfono válido de 10 dígitos"],
  },
  Horarios: { type: HorariosSchema, default: () => ({}) }
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
