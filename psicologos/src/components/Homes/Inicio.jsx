import React, { useContext, useEffect } from "react";
import './css/inicio.css';
import Navigation from "../Navigation/Navbar";
import { UserContext } from '../../App';

const Inicio = () => {
  const { userData, setUserData } = useContext(UserContext);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, [setUserData]);

  

  return (
    <div className="inicio-container" style={{ position: 'relative' }}>
      <video 
        autoPlay 
        loop 
        muted 
        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: -1 }}
      />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '4rem',
         borderRadius:'10px', backgroundColor:'#000000' }}>
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
            <p className="user-name">{userData.Nombre}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inicio;