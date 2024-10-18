import React, { useState } from 'react';
import './css/gesti.css'; // Asegúrate de crear este archivo para los estilos
import Navigation from "../Navigation/Navbar";


const Expedientes = () => {
  const [expedientes, setExpedientes] = useState([]);
  const [nuevoExpediente, setNuevoExpediente] = useState({
    nombre: '',
    descripcion: '',
    fecha: '',
    diagnostico: '',
    antecedentes: '',
    tratamiento: ''
  });
  const [pacienteID, setPacienteID] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoExpediente({ ...nuevoExpediente, [name]: value });
  };

  const handlePacienteIDChange = (e) => {
    setPacienteID(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (expedientes.some(exp => exp.nombre === pacienteID)) {
      alert("El paciente ya tiene un expediente. Cargándolo...");
      const expedienteExistente = expedientes.find(exp => exp.nombre === pacienteID);
      setNuevoExpediente(expedienteExistente);
    } else {
      setExpedientes([...expedientes, { ...nuevoExpediente, nombre: pacienteID }]);
      setNuevoExpediente({
        nombre: '',
        descripcion: '',
        fecha: '',
        diagnostico: '',
        antecedentes: '',
        tratamiento: ''
      });
      alert("Expediente creado para el nuevo paciente.");
    }
  };

  return (
    <>
      <Navigation />
    <div className="expedientes-container">
      <h2 className="main-title">Gestión de Expedientes</h2>
      
      <form onSubmit={handleSubmit} className="expediente-form">
        <h3 className="form-title">Crear o Cargar Expediente</h3>
        <label>
          ID/Nombre del Paciente:
          <input
            type="text"
            value={pacienteID}
            onChange={handlePacienteIDChange}
            required
            className="form-input"
          />
        </label>
        <label>
          Descripción:
          <textarea
            name="descripcion"
            value={nuevoExpediente.descripcion}
            onChange={handleChange}
            required
            className="form-textarea"
          />
        </label>
        <label>
          Fecha:
          <input
            type="date"
            name="fecha"
            value={nuevoExpediente.fecha}
            onChange={handleChange}
            required
            className="form-input"
          />
        </label>
        <label>
          Diagnóstico:
          <input
            type="text"
            name="diagnostico"
            value={nuevoExpediente.diagnostico}
            onChange={handleChange}
            className="form-input"
          />
        </label>
        <label>
          Antecedentes:
          <textarea
            name="antecedentes"
            value={nuevoExpediente.antecedentes}
            onChange={handleChange}
            className="form-textarea"
          />
        </label>
        <label>
          Tratamiento Sugerido:
          <textarea
            name="tratamiento"
            value={nuevoExpediente.tratamiento}
            onChange={handleChange}
            className="form-textarea"
          />
        </label>
        <button type="submit" className="submit-button">Guardar Expediente</button>
      </form>

      <div className="expedientes-list">
        <h3 className="list-title">Lista de Expedientes</h3>
        {expedientes.length === 0 ? (
          <p>No hay expedientes creados.</p>
        ) : (
          <table className="expediente-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Diagnóstico</th>
                <th>Antecedentes</th>
                <th>Tratamiento</th>
              </tr>
            </thead>
            <tbody>
              {expedientes.map((expediente, index) => (
                <tr key={index}>
                  <td>{expediente.nombre}</td>
                  <td>{expediente.descripcion}</td>
                  <td>{expediente.fecha}</td>
                  <td>{expediente.diagnostico}</td>
                  <td>{expediente.antecedentes}</td>
                  <td>{expediente.tratamiento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </>
  );
};

export default Expedientes;
