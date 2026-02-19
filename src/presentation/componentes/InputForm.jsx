import React, { useState } from 'react';
import '../estilos/App.css';

const InputForm = ({ onCalculate, onRandom }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(inputValue);
  };

  return (
    <div className="form-container">
      <div className="form">
        <span className="heading">Ingresa tus datos numéricos</span>
        <span className="c1">Mínimo 20 números separados por comas o espacios</span>
        <input 
          className="input" 
          type="text" 
          placeholder="Ej: 5, 8, 10, 15, 20, 8, 30..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="button-container">
          <div className="send-button" onClick={handleSubmit}>Calcular</div>
          <div className="reset-button-container">
            <div className="reset-button" onClick={() => onRandom()}>Generar datos random</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputForm;