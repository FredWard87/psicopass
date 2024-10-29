// controllers/pacientesController.js
const Patient = require('../models/pacienteSchema');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require('multer'); // Importar multer para manejar archivos

// Configurar multer para almacenar la foto de manera adecuada
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Asegúrate de que esta carpeta exista
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Nombre único para el archivo
  }
});
const upload = multer({ storage });

// Controlador para registrar paciente
const registrarPaciente = async (req, res) => {
  const { Nombre, Correo, Contraseña, Direccion, FechaNacimiento } = req.body;
  const Foto = req.file ? req.file.path : null; // Obtener la ruta de la foto si se carga

  try {
    const pacienteExistente = await Patient.findOne({ Correo });
    if (pacienteExistente) {
      return res.status(400).json({ error: 'El correo ya está en uso' });
    }

    const nuevoPaciente = new Patient({
      Nombre,
      Correo,
      Contraseña: await bcrypt.hash(Contraseña, 10), // Hashea la contraseña antes de guardarla
      Direccion,
      FechaNacimiento,
      Foto
    });

    await nuevoPaciente.save();
    res.status(201).json({ mensaje: 'Paciente registrado exitosamente', paciente: nuevoPaciente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el paciente' });
  }
};

// Controlador para iniciar sesión
const iniciarSesionPaciente = async (req, res) => {
  const { Correo, Contraseña } = req.body;

  try {
    const paciente = await Patient.findOne({ Correo });
    
    // Verificar si el paciente existe
    if (!paciente) {
      return res.status(404).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(Contraseña, paciente.Contraseña);
    if (!isMatch) {
      return res.status(400).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Generar un token
    const token = jwt.sign({ id: paciente._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, usuario: paciente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener perfil del paciente por ID
const obtenerPaciente = async (req, res) => {
  try {
    const paciente = await Patient.findById(req.params.id);
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    res.status(200).json(paciente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el paciente' });
  }
};

// Actualizar datos del paciente
const actualizarPaciente = async (req, res) => {
  const { Nombre, Direccion, FechaNacimiento } = req.body;
  const Foto = req.file ? req.file.path : null; // Obtener la ruta de la foto si se carga

  try {
    const paciente = await Patient.findById(req.params.id);
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    if (Nombre) paciente.Nombre = Nombre;
    if (Direccion) paciente.Direccion = Direccion;
    if (FechaNacimiento) {
      paciente.FechaNacimiento = FechaNacimiento;
      paciente.actualizarEdad(); // Recalcular la edad si se modifica la fecha de nacimiento
    }
    if (Foto) paciente.Foto = Foto;

    await paciente.save();
    res.status(200).json({ mensaje: 'Paciente actualizado exitosamente', paciente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el paciente' });
  }
};

module.exports = { registrarPaciente, iniciarSesionPaciente, obtenerPaciente, actualizarPaciente, upload }; // Asegúrate de exportar el upload también
