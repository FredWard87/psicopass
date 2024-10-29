import React, { useContext } from "react";
import './css/inicio.css';
import Navigation from "../Navigation/Navbar";
import { UserContext } from '../../App';

const Inicio = () => {
  const { userData } = useContext(UserContext);

  // Verifica la estructura de userData
  console.log('userData:', userData); // Para depuración

  return (
    <div className="inicio-container" style={{ position: 'relative' }}>
      <video 
        autoPlay 
        loop 
        muted 
        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: -1 }}
      />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '4rem', borderRadius: '10px', backgroundColor: '#000000' }}>
        <Navigation />
      </div>
      <div className="inicio-content">
        <h1>Bienvenido</h1>
        {userData && (
          <div className="user-info">
            <br />
            <br />
            <br />
            <br />
            <p className="user-name">{userData.Nombre || userData.nombre}</p> {/* Consistencia en el campo */}
            {userData.TipoUsuario === 'Paciente' ? (
              <p>Como paciente, puedes acceder a tus consultas y contenido educativo.</p>
            ) : userData.TipoUsuario === 'Psicologo' ? (
              <p>Como psicólogo, puedes gestionar tus citas y contenidos.</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inicio;
