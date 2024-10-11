import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/PsychologistData.css';
import Navigation from "../Navigation/Navbar";

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const PsychologistData = () => {
  const [psicologos, setPsychologists] = useState({});
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]); // Día seleccionado (Lunes por defecto)
  const [newTime, setNewTime] = useState('');
  const [message, setMessage] = useState('');
  const [openDay, setOpenDay] = useState(null); // Día abierto para mostrar horarios

  // Fetch psychologist data
  const fetchPsychologistData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/psicologos`);
      if (response.data && response.data.length > 0) {
        setPsychologists(response.data[0]); // Establece el primer psicólogo
      } else {
        setPsychologists({});
      }
    } catch (error) {
      console.error('Error fetching psychologist data:', error);
    }
  };

  useEffect(() => {
    fetchPsychologistData();
  }, []);

  // Handle time change
  const handleTimeChange = (e) => {
    setNewTime(e.target.value);
  };

  // Handle day selection
  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  // Submit new time
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTime && psicologos._id) {
      const updatedPsicologos = {
        ...psicologos,
        Horarios: {
          ...psicologos.Horarios,
          [selectedDay]: [...(psicologos.Horarios?.[selectedDay] || []), newTime], // Añadir el nuevo horario al día seleccionado
        }
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

  // Toggle open day
  const toggleOpenDay = (day) => {
    setOpenDay(prevOpenDay => (prevOpenDay === day ? null : day));
  };

  return (
    <>
      <Navigation />
      <div className="psychologist-data">
        <h2>Datos del Psicólogo</h2>
        <div className="psychologist-info">
          <p><strong>Nombre:</strong> {psicologos.Nombre || 'N/A'}</p>
          <p><strong>Email:</strong> {psicologos.Correo || 'N/A'}</p>
          <p><strong>Número Teléfono:</strong> {psicologos.Telefono || 'N/A'}</p>
        </div>

        <div className="days-container">
          {daysOfWeek.map((day) => (
            <div className="day-card" key={day}>
              <div className="day-header" onClick={() => toggleOpenDay(day)}>
                <h4>{day}</h4>
              </div>
              {openDay === day && (
                <div className="day-horarios">
                  <ul>
                    {Array.isArray(psicologos.Horarios?.[day]) && psicologos.Horarios[day].length > 0 ? (
                      psicologos.Horarios[day].map((time, index) => (
                        <li key={index} className="fade-in">{time}</li>
                      ))
                    ) : (
                      <li>No hay horarios disponibles para {day}.</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="time-form">
          <label htmlFor="day">Seleccionar Día:</label>
          <select id="day" value={selectedDay} onChange={handleDayChange}>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          <label htmlFor="time">Seleccionar Hora:</label>
          <input
            type="time"
            id="time"
            value={newTime}
            onChange={handleTimeChange}
            required
            className="time-input"
          />
          
          <button type="submit" className="submit-button">Añadir Horario</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </>
  );
};

export default PsychologistData;
