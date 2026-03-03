import React, { useState } from 'react';
import '../estilos/App.css';

const InputForm = ({ onCalculate, onRandom, error, onClearError }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(inputValue);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (error) onClearError();
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
          onChange={handleInputChange}
          style={error ? { borderLeft: '5px solid var(--color-red)', backgroundColor: 'rgba(222, 68, 59, 0.05)' } : {}}
        />
        {error && (
          <p style={{ 
            color: 'var(--color-red)', 
            fontSize: '0.9rem', 
            marginTop: '-15px', 
            marginBottom: '20px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span> {error}
          </p>
        )}
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