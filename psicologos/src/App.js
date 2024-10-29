// App.js
import React, { createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './components/Login/LoginForm'
import PagInicio from './components/Homes/Inicio'
import Citas from './components/GestionCitas/citas'; 
import AuthProvider from './authProvider';
import Datos from './components/GestionDatos/datos'
import Expedientes from './components/GestionExpedientes/expedientes'

export const UserContext = createContext(null);

function App() {
  return (
    <AuthProvider>
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route path="/home" element={<PagInicio />} /> 
          <Route path="/Gestióncitas" element={<Citas />} /> 
          <Route path="/Datosgenerales" element={<Datos />} /> 
          <Route path="/expedi" element={<Expedientes />} />
        </Routes>
      </Router>
    </div>
    </AuthProvider>
  );
}

export default App;
