import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './css/PsychologistData.css';
import Navigation from "../Navigation/Navbar";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { jwtDecode } from 'jwt-decode';

const PsychologistData = () => {
  const [psicologos, setPsychologists] = useState({});
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [newTimeRange, setNewTimeRange] = useState({ 
    horaInicio: '', 
    horaFin: '',
    semanaInicio: null,
    semanaFin: null
  });
  const [loading, setLoading] = useState(false);
  const [newPsychologistData, setNewPsychologistData] = useState({
    Nombre: '',
    Correo: '',
    Telefono: '',
    Filosofía: '',
    Horario: [],
    DescripciónDeTratamiento: ''
  });

  const [showForm, setShowForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [selectedScheduleToDelete, setSelectedScheduleToDelete] = useState(null);

  const fetchPsychologistData = useCallback(async () => {
    console.log("Fetching psychologist data...");
    try {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/psicologos/${decoded.userId}`);
        console.log("Psychologist data fetched:", response.data);
        if (Array.isArray(response.data) && response.data.length > 0) {
            const psychologistData = response.data[0];
            // Asegurar que Horario tenga la estructura correcta
            const formattedHorario = psychologistData.Horario.map(schedule => ({
                ...schedule,
                semanaInicio: new Date(schedule.semanaInicio),
                semanaFin: new Date(schedule.semanaFin)
            }));
            
            setPsychologists({
                ...psychologistData,
                Horario: formattedHorario
            });
            
            setNewPsychologistData({
                Nombre: psychologistData.Nombre || '',
                Correo: psychologistData.Correo || '',
                Telefono: psychologistData.Telefono || '',
                Filosofía: psychologistData.Filosofía || '',
                Horario: formattedHorario,
                DescripciónDeTratamiento: psychologistData.DescripciónDeTratamiento || ''
            });
            loadWeekSchedule(new Date());
        } else {
            setPsychologists({});
        }
    } catch (error) {
        console.error('Error fetching psychologist data:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar los datos del psicólogo'
        });
    }
}, []);

  useEffect(() => {
    fetchPsychologistData();
  }, [fetchPsychologistData]);

  const handleTimeChange = (e) => {
    console.log("Time change:", e.target.name, e.target.value);
    setNewTimeRange({ ...newTimeRange, [e.target.name]: e.target.value });
  };

  const handlePsychologistDataSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting psychologist data:", newPsychologistData);
    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/psicologos/${psicologos._id}`, 
        newPsychologistData
      );
      console.log("Psychologist data updated:", response.data);
      setPsychologists(response.data);
      Swal.fire({
        icon: 'success',
        title: 'Datos actualizados',
        text: 'Los datos del psicólogo han sido actualizados correctamente.',
      });
      setShowForm(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error inesperado al actualizar los datos.';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMsg,
      });
      console.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePsychologistDataChange = (e) => {
    console.log("Psychologist data change:", e.target.name, e.target.value);
    setNewPsychologistData({ ...newPsychologistData, [e.target.name]: e.target.value });
  };

  const handleWeekChange = (date) => {
    setSelectedWeek(date);
    loadWeekSchedule(date);
  };

  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 es domingo, 1 es lunes, etc.
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajuste para el inicio de la semana
    const startOfWeek = new Date(d.setDate(diff)); // Crear la fecha de inicio de la semana
    startOfWeek.setHours(0, 0, 0, 0); // Establecer a medianoche
    return startOfWeek;
};


const getWeekEnd = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() + (6 - day); // Ajusta para obtener el sábado de esa semana
  const endOfWeek = new Date(d.setDate(diff));
  endOfWeek.setHours(23, 59, 59, 999); // Establecer a un milisegundo antes de medianoche
  return endOfWeek;
};

  const loadWeekSchedule = (date) => {
    const weekStart = getWeekStart(date);
    const weekEnd = getWeekEnd(weekStart);
    const weekSchedule = psicologos.Horario?.find(schedule => 
      new Date(schedule.semanaInicio).toDateString() === weekStart.toDateString()
    );
    if (weekSchedule) {
      setNewTimeRange({
        horaInicio: weekSchedule.horaInicio,
        horaFin: weekSchedule.horaFin,
        semanaInicio: weekStart,
        semanaFin: weekEnd
      });
    } else {
      setNewTimeRange({ 
        horaInicio: '', 
        horaFin: '',
        semanaInicio: weekStart,
        semanaFin: weekEnd
      });
    }
  };

  const handleWeeklyScheduleSubmit = async (e) => {
    e.preventDefault();
    const weekStart = getWeekStart(selectedWeek);
    const weekEnd = getWeekEnd(selectedWeek); // Asegúrate de tener esta línea
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Establecer a medianoche para comparaciones

    // Permitir la semana actual, bloquear semanas anteriores
   
    if (weekStart > today) {
        const confirmation = await Swal.fire({
            title: 'Confirmación',
            text: `Estás asignando un horario a una fecha futura. La semana va del ${weekStart.toLocaleDateString()} al ${weekEnd.toLocaleDateString()}. ¿Estás seguro?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'No, cancelar'
        });

        if (!confirmation.isConfirmed) {
            return;
        }
    }

    const newSchedule = {
        semanaInicio: weekStart,
        semanaFin: weekEnd, 
        horaInicio: newTimeRange.horaInicio,
        horaFin: newTimeRange.horaFin
    };

    try {
        setLoading(true);
        const updatedHorario = psicologos.Horario.filter(schedule => 
            new Date(schedule.semanaInicio).toDateString() !== weekStart.toDateString()
        ).map(schedule => ({
            ...schedule,
            semanaInicio: new Date(schedule.semanaInicio),
            semanaFin: new Date(schedule.semanaFin) 
        }));
        
        updatedHorario.push(newSchedule);

        const response = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/api/psicologos/${psicologos._id}`,
            { ...psicologos, Horario: updatedHorario }
        );
        console.log("Horario semanal actualizado:", response.data);
        setPsychologists(response.data);
        Swal.fire({
            icon: 'success',
            title: 'Horario agregado',
            text: 'El horario semanal ha sido agregado correctamente.',
        });
    } catch (error) {
        console.error("Error al actualizar el horario semanal:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al actualizar el horario semanal.',
        });
    } finally {
        setLoading(false);
    }
};

  const handleDeleteSchedule = (schedule) => {
    setSelectedScheduleToDelete(schedule);
    setShowDeleteForm(true);
  };

  const handleDeleteScheduleConfirm = async () => {
    if (!selectedScheduleToDelete) return;

    try {
      setLoading(true);
      const updatedHorario = psicologos.Horario.filter(schedule => 
        schedule.semanaInicio !== selectedScheduleToDelete.semanaInicio
      );

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/psicologos/${psicologos._id}`,
        { ...psicologos, Horario: updatedHorario }
      );
      console.log("Weekly schedule deleted:", response.data);
      setPsychologists(response.data);
      Swal.fire({
        icon: 'success',
        title: 'Horario eliminado',
        text: 'El horario semanal ha sido eliminado correctamente.',
      });
    } catch (error) {
      console.error("Error deleting weekly schedule:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al eliminar el horario semanal.',
      });
    } finally {
      setLoading(false);
      setShowDeleteForm(false);
      setSelectedScheduleToDelete(null);
    }
  };

  const renderSchedules = () => {
    const weekStart = getWeekStart(selectedWeek);
    const weekSchedule = psicologos.Horario?.find(schedule => 
      new Date(schedule.semanaInicio).toDateString() === weekStart.toDateString()
    );
    
    if (!weekSchedule) {
      return <p className="no-schedule">No hay horario definido para esta semana.</p>;
    }
    
    return (
      <div className="schedules-container">
        <h3 className="week-title">Horario para la semana</h3>
        <p className="schedule-date"><span>Inicio de semana:</span> {new Date(weekSchedule.semanaInicio).toLocaleDateString()}</p>
        <p className="schedule-date"><span>Fin de semana:</span> {new Date(weekSchedule.semanaFin).toLocaleDateString()}</p>
        <p className="schedule-time"><span>Hora de inicio:</span> {weekSchedule.horaInicio}</p>
        <p className="schedule-time"><span>Hora de fin:</span> {weekSchedule.horaFin}</p>
        <button onClick={() => handleDeleteSchedule(weekSchedule)} className="delete-button">
          Eliminar Horario
        </button>
      </div>
    );
  };

  const renderWeeklyScheduleForm = () => {
    const weekStart = getWeekStart(selectedWeek);
    const weekEnd = getWeekEnd(weekStart);
    
    return (
      <form onSubmit={handleWeeklyScheduleSubmit} className="weekly-schedule-form">
        <h3 className="form-title">Definir horario para la semana</h3>
        <p className="week-dates">
          Del {weekStart.toLocaleDateString()} al {weekEnd.toLocaleDateString()}
        </p>
        <div className="time-inputs">
          <label className="time-label">
            Hora de inicio:
            <input
              type="time"
              name="horaInicio"
              value={newTimeRange.horaInicio}
              onChange={handleTimeChange}
              required
              className="time-input"
            />
          </label>
          <label className="time-label">
            Hora de fin:
            <input
              type="time"
              name="horaFin"
              value={newTimeRange.horaFin}
              onChange={handleTimeChange}
              required
              className="time-input"
            />
          </label>
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Actualizando...' : 'Agregar Horario Semanal'}
        </button>
      </form>
    );
  };

  const renderDeleteScheduleForm = () => {
    if (!selectedScheduleToDelete) return null;

    return (
      <div className="modal-overlay active">
        <div className="modal active">
          <span className="close-button" onClick={() => setShowDeleteForm(false)}>&times;</span>
          <h3 className="modal-title">Eliminar Horario Semanal</h3>
          <p>¿Estás seguro de que deseas eliminar el horario para la semana del {new Date(selectedScheduleToDelete.semanaInicio).toLocaleDateString()} al {new Date(selectedScheduleToDelete.semanaFin).toLocaleDateString()}?</p>
          <button onClick={handleDeleteScheduleConfirm} disabled={loading} className="form-submit-button">
            {loading ? 'Eliminando...' : 'Confirmar Eliminación'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navigation />
      <div className="psychologist-data">
        <h2 className="main-title">Datos del Psicólogo</h2>
        
        <div className="psychologist-info">
          <p><strong>Nombre:</strong> {psicologos.Nombre || 'N/A'}</p>
          <p><strong>Email:</strong> {psicologos.Correo || 'N/A'}</p>
          <p><strong>Número Teléfono:</strong> {psicologos.Telefono || 'N/A'}</p>
          <p><strong>Filosofía:</strong> {psicologos.Filosofía || 'N/A'}</p>
          <p><strong>Descripción:</strong> {psicologos.DescripciónDeTratamiento || 'N/A'}</p>
        </div>

        <Calendar
          onChange={handleWeekChange}
          value={selectedWeek}
          view="month"
          className="calendar"
        />

        {renderWeeklyScheduleForm()}

        <div className="schedules-container">
          {renderSchedules()}
        </div>

        <button onClick={() => setShowForm(true)} className="update-button">
          Actualizar Datos
        </button>

        {showForm && (
          <div className="modal-overlay active">
            <div className="modal active">
              <span className="close-button" onClick={() => setShowForm(false)}>&times;</span>
              <h3 className="modal-title">Actualizar Datos del Psicólogo</h3>
              <form onSubmit={handlePsychologistDataSubmit} className="update-form">
                <label className="form-label">
                  Nombre:
                  <input
                    type="text"
                    name="Nombre"
                    value={newPsychologistData.Nombre}
                    onChange={handlePsychologistDataChange}
                    required
                    className="form-input"
                  />
                </label>
                <label className="form-label">
                  Correo:
                  <input
                    type="email"
                    name="Correo"
                    value={newPsychologistData.Correo}
                    onChange={handlePsychologistDataChange}
                    required
                    className="form-input"
                  />
                </label>
                <label className="form-label">
                  Teléfono:
                  <input
                    type="text"
                    name="Telefono"
                    value={newPsychologistData.Telefono}
                    onChange={handlePsychologistDataChange}
                    required
                    pattern="\d{10}"
                    title="Por favor ingrese un número de teléfono válido de 10 dígitos"
                    className="form-input"
                  />
                </label>
                <label className="form-label">
                  Descripción del tratamiento:
                  <textarea
                    name="DescripciónDeTratamiento" 
                    value={newPsychologistData.DescripciónDeTratamiento}
                    onChange={handlePsychologistDataChange}
                    required
                    className="form-textarea"
                  />
                </label>
                <label className="form-label">
                  Filosofía:
                  <textarea
                    name="Filosofía"
                    value={newPsychologistData.Filosofía}
                    onChange={handlePsychologistDataChange}
                    required
                    className="form-textarea"
                  />
                </label>
                <button type="submit" disabled={loading} className="form-submit-button">
                  {loading ? 'Actualizando...' : 'Actualizar Datos'}
                </button>
              </form>
            </div>
          </div>
        )}

        {showDeleteForm && renderDeleteScheduleForm()}
      </div>
    </>
  );
};

export default PsychologistData;
