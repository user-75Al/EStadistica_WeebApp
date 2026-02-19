import React, { useState } from 'react';
import { calcularProbabilidad } from '../../core/casos_de_uso/calcularProbabilidad';

const Probabilidad = ({ datos }) => {
  const [condicion, setCondicion] = useState('');
  const [resultado, setResultado] = useState(null);

  const handleCalcular = () => {
    if (!condicion.trim()) return;
    const res = calcularProbabilidad(datos, condicion);
    setResultado(res);
  };

  const espacioMuestral = [...new Set(datos)].sort((a, b) => a - b);

  return (
    <div className="results-section">
      <h3>Probabilidad (evento y espacio muestral)</h3>
      
      <div className="stat-card" style={{ width: '100%', alignItems: 'flex-start', padding: '1.5rem', textAlign: 'left' }}>
        <p style={{ color: 'var(--color-gray)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          <strong>Experimento:</strong> seleccionar 1 dato al azar de la muestra.
        </p>

        <div style={{ marginBottom: '1.5rem', width: '100%' }}>
          <p style={{ marginBottom: '0.8rem', fontWeight: 'bold', color: 'var(--color-sky)' }}>
            Espacio muestral (valores únicos ordenados):
          </p>
          <div style={{ 
            background: 'rgba(0,0,0,0.3)', 
            padding: '1rem', 
            borderRadius: '8px', 
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            fontSize: '1.1rem',
            border: '1px solid #444',
            color: 'var(--color-white)'
          }}>
            {`{ ${espacioMuestral.join(', ')} }`}
          </div>
        </div>

        <div className="form" style={{ width: '100%', marginTop: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: 'bold' }}>
            Definir evento E (condición lógica):
          </label>
          <input 
            type="text" 
            className="input" 
            placeholder="Ej: >30, >=15 and <40, =25" 
            value={condicion}
            onChange={(e) => setCondicion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCalcular()}
            style={{ marginBottom: '1rem' }}
          />
          <button 
            className="send-button" 
            onClick={handleCalcular}
            style={{ width: 'auto', padding: '12px 30px', borderRadius: '4px', border: 'none' }}
          >
            Calcular probabilidad
          </button>
        </div>

        {resultado && (
          <div style={{ 
            marginTop: '2rem', 
            width: '100%', 
            padding: '1.5rem', 
            background: resultado.error ? 'rgba(222, 68, 59, 0.1)' : 'rgba(202, 244, 56, 0.1)', 
            borderRadius: '12px', 
            border: `1px solid ${resultado.error ? 'var(--color-red)' : 'var(--color-lime)'}` 
          }}>
            {resultado.error ? (
              <p style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>{resultado.error}</p>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-gray)', marginBottom: '0.3rem' }}>Resultado del evento:</p>
                    <p style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-lime)' }}>
                      P(E) = {resultado.porcentaje}%
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'monospace', color: 'var(--color-sky)', fontSize: '1.1rem' }}>
                      P(E) = {resultado.favorables} / {resultado.total}
                    </p>
                    <p style={{ fontFamily: 'monospace', color: 'var(--color-gray)', fontSize: '0.9rem' }}>
                      = {resultado.probabilidad}
                    </p>
                  </div>
                </div>
                <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-gray)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.8rem' }}>
                  {resultado.favorables} datos cumplen la condición de un total de {resultado.total} datos.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Probabilidad;
