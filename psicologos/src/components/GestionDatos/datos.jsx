import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/PsychologistData.css';
import Navigation from "../Navigation/Navbar";


const PsychologistData = () => {
  const [psicologos, setPsychologists] = useState({}); // Inicializar como objeto vacío
  const [newTime, setNewTime] = useState('');
  const [message, setMessage] = useState('');

  // Fetch psychologist data
  const fetchPsychologistData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/psicologos`);
      if (response.data && response.data.length > 0) {
        setPsychologists(response.data[0]); // Establece el primer psicólogo
      } else {
        setPsychologists({}); // Si no hay datos, establece un objeto vacío
      }
    } catch (error) {
      console.error('Error fetching psychologist data:', error);
    }
  };

  useEffect(() => {
    fetchPsychologistData();
  }, []);

  // Handle new time input
  const handleTimeChange = (e) => {
    setNewTime(e.target.value);
  };

  // Submit new time
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTime && psicologos._id) { // Asegúrate de que el psicólogo tenga un ID
      const updatedPsicologos = {
        ...psicologos,
        availableTimes: [...(psicologos.availableTimes || []), newTime], // Asegúrate de inicializar como array vacío
      };

      try {
        const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/psicologos/${psicologos._id}`, updatedPsicologos);
        setPsychologists(response.data); // Establecer el psicólogo actualizado
        setNewTime('');
        setMessage('Horario añadido correctamente.');
      } catch (error) {
        console.error('Error updating psychologist data:', error);
        setMessage('Error al añadir horario.');
      }
    }
  };

  return (
    
    <div className="psychologist-data">
         <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <Navigation />
      </div>
      <h2>Datos del Psicólogo</h2>
      <p><strong>Nombre:</strong> {psicologos.Nombre || 'N/A'}</p>
      <p><strong>Email:</strong> {psicologos.Correo || 'N/A'}</p>
      <p><strong>Número Telefonico:</strong> {psicologos.Telefono || 'N/A'}</p>

      <h3>Horarios Disponibles</h3>
      <ul>
        {Array.isArray(psicologos.availableTimes) && psicologos.availableTimes.length > 0 ? (
          psicologos.availableTimes.map((time, index) => (
            <li key={index} className="fade-in">{time}</li>
          ))
        ) : (
          <li>No hay horarios disponibles.</li>
        )}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Añadir nuevo horario"
          value={newTime}
          onChange={handleTimeChange}
          required
        />
        <button type="submit">Añadir Horario</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default PsychologistData;
