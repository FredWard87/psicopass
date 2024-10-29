import React, { useState } from 'react';
import './css/gesti.css'; // Asegúrate de crear este archivo para los estilos
import logo from '../asstes/img/logo.png';
import Navigation from "../Navigation/Navbar";



const Expediente = () => {
  const [expediente, setExpediente] = useState({
    nombreUsuario: '',
    edad: '',
    sexo: '',
    lugarFechaNacimiento: '',
    direccionDomiciliar: '',
    telefonoFijo: '',
    telefonoCelular: '',
    estadoCivil: '',
    nombreConyuge: '',
    edadConyuge: '',
    ocupacionConyuge: '',
    hijos: [{ nombre: '', sexo: '', edad: '', gradoEscolar: '' }],
    ocupacion: '',
    lugarTrabajo: '',
    telefonosContacto: '',
    terapeutaAsignado: '',
    diaAtencion: '',
    horaAtencion: '',
    fechasAtencion: '',
    fechasAusencias: '',
    motivoConsulta: '',
    descripcionMotivo: '',
    signosSintomas: '',
    genograma: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpediente({ ...expediente, [name]: value });
  };

  const handleHijoChange = (index, field, value) => {
    const newHijos = [...expediente.hijos];
    newHijos[index] = { ...newHijos[index], [field]: value };
    setExpediente({ ...expediente, hijos: newHijos });
  };

  const addHijo = () => {
    setExpediente({
      ...expediente,
      hijos: [...expediente.hijos, { nombre: '', sexo: '', edad: '', gradoEscolar: '' }]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Expediente guardado:', expediente);
    // Aquí puedes agregar la lógica para guardar el expediente
  };

  return (
    <>
      <Navigation />
     <div className="expediente-container">
      <div className="header">
      <img src={logo} alt="Logo Empresa" className="logo-empresa" />
      <h1>PsicoPass</h1>
        <p>Nuestro Compromiso es la Salud Psicologica</p>
      </div>
      <h2>PSICOLOGICA EN AUMENTO</h2>
      <h4>CLÍNICA PSICOLOGÍCA PSICOPASS</h4>
      
      <form onSubmit={handleSubmit}>
        <table className="clasificacion">
          <tr>
            <th>CLASIFICACIÓN:</th>
            <td>ADULTO</td>
          </tr>
        </table>

        <table className="info-general">
          <thead>
            <tr>
              <th colSpan="4">I. INFORMACIÓN GENERAL</th>
            </tr>
            <tr>
              <th colSpan="4">PERSONALES</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nombre del usuario:</td>
              <td colSpan="3"><input type="text" name="nombreUsuario" value={expediente.nombreUsuario} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>Edad:</td>
              <td><input type="text" name="edad" value={expediente.edad} onChange={handleChange} /></td>
              <td>Sexo:</td>
              <td><input type="text" name="sexo" value={expediente.sexo} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>Lugar y fecha de nacimiento:</td>
              <td colSpan="3"><input type="text" name="lugarFechaNacimiento" value={expediente.lugarFechaNacimiento} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>Dirección Domiciliar:</td>
              <td colSpan="3"><input type="text" name="direccionDomiciliar" value={expediente.direccionDomiciliar} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>Teléfono fijo:</td>
              <td><input type="text" name="telefonoFijo" value={expediente.telefonoFijo} onChange={handleChange} /></td>
              <td>Teléfono celular:</td>
              <td><input type="text" name="telefonoCelular" value={expediente.telefonoCelular} onChange={handleChange} /></td>
            </tr>
          </tbody>
        </table>

        <table className="info-familiares">
          <thead>
            <tr>
              <th colSpan="4">FAMILIARES</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Estado Civil:</td>
              <td colSpan="3"><input type="text" name="estadoCivil" value={expediente.estadoCivil} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>Nombre del Cónyuge:</td>
              <td colSpan="3"><input type="text" name="nombreConyuge" value={expediente.nombreConyuge} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>Edad:</td>
              <td><input type="text" name="edadConyuge" value={expediente.edadConyuge} onChange={handleChange} /></td>
              <td>Ocupación:</td>
              <td><input type="text" name="ocupacionConyuge" value={expediente.ocupacionConyuge} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>Número de hijos:</td>
              <td colSpan="3"><input type="number" value={expediente.hijos.length} readOnly /></td>
            </tr>
            <tr>
              <th>NOMBRE</th>
              <th>SEXO</th>
              <th>EDAD</th>
              <th>GRADO ESCOLAR</th>
            </tr>
            {expediente.hijos.map((hijo, index) => (
              <tr key={index}>
                <td><input type="text" value={hijo.nombre} onChange={(e) => handleHijoChange(index, 'nombre', e.target.value)} /></td>
                <td><input type="text" value={hijo.sexo} onChange={(e) => handleHijoChange(index, 'sexo', e.target.value)} /></td>
                <td><input type="text" value={hijo.edad} onChange={(e) => handleHijoChange(index, 'edad', e.target.value)} /></td>
                <td><input type="text" value={hijo.gradoEscolar} onChange={(e) => handleHijoChange(index, 'gradoEscolar', e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={addHijo}>Agregar Hijo</button>

        <table className="info-laborales">
          <thead>
            <tr>
              <th colSpan="2">LABORALES</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ocupación:</td>
              <td><input type="text" name="ocupacion" value={expediente.ocupacion} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>Lugar de Trabajo:</td>
              <td><input type="text" name="lugarTrabajo" value={expediente.lugarTrabajo} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>Teléfonos a contactar:</td>
              <td><input type="text" name="telefonosContacto" value={expediente.telefonosContacto} onChange={handleChange} /></td>
            </tr>
          </tbody>
        </table>

        <table className="info-terapeuta">
          <tbody>
            <tr>
              <td>TERAPEUTA ASIGNADO :</td>
              <td><input type="text" name="terapeutaAsignado" value={expediente.terapeutaAsignado} onChange={handleChange} /></td>
            </tr>
          </tbody>
        </table>

        <table className="info-atencion">
          <tbody>
            <tr>
              <td>DÍA DE ATENCIÓN :</td>
              <td><input type="text" name="diaAtencion" value={expediente.diaAtencion} onChange={handleChange} /></td>
              <td>HORA</td>
              <td><input type="text" name="horaAtencion" value={expediente.horaAtencion} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td colSpan="4">FECHAS DE ATENCIÓN:</td>
            </tr>
            <tr>
              <td colSpan="4"><textarea name="fechasAtencion" value={expediente.fechasAtencion} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td colSpan="4">FECHAS DE AUSENCIAS Y PERMISOS DEL USUARIO:</td>
            </tr>
            <tr>
              <td colSpan="4"><textarea name="fechasAusencias" value={expediente.fechasAusencias} onChange={handleChange} /></td>
            </tr>
          </tbody>
        </table>

        <table className="motivo-consulta">
          <thead>
            <tr>
              <th>II. MOTIVO DE CONSULTA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><textarea name="motivoConsulta" value={expediente.motivoConsulta} onChange={handleChange} /></td>
            </tr>
          </tbody>
        </table>

        <table className="estudio-clinico">
          <thead>
            <tr>
              <th>III. ESTUDIO CLÍNICO INICIAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>DESCRIPCIÓN DEL MOTIVO DE CONSULTA :</td>
            </tr>
            <tr>
              <td><textarea name="descripcionMotivo" value={expediente.descripcionMotivo} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>SIGNOS Y SÍNTOMAS :</td>
            </tr>
            <tr>
              <td><textarea name="signosSintomas" value={expediente.signosSintomas} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>GENOGRAMA</td>
            </tr>
            <tr>
              <td><textarea name="genograma" value={expediente.genograma} onChange={handleChange} /></td>
            </tr>
          </tbody>
        </table>

        <button type="submit" className="submit-button">Guardar Expediente</button>
      </form>
    </div>
    </>
  );
};

export default Expediente;