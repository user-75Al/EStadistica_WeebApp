import React from 'react';
import { Tooltip } from 'react-tooltip';
import { VscInfo, VscCopy } from 'react-icons/vsc';
import { toast } from 'react-hot-toast';
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

const TablaFrecuencias = ({ frecuencias, hoverIndex }) => {
  const copiarTabla = () => {
    const headers = 'Valor,fi,fr,Fi,Fr';
    const rows = frecuencias.map(f => `${f.valor},${f.fi},${f.fr},${f.Fi},${f.Fr}`).join('\n');
    navigator.clipboard.writeText(`${headers}\n${rows}`);
    toast.success('Tabla de frecuencias copiada al portapapeles');
  };

  return (
    <div className="table-wrapper glass" style={{ position: 'relative' }}>
      <button 
        onClick={copiarTabla}
        className="copy-button-mini"
        title="Copiar tabla como CSV"
        style={{
          position: 'absolute', top: '-45px', right: '0',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          color: '#888', padding: '5px 12px', borderRadius: '8px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '0.8rem', transition: 'all 0.3s ease',
          backdropFilter: 'blur(5px)', zIndex: 10
        }}
      >
        <VscCopy /> Copiar Tabla CSV
      </button>

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
            <tr 
              key={index}
              style={{
                backgroundColor: hoverIndex === index ? 'rgba(202, 244, 56, 0.15)' : 'transparent',
                transition: 'background-color 0.2s ease'
              }}
            >
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
