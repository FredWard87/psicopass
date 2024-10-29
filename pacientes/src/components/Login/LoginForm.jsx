import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import './css/login.css';
import Swal from 'sweetalert2';
import logo from '../asstes/img/logo.png';
import withReactContent from 'sweetalert2-react-content';

const LoginForm = () => {
  const [formData, setFormData] = useState({ Correo: '', Contraseña: '' });
  const { setUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const mostrarCargando = () => {
    MySwal.fire({
      title: 'Verificando Credenciales...',
      text: 'Por favor, espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  };
  
  const ocultarCargando = () => {
    Swal.close();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    mostrarCargando();
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login/patient`, formData);
      const { token, usuario } = response.data;
  
      // Verificación del tipo de usuario (si solo permites administradores o psicólogos)
      if (usuario.TipoUsuario !== 'Administrador' && usuario.TipoUsuario !== 'Paciente') {
        Swal.fire({
          icon: 'error',
          title: 'Acceso denegado',
          text: 'Solo los administradores o pacientes pueden iniciar sesión.',
        });
        return;
      }
  
      // Guardar el token y los datos del usuario en localStorage
      localStorage.setItem('token', token);
      setUserData(usuario);
  
      // Redireccionar al usuario a la página de inicio
      navigate('/home');
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Credenciales inválidas. Por favor, intenta de nuevo.',
      });
    } finally {
      ocultarCargando();
    }
  };

  return (
    <div className='login-container-all'>
      <div className="login-container">
        <div className="form-group">
          <div className='espacio'>
            <img src={logo} alt="Logo Empresa" className="logo-empresa-login" />
            <div className='tipo-usuario'>Pacientes</div>
          </div>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="Correo"></label>
            <input
              type="email"
              name="Correo"
              value={formData.Correo}
              onChange={handleChange}
              placeholder="Correo electrónico"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="Contraseña"></label>
            <input
              type="password"
              name="Contraseña"
              value={formData.Contraseña}
              onChange={handleChange}
              placeholder="Contraseña"
              required
            />
          </div>
          <button type="submit" className="btn-login">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;