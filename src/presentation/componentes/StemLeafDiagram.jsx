import React, { useMemo, useState } from 'react';
import { VscArrowDown, VscArrowUp } from 'react-icons/vsc';
import '../estilos/App.css';

const StemLeafDiagram = ({ datos }) => {
  const [orden, setOrden] = useState('asc');

  const diagramData = useMemo(() => {
    if (!datos || datos.length === 0) return [];

    // 1. Ordenar datos
    const datosOrdenados = [...datos].sort((a, b) => a - b);
    
    // 2. Agrupar por tallo
    // Lógica: 
    // Para números >= 10: Tallo = decenas, Hoja = unidades
    // Para números < 10: Tallo = 0, Hoja = valor
    // Para decimales: Se asume parte entera como tallo y primer decimal como hoja
    const grupos = {};

    datosOrdenados.forEach(num => {
      let tallo, hoja;
      
      if (Number.isInteger(num)) {
        tallo = Math.floor(Math.abs(num) / 10);
        if (num < 0) tallo = -tallo;
        hoja = Math.abs(num) % 10;
      } else {
        // Manejo de decimales (1 cifra)
        tallo = Math.floor(num);
        hoja = Math.round((num - tallo) * 10);
      }

      if (!grupos[tallo]) {
        grupos[tallo] = [];
      }
      grupos[tallo].push(hoja);
    });

    // 3. Convertir a array y aplicar orden solicitado
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
        <h3 style={{ border: 'none', margin: 0 }}>Diagrama de Tallo y Hoja</h3>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className={`copy-button-mini ${orden === 'asc' ? 'active-btn' : ''}`}
            onClick={() => setOrden('asc')}
            style={orden === 'asc' ? { borderColor: 'var(--color-lime)', color: 'var(--color-lime)' } : {}}
          >
            <VscArrowUp /> Ascendente
          </button>
          <button 
            className={`copy-button-mini ${orden === 'desc' ? 'active-btn' : ''}`}
            onClick={() => setOrden('desc')}
            style={orden === 'desc' ? { borderColor: 'var(--color-lime)', color: 'var(--color-lime)' } : {}}
          >
            <VscArrowDown /> Descendente
          </button>
        </div>
      </div>

      <div className="glass" style={{ padding: '2rem', borderLeft: '4px solid var(--color-lime)' }}>
        <div className="mono" style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
          {diagramData.map((row, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '5px 0' }}>
              <div style={{ 
                minWidth: '40px', 
                textAlign: 'right', 
                fontWeight: 'bold', 
                color: 'var(--color-lime)',
                borderRight: '2px solid rgba(255,255,255,0.2)',
                paddingRight: '1rem'
              }}>
                {row.tallo}
              </div>
              <div style={{ color: '#fff', letterSpacing: '4px' }}>
                {row.hojas.join(' ')}
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--color-gray)', fontStyle: 'italic' }}>
          * Leyenda: {diagramData[0]?.tallo} | {diagramData[0]?.hojas[0]} representa {diagramData[0]?.tallo}{diagramData[0]?.hojas[0]}
        </div>
      </div>
    </div>
  );
};

export default StemLeafDiagram;
