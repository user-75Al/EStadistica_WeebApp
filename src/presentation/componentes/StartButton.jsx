import React from 'react';
import '../estilos/App.css';

const StartButton = ({ onClick }) => {
  return (
    <button className="cta" onClick={onClick}>
      <span>Empezar</span>
      <svg width="15px" height="10px" viewBox="0 0 13 10">
        <path d="M1,5 L11,5"></path>
        <polyline points="8 1 12 5 8 9"></polyline>
      </svg>
    </button>
  );
};

export default StartButton;