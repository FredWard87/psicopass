const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PatientSchema = new mongoose.Schema({
  TipoUsuario: {
    type: String,
    default: 'Paciente',
    enum: ['Paciente'],
    required: true
  },
  Nombre: {
    type: String,
    required: true,
    trim: true
  },
  Correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  Contraseña: {
    type: String,
    required: true
  },
  Direccion: {
    type: String,
    trim: true,
    default: null
  },
  FechaNacimiento: {
    type: Date,
    required: true
  },
  Edad: {
    type: Number,
    default: function() {
      if (this.FechaNacimiento) {
        const edadDif = Date.now() - this.FechaNacimiento.getTime();
        const edadFecha = new Date(edadDif);
        return Math.abs(edadFecha.getUTCFullYear() - 1970);
      }
      return null;
    }
  },
  Foto: {
    type: String, // Guarda la URL de la foto o base64 si quieres almacenarla en texto
    default: null
  }
});

// Hash de la contraseña antes de guardar
PatientSchema.pre('save', async function(next) {
  if (this.isModified('Contraseña')) {
    this.Contraseña = await bcrypt.hash(this.Contraseña, 10);
  }
  next();
});

// Permitir modificación de la edad en función de la fecha de nacimiento
PatientSchema.methods.actualizarEdad = function() {
  if (this.FechaNacimiento) {
    const edadDif = Date.now() - this.FechaNacimiento.getTime();
    const edadFecha = new Date(edadDif);
    this.Edad = Math.abs(edadFecha.getUTCFullYear() - 1970);
  }
};

module.exports = mongoose.model('Patient', PatientSchema);
