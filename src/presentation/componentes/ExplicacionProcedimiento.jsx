import React from 'react';
import '../estilos/ExplicacionCards.css';

const ExplicacionProcedimiento = ({ titulo = "Interpretación Paso a Paso", pasos }) => {
  if (!pasos || pasos.length === 0) return null;

  return (
    <div className="results-section" style={{ marginTop: '4rem' }}>
      <h3 style={{ marginBottom: '2rem' }}>{titulo}</h3>
      <div className="explicacion-container">
        {pasos.map((paso, idx) => (
          <div key={idx} className="card-explicacion">
            <p className="card-title">{paso.titulo}</p>
            <p className="small-desc">{paso.desc}</p>
            <div className="go-corner">
              <div className="go-arrow">→</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplicacionProcedimiento;
