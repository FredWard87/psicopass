const mongoose = require("mongoose");
const Psychologist = require("../models/PsychologistSchema");
const Patient = require("../models/pacienteSchema"); // Importa el modelo de paciente

const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connection.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
mongoose.connection.on('connected', async () => {
  console.log('Conexión exitosa a MongoDB');

  try {
    // Verifica si el usuario root existe
    const user = await Psychologist.findOne({ Correo: 'fredyesparza08@gmail.com' });
    if (!user) {
      // Crea el usuario root si no existe
      const rootUser = new Psychologist({
        Nombre: 'root',
        Correo: 'fredyesparza08@gmail.com',
        Contraseña: 'root321', 
        Puesto: 'Global',
        Telefono: 4681297562,
        TipoUsuario: 'Administrador'
      });

      await rootUser.save();
      console.log("Usuario root creado");
    } else {
      console.log("Usuario root ya existe");
    }

    // Crea 20 pacientes
    for (let i = 1; i <= 20; i++) {
      const patientEmail = `paciente${i}@gmail.com`;
      const existingPatient = await Patient.findOne({ Correo: patientEmail });
      
      if (!existingPatient) {
        const patient = new Patient({
          Nombre: `Paciente ${i}`,
          Correo: patientEmail,
          Contraseña: `paciente${i}123`,
          FechaNacimiento: `199${Math.floor(i / 10)}-0${i % 10 + 1}-01`,
          TipoUsuario: 'Paciente'
        });

        await patient.save();
        console.log(`Paciente ${i} creado`);
      } else {
        console.log(`Paciente ${i} ya existe`);
      }
    }

    // Crea 20 psicólogos
    for (let i = 1; i <= 20; i++) {
      const psychologistEmail = `psicologo${i}@gmail.com`;
      const existingPsychologist = await Psychologist.findOne({ Correo: psychologistEmail });

      if (!existingPsychologist) {
        const psychologist = new Psychologist({
          Nombre: `Psicólogo ${i}`,
          Correo: psychologistEmail,
          Contraseña: `psicologo${i}123`,
          Puesto: 'Psicólogo',
          Telefono: 5551234567 + i,
          TipoUsuario: 'Psicólogo'
        });

        await psychologist.save();
        console.log(`Psicólogo ${i} creado`);
      } else {
        console.log(`Psicólogo ${i} ya existe`);
      }
    }

  } catch (err) {
    console.error("Error al crear los usuarios:", err);
  }
});

// Conexión a MongoDB sin opciones obsoletas
mongoose.connect(MONGODB_URL)
  .catch(err => console.error('Error al conectar a MongoDB:', err));

module.exports = mongoose;
