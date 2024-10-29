import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../App';
import Swal from 'sweetalert2';
import './css/RegistrarCita.css';
import Navigation from "../Navigation/Navbar";

const RegistrarCita = () => {
  const { userData } = useContext(UserContext);
  const [psicologos, setPsicologos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [citas, setCitas] = useState({
    psicologoId: '',
    fecha: '',
    hora: '',
    motivo: ''
  });
  const [misCitas, setMisCitas] = useState([]);
  const [showForm, setShowForm] = useState(true);

  // Función para formatear la fecha en un formato deseado (solo fecha, sin hora)
  const formatFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    fechaObj.setMinutes(fechaObj.getMinutes() + fechaObj.getTimezoneOffset())
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const fechaFormateada = fechaObj.toLocaleDateString('es-MX', options);
    return fechaFormateada;
  };

  useEffect(() => {
    const fetchPsicologos = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/psicologos`);
        setPsicologos(response.data);
      } catch (error) {
        console.error("Error al obtener psicólogos:", error);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los psicólogos.' });
      }
    };

    const fetchCitas = async () => {
      if (userData && userData._id) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/citas/misCitas/${userData._id}`);
          setMisCitas(response.data);
        } catch (error) {
          console.error("Error al obtener mis citas:", error);
          Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar tus citas.' });
        }
      } else {
        console.error("El ID del usuario no está disponible.");
      }
    };

    fetchPsicologos();
    fetchCitas();
  }, [userData]);

  const esFechaValida = (fechaSeleccionada) => {
    const fecha = new Date(fechaSeleccionada);
    return horarios.some(horario => {
      const semanaInicio = new Date(horario.semanaInicio);
      const semanaFin = new Date(horario.semanaFin);
      return fecha >= semanaInicio && fecha <= semanaFin;
    });
  };

  const esHoraValida = (horaSeleccionada) => {
    const fecha = new Date(citas.fecha);
    const horario = horarios.find(horario => {
      const semanaInicio = new Date(horario.semanaInicio);
      const semanaFin = new Date(horario.semanaFin);
      return fecha >= semanaInicio && fecha <= semanaFin;
    });

    if (horario) {
      const [horaInicio, minutoInicio] = horario.horaInicio.split(':').map(Number);
      const [horaFin, minutoFin] = horario.horaFin.split(':').map(Number);
      const [horaSeleccionadaNum, minutoSeleccionadoNum] = horaSeleccionada.split(':').map(Number);

      const horaInicioDate = new Date(citas.fecha);
      horaInicioDate.setHours(horaInicio, minutoInicio, 0, 0);
      const horaFinDate = new Date(citas.fecha);
      horaFinDate.setHours(horaFin, minutoFin, 0, 0);
      const horaSeleccionadaDate = new Date(citas.fecha);
      horaSeleccionadaDate.setHours(horaSeleccionadaNum, minutoSeleccionadoNum, 0, 0);

      return horaSeleccionadaDate >= horaInicioDate && horaSeleccionadaDate <= horaFinDate;
    }

    return false;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCitas({ ...citas, [name]: value });

    if (name === 'psicologoId') {
      const psicologoSeleccionado = psicologos.find(psicologo => psicologo._id === value);
      if (psicologoSeleccionado) {
        setHorarios(psicologoSeleccionado.Horario);
      } else {
        setHorarios([]);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!citas.psicologoId || !citas.fecha || !citas.hora || !citas.motivo) {
      Swal.fire({ icon: 'warning', title: 'Datos incompletos', text: 'Por favor, completa todos los campos.' });
      return;
    }

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
      const fechaISO = fechaSeleccionada.toISOString(); // Convertir la fecha al formato ISO antes de enviarla al backend
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/citas/solicitar`, {
        psicologoId: citas.psicologoId,
        fecha: fechaISO,
        hora: citas.hora,
        motivo: citas.motivo,
        pacienteId: userData._id
      });

      Swal.fire({ icon: 'success', title: 'Cita registrada', text: 'Tu cita ha sido registrada exitosamente.' });
      setCitas({ psicologoId: '', fecha: '', hora: '', motivo: '' });
      setHorarios([]);
      setShowForm(false);
      setMisCitas([...misCitas, response.data.cita]); // Asegúrate de que la respuesta tenga el formato correcto
    } catch (error) {
      console.error("Error al registrar la cita:", error);
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.error || 'No se pudo registrar la cita. Intenta de nuevo.' });
    }
  };

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

    if (!nuevaFecha) return;

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

    if (!motivo) return;

    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/citas/posponer/${citaId}`, { nuevaFecha, motivo });
      Swal.fire({ icon: 'success', title: 'Cita pospuesta', text: 'La cita ha sido pospuesta exitosamente.' });
      setMisCitas(misCitas.map(cita => cita._id === citaId ? { ...cita, fecha: formatFecha(nuevaFecha), estado: 'pospuesta', motivo } : cita));
    } catch (error) {
      console.error("Error al posponer la cita:", error);
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.error || 'No se pudo posponer la cita. Intenta de nuevo.' });
    }
  };

  const cancelarCita = async (citaId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/citas/cancelar/${citaId}`);
      Swal.fire({ icon: 'success', title: 'Cita cancelada', text: 'La cita ha sido cancelada exitosamente.' });
      setMisCitas(misCitas.filter(cita => cita._id !== citaId));
    } catch (error) {
      console.error("Error al cancelar la cita:", error);
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.error || 'No se pudo cancelar la cita. Intenta de nuevo.' });
    }
  };

  return (
    <>
      <Navigation />
      <div className="registrar-cita-container">
        {showForm ? (
          <>
            <h2>Registrar Cita con Psicólogo</h2>
            <form className="registrar-cita-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="psicologoId">Psicólogo:</label>
                <select name="psicologoId" value={citas.psicologoId} onChange={handleChange} required>
                  <option value="">Seleccione un psicólogo</option>
                  {psicologos.map(psicologo => (
                    <option key={psicologo._id} value={psicologo._id}>{psicologo.Nombre}</option>
                  ))}
                </select>
              </div>

              {horarios.length > 0 && (
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
        ) : (
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

export default RegistrarCita;