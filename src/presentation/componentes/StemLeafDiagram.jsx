import React, { useMemo, useState } from 'react';
import { VscArrowDown, VscArrowUp, VscInfo } from 'react-icons/vsc';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import '../estilos/App.css';

const StemLeafDiagram = ({ datos }) => {
  const [orden, setOrden] = useState('asc');

  const diagramData = useMemo(() => {
    if (!datos || datos.length === 0) return [];

    const datosOrdenados = [...datos].sort((a, b) => a - b);
    const grupos = {};

    datosOrdenados.forEach(num => {
      let tallo, hoja;
      if (Number.isInteger(num)) {
        tallo = Math.floor(Math.abs(num) / 10);
        if (num < 0) tallo = -tallo;
        hoja = Math.abs(num) % 10;
      } else {
        tallo = Math.floor(num);
        hoja = Math.round((num - tallo) * 10);
      }
      if (!grupos[tallo]) grupos[tallo] = [];
      grupos[tallo].push(hoja);
    });

    const entries = Object.entries(grupos).map(([tallo, hojas]) => ({
      tallo: parseInt(tallo),
      hojas: hojas.sort((a, b) => orden === 'asc' ? a - b : b - a)
    }));

    return orden === 'asc' 
      ? entries.sort((a, b) => a.tallo - b.tallo)
      : entries.sort((a, b) => b.tallo - a.tallo);
  }, [datos, orden]);

  if (!datos || datos.length === 0) return null;

  return (
    <div className="results-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ border: 'none', margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Diagrama de Tallo y Hoja
          <span 
            data-tooltip-id="stem-leaf-info" 
            style={{ cursor: 'help', display: 'flex', alignItems: 'center' }}
          >
            <VscInfo size={18} style={{ color: 'var(--color-sky)' }} />
          </span>
        </h3>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="copy-button-mini"
            onClick={() => setOrden(orden === 'asc' ? 'desc' : 'asc')}
            style={{ padding: '8px 15px', fontSize: '0.85rem' }}
          >
            {orden === 'asc' ? <VscArrowUp /> : <VscArrowDown />} {orden.toUpperCase()}
          </button>
        </div>
      </div>

      <div className="glass" style={{ padding: '2rem', borderLeft: '5px solid var(--color-lime)' }}>
        <div className="mono" style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
          {diagramData.map((row, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '6px 0' }}>
              <div style={{ minWidth: '45px', textAlign: 'right', fontWeight: 'bold', color: 'var(--color-lime)', borderRight: '2px solid rgba(255,255,255,0.1)', paddingRight: '1rem' }}>
                {row.tallo}
              </div>
              <div style={{ color: '#fff', letterSpacing: '4px' }}>
                {row.hojas.join(' ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Tooltip 
        id="stem-leaf-info" 
        place="top"
        style={{ backgroundColor: '#162325', color: '#fff', zIndex: 9999, maxWidth: '300px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
        border="1px solid var(--color-lime)"
      >
        <div style={{ padding: '10px' }}>
          <strong style={{ color: 'var(--color-lime)', fontSize: '1rem', display: 'block', marginBottom: '8px' }}>Interpretación</strong>
          <p style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: '1.5' }}>
            El tallo (columna izquierda) representa la parte principal del número (decenas) y las hojas (derecha) representan las unidades.
          </p>
          <p style={{ fontSize: '0.8rem', marginTop: '10px', color: 'var(--color-sky)', fontWeight: 'bold' }}>
            Ejemplo: 2 | 1 4 representa los datos 21 y 24.
          </p>
        </div>
      </Tooltip>
    </div>
  );
};

export default StemLeafDiagram;
