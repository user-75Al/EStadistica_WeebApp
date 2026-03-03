import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { VscInfo } from 'react-icons/vsc';
import { calcularProbabilidad } from '../../core/casos_de_uso/calcularProbabilidad';
import 'react-tooltip/dist/react-tooltip.css';

const probFormulas = {
  'experimento': {
    titulo: "Experimento Aleatorio",
    formula: "ε",
    desc: "Proceso cuyo resultado no se puede predecir con exactitud (ej: extraer un dato al azar)."
  },
  'muestral': {
    titulo: "Espacio Muestral",
    formula: "S = {x₁, x₂, ..., xₙ}",
    desc: "Conjunto de todos los resultados posibles del experimento."
  },
  'evento': {
    titulo: "Evento o Suceso",
    formula: "E ⊆ S",
    desc: "Subconjunto del espacio muestral definido por una condición (ej: valores > 30)."
  },
  'calculo': {
    titulo: "Regla de Laplace",
    formula: "P(E) = n(E) / n(S)",
    desc: "Probabilidad = Casos Favorables divididos entre Casos Totales."
  }
};

const Probabilidad = ({ datos, onResultadoChange }) => {
  const [condicion, setCondicion] = useState('');
  const [resultado, setResultado] = useState(null);

  const handleCalcular = () => {
    if (!condicion.trim()) return;
    const res = calcularProbabilidad(datos, condicion);
    setResultado(res);
    if (onResultadoChange) onResultadoChange({ ...res, condicion });
  };

  const espacioMuestral = [...new Set(datos)].sort((a, b) => a - b);

  return (
    <div className="results-section">
      <h3>Probabilidad (evento y espacio muestral)</h3>
      
      <div className="stat-card" style={{ width: '100%', alignItems: 'flex-start', padding: '1.5rem', textAlign: 'left' }}>
        <p style={{ color: 'var(--color-gray)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          <strong data-tooltip-id="prob-tooltip" data-tooltip-content="experimento" style={{ cursor: 'help' }}>
            Experimento <VscInfo size={12} />:
          </strong> seleccionar 1 dato al azar de la muestra.
        </p>

        <div style={{ marginBottom: '1.5rem', width: '100%' }}>
          <p style={{ marginBottom: '0.8rem', fontWeight: 'bold', color: 'var(--color-sky)' }}>
            <span data-tooltip-id="prob-tooltip" data-tooltip-content="muestral" style={{ cursor: 'help' }}>
              Espacio muestral (valores únicos ordenados) <VscInfo size={14} />:
            </span>
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
            <span data-tooltip-id="prob-tooltip" data-tooltip-content="evento" style={{ cursor: 'help' }}>
              Definir evento E (condición lógica) <VscInfo size={14} />:
            </span>
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
          <div 
            data-tooltip-id="prob-tooltip" 
            data-tooltip-content="calculo"
            style={{ 
              marginTop: '2rem', 
              width: '100%', 
              padding: '1.5rem', 
              background: resultado.error ? 'rgba(222, 68, 59, 0.1)' : 'rgba(202, 244, 56, 0.1)', 
              borderRadius: '12px', 
              border: `1px solid ${resultado.error ? 'var(--color-red)' : 'var(--color-lime)'}`,
              cursor: 'help'
            }}
          >
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

      <Tooltip 
        id="prob-tooltip" 
        style={{ backgroundColor: 'rgba(6, 0, 16, 0.95)', color: '#fff', borderRadius: '12px', zIndex: 100 }}
        render={({ content }) => (
          <div style={{ textAlign: 'left', padding: '10px', maxWidth: '250px' }}>
            <strong style={{ color: 'var(--color-lime)', display: 'block', marginBottom: '6px' }}>{probFormulas[content]?.titulo}</strong>
            <p style={{ margin: '8px 0', fontSize: '1.1rem', color: 'var(--color-sky)' }}>{probFormulas[content]?.formula}</p>
            <small style={{ color: '#aaa' }}>{probFormulas[content]?.desc}</small>
          </div>
        )}
      />
    </div>
  );
};

export default Probabilidad;
