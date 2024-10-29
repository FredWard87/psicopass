const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const loginRoutes = require('./routes/loginRoutes');
const authRoutes = require('./routes/authRoutes');
const psychologistRoutes = require('./routes/psychologistRoutes');
const pacientroutes=require('./routes/pacienteRoutes')
const authRoutes2 = require('./routes/authRoutes2');
const citasRoutes = require('./routes/solicitarCitaRoutes');




dotenv.config();

const app = express();

// Configuración del body parser
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const mongo = require('../server/config/dbconfig'); 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configura las rutas
app.use('/', loginRoutes);
app.use('/auth', authRoutes);
app.use('/api', psychologistRoutes); 
app.use('/',pacientroutes)
app.use('/auth2', authRoutes2);
app.use('/api/citas', citasRoutes);




// Manejar la ruta raíz
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Psicologia');
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

module.exports = app;
