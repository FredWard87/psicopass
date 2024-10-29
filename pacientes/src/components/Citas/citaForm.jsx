import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../App'; // Importa el contexto de usuario
import Swal from 'sweetalert2'; // Importa SweetAlert2 para mostrar alertas
import './css/RegistrarCita.css'; // Importa los estilos para el componente
import Navigation from "../Navigation/Navbar"; // Importa el componente de navegación

const RegistrarCita = () => {
  const { userData } = useContext(UserContext); // Obtiene los datos del usuario del contexto
  const [psicologos, setPsicologos] = useState([]); // Estado para almacenar psicólogos
  const [horarios, setHorarios] = useState([]); // Estado para almacenar horarios del psicólogo seleccionado
  const [citas, setCitas] = useState({ // Estado para manejar los datos de la cita
    psicologoId: '',
    fecha: '',
    hora: '',
    motivo: ''
  });
  const [misCitas, setMisCitas] = useState([]); // Estado para almacenar las citas del usuario
  const [showForm, setShowForm] = useState(true); // Estado para controlar la visualización del formulario

  // Función para formatear la fecha en un formato deseado (solo fecha, sin hora)
  const formatFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    fechaObj.setMinutes(fechaObj.getMinutes() + fechaObj.getTimezoneOffset())
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return fechaObj.toLocaleDateString('es-MX', options); // Retorna la fecha formateada
  };

  useEffect(() => {
    // Función para obtener la lista de psicólogos desde el backend
    const fetchPsicologos = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/psicologos`);
        setPsicologos(response.data); // Almacena la lista de psicólogos en el estado
      } catch (error) {
        console.error("Error al obtener psicólogos:", error);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los psicólogos.' });
      }
    };

    // Función para obtener las citas del usuario
    const fetchCitas = async () => {
      if (userData && userData._id) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/citas/misCitas/${userData._id}`);
          setMisCitas(response.data); // Almacena las citas del usuario en el estado
        } catch (error) {
          console.error("Error al obtener mis citas:", error);
          Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar tus citas.' });
        }
      } else {
        console.error("El ID del usuario no está disponible.");
      }
    };

    fetchPsicologos(); // Llama a la función para obtener psicólogos
    fetchCitas(); // Llama a la función para obtener citas
  }, [userData]);

  // Verifica si la fecha seleccionada es válida según los horarios del psicólogo
  const esFechaValida = (fechaSeleccionada) => {
    const fecha = new Date(fechaSeleccionada);
    return horarios.some(horario => {
      const semanaInicio = new Date(horario.semanaInicio);
      const semanaFin = new Date(horario.semanaFin);
      return fecha >= semanaInicio && fecha <= semanaFin; // Retorna true si la fecha está dentro de los horarios
    });
  };

  // Verifica si la hora seleccionada es válida según los horarios del psicólogo
  const esHoraValida = (horaSeleccionada) => {
    const fecha = new Date(citas.fecha);
    const horario = horarios.find(horario => {
      const semanaInicio = new Date(horario.semanaInicio);
      const semanaFin = new Date(horario.semanaFin);
      return fecha >= semanaInicio && fecha <= semanaFin; // Busca un horario que coincida con la fecha
    });

    if (horario) {
      const [horaInicio, minutoInicio] = horario.horaInicio.split(':').map(Number);
      const [horaFin, minutoFin] = horario.horaFin.split(':').map(Number);
      const [horaSeleccionadaNum, minutoSeleccionadoNum] = horaSeleccionada.split(':').map(Number);

      const horaInicioDate = new Date(citas.fecha);
      horaInicioDate.setHours(horaInicio, minutoInicio, 0, 0); // Establece la hora de inicio
      const horaFinDate = new Date(citas.fecha);
      horaFinDate.setHours(horaFin, minutoFin, 0, 0); // Establece la hora de fin
      const horaSeleccionadaDate = new Date(citas.fecha);
      horaSeleccionadaDate.setHours(horaSeleccionadaNum, minutoSeleccionadoNum, 0, 0); // Establece la hora seleccionada

      return horaSeleccionadaDate >= horaInicioDate && horaSeleccionadaDate <= horaFinDate; // Retorna true si la hora está dentro del horario
    }

    return false; // Si no se encontró horario, retorna false
  };

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCitas({ ...citas, [name]: value }); // Actualiza el estado de citas

    // Si se selecciona un psicólogo, carga sus horarios
    if (name === 'psicologoId') {
      const psicologoSeleccionado = psicologos.find(psicologo => psicologo._id === value);
      if (psicologoSeleccionado) {
        setHorarios(psicologoSeleccionado.Horario); // Establece los horarios del psicólogo seleccionado
      } else {
        setHorarios([]); // Si no hay psicólogo seleccionado, reinicia los horarios
      }
    }
  };

  // Maneja el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Valida que todos los campos estén completos
    if (!citas.psicologoId || !citas.fecha || !citas.hora || !citas.motivo) {
      Swal.fire({ icon: 'warning', title: 'Datos incompletos', text: 'Por favor, completa todos los campos.' });
      return;
    }

    // Valida la fecha y la hora
    if (!esFechaValida(citas.fecha)) {
      Swal.fire({ icon: 'warning', title: 'Fecha inválida', text: 'El psicólogo no tiene horarios disponibles en la fecha seleccionada.' });
      return;
    }

    if (!esHoraValida(citas.hora)) {
      Swal.fire({ icon: 'warning', title: 'Hora inválida', text: 'La hora seleccionada no está dentro del horario disponible del psicólogo.' });
      return;
    }

    try {
      const fechaSeleccionada = new Date(citas.fecha);
      const fechaISO = fechaSeleccionada.toISOString(); // Convierte la fecha al formato ISO
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/citas/solicitar`, {
        psicologoId: citas.psicologoId,
        fecha: fechaISO,
        hora: citas.hora,
        motivo: citas.motivo,
        pacienteId: userData._id // Envía el ID del paciente
      });

      // Muestra un mensaje de éxito y reinicia el formulario
      Swal.fire({ icon: 'success', title: 'Cita registrada', text: 'Tu cita ha sido registrada exitosamente.' });
      setCitas({ psicologoId: '', fecha: '', hora: '', motivo: '' });
      setHorarios([]); // Reinicia los horarios
      setShowForm(false); // Oculta el formulario
      setMisCitas([...misCitas, response.data.cita]); // Añade la nueva cita a mis citas
    } catch (error) {
      console.error("Error al registrar la cita:", error);
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.error || 'No se pudo registrar la cita. Intenta de nuevo.' });
    }
  };

  // Función para posponer una cita
  const posponerCita = async (citaId) => {
    const { value: nuevaFecha } = await Swal.fire({
      title: 'Posponer Cita',
      input: 'date',
      inputLabel: 'Selecciona una nueva fecha',
      inputPlaceholder: 'Selecciona una fecha',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Debes seleccionar una fecha';
        }
      }
    });

    if (!nuevaFecha) return; // Si no se selecciona nueva fecha, sale

    const { value: motivo } = await Swal.fire({
      title: 'Motivo de Posponer',
      input: 'text',
      inputLabel: 'Escribe el motivo de la postergación',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Debes escribir un motivo';
        }
      }
    });

    if (!motivo) return; // Si no se proporciona motivo, sale

    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/citas/posponer/${citaId}`, { nuevaFecha, motivo });
      Swal.fire({ icon: 'success', title: 'Cita pospuesta', text: 'La cita ha sido pospuesta exitosamente.' });
      setMisCitas(misCitas.map(cita => cita._id === citaId ? { ...cita, fecha: formatFecha(nuevaFecha), estado: 'pospuesta', motivo } : cita)); // Actualiza la cita pospuesta en el estado
    } catch (error) {
      console.error("Error al posponer la cita:", error);
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.error || 'No se pudo posponer la cita. Intenta de nuevo.' });
    }
  };

  // Función para cancelar una cita
  const cancelarCita = async (citaId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/citas/cancelar/${citaId}`);
      Swal.fire({ icon: 'success', title: 'Cita cancelada', text: 'La cita ha sido cancelada exitosamente.' });
      setMisCitas(misCitas.filter(cita => cita._id !== citaId)); // Elimina la cita cancelada del estado
    } catch (error) {
      console.error("Error al cancelar la cita:", error);
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.error || 'No se pudo cancelar la cita. Intenta de nuevo.' });
    }
  };

  return (
    <>
      <Navigation /> {/* Renderiza la barra de navegación */}
      <div className="registrar-cita-container">
        {showForm ? ( // Condicional para mostrar el formulario o las citas
          <>
            <h2>Registrar Cita con Psicólogo</h2>
            <form className="registrar-cita-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="psicologoId">Psicólogo:</label>
                <select name="psicologoId" value={citas.psicologoId} onChange={handleChange} required>
                  <option value="">Seleccione un psicólogo</option>
                  {psicologos.map(psicologo => (
                    <option key={psicologo._id} value={psicologo._id}>{psicologo.Nombre}</option> // Lista de psicólogos
                  ))}
                </select>
              </div>

              {horarios.length > 0 && ( // Muestra horarios disponibles si hay
                <div className="form-group horarios-psicologo">
                  <h3>Horarios Disponibles</h3>
                  <ul>
                    {horarios.map((horario, index) => (
                      <li key={index}>
                        <strong>Semana:</strong> 
                        {new Date(horario.semanaInicio).toLocaleDateString('es-MX')} - 
                        {new Date(horario.semanaFin).toLocaleDateString('es-MX')}<br />
                        <strong>Hora Inicio:</strong> 
                        {new Date(`1970-01-01T${horario.horaInicio}:00`).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true })}<br />
                        <strong>Hora Fin:</strong> 
                        {new Date(`1970-01-01T${horario.horaFin}:00`).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="fecha">Fecha:</label>
                <input type="date" name="fecha" value={citas.fecha} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="hora">Hora:</label>
                <input type="time" name="hora" value={citas.hora} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="motivo">Motivo de la Cita:</label>
                <textarea
                  name="motivo"
                  value={citas.motivo}
                  onChange={handleChange}
                  required
                  placeholder="Escribe el motivo de tu cita..."
                />
              </div>
              <button type="submit" className="btn-registrar">Registrar Cita</button>
            </form>
          </>
        ) : ( // Si no se muestra el formulario, muestra las citas
          <div className="mis-citas">
            <h2>Mis Citas</h2>
            <ul>
              {misCitas.map(cita => (
                <li key={cita._id}>
                  <strong>Psicólogo:</strong> {cita.psicologo?.Nombre || 'N/A'}<br />
                  <strong>Fecha:</strong> {formatFecha(cita.fecha)}<br />
                  <strong>Hora:</strong> {cita.hora}<br />
                  <strong>Motivo:</strong> {cita.motivo}<br />
                  <strong>Estado:</strong> {cita.estado}<br />
                  <button onClick={() => posponerCita(cita._id)}>Posponer</button>
                  <button onClick={() => cancelarCita(cita._id)}>Cancelar</button>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowForm(true)} className="btn-regresar">Regresar a Registrar Cita</button>
          </div>
        )}
        <button onClick={() => setShowForm(false)} className="btn-ver-citas">Ver Mis Citas</button>
      </div>
    </>
  );
};

export default RegistrarCita; // Exporta el componente
