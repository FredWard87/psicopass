// App.js
import React, { createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './components/Login/LoginForm'
import PagInicio from './components/Homes/Inicio'
import AuthProvider from './authProvider';
import Citas from './components/Citas/citaForm'


export const UserContext = createContext(null);

function App() {
  return (
    <AuthProvider>
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route path="/home" element={<PagInicio />} /> 
          <Route path="/citass" element={<Citas />} /> 

        </Routes>
      </Router>
    </div>
    </AuthProvider>
  );
}

export default App;
