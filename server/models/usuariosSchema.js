const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UsuariosSchema = new mongoose.Schema({
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
  }
});

// Hash de la contraseña antes de guardar
UsuariosSchema.pre('save', async function(next) {
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

// Métodos para verificar la contraseña
UsuariosSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.Contraseña);
};

module.exports = mongoose.model("Usuarios", UsuariosSchema);
