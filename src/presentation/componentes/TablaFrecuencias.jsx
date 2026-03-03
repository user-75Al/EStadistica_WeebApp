import React from 'react';
import { Tooltip } from 'react-tooltip';
import { VscInfo } from 'react-icons/vsc';
import 'react-tooltip/dist/react-tooltip.css';
import '../estilos/App.css';

const tablaFormulas = {
  'valor': {
    titulo: "Valor (x)",
    formula: "xᵢ",
    desc: "Dato único observado en la muestra."
  },
  'fi': {
    titulo: "Frecuencia Absoluta",
    formula: "fᵢ",
    desc: "Número de veces que el valor se repite en la muestra."
  },
  'fr': {
    titulo: "Frecuencia Relativa",
    formula: "fᵣ = fᵢ / n",
    desc: "Proporción que representa el valor respecto al total."
  },
  'Fi': {
    titulo: "Frecuencia Absoluta Acumulada",
    formula: "Fᵢ = Σ fᵢ",
    desc: "Suma de las frecuencias absolutas hasta este valor."
  },
  'Fr': {
    titulo: "Frecuencia Relativa Acumulada",
    formula: "Fᵣ = Σ fᵣ",
    desc: "Suma de las frecuencias relativas hasta este valor."
  }
};

const TablaFrecuencias = ({ frecuencias }) => {
  return (
    <div className="table-wrapper">
      <table className="frecuencias-table">
        <thead>
          <tr>
            <th data-tooltip-id="tabla-tooltip" data-tooltip-content="valor">
              Valor <VscInfo size={12} />
            </th>
            <th data-tooltip-id="tabla-tooltip" data-tooltip-content="fi">
              fi <VscInfo size={12} />
            </th>
            <th data-tooltip-id="tabla-tooltip" data-tooltip-content="fr">
              fr <VscInfo size={12} />
            </th>
            <th data-tooltip-id="tabla-tooltip" data-tooltip-content="Fi">
              Fi <VscInfo size={12} />
            </th>
            <th data-tooltip-id="tabla-tooltip" data-tooltip-content="Fr">
              Fr <VscInfo size={12} />
            </th>
          </tr>
        </thead>
        <tbody>
          {frecuencias.map((fila, index) => (
            <tr key={index}>
              <td>{fila.valor}</td>
              <td>{fila.fi}</td>
              <td>{fila.fr}</td>
              <td>{fila.Fi}</td>
              <td>{fila.Fr}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Tooltip 
        id="tabla-tooltip" 
        style={{ backgroundColor: 'rgba(6, 0, 16, 0.95)', color: '#fff', borderRadius: '12px', zIndex: 100 }}
        render={({ content }) => (
          <div style={{ textAlign: 'left', padding: '10px', maxWidth: '250px' }}>
            <strong style={{ color: 'var(--color-lime)', display: 'block', marginBottom: '6px' }}>{tablaFormulas[content]?.titulo}</strong>
            <p style={{ margin: '8px 0', fontSize: '1.1rem', color: 'var(--color-sky)' }}>{tablaFormulas[content]?.formula}</p>
            <small style={{ color: '#aaa' }}>{tablaFormulas[content]?.desc}</small>
          </div>
        )}
      />
    </div>
  );
};

export default TablaFrecuencias;
