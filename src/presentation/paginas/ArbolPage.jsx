import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ArbolPage = () => {
  const [pasos, setPasos] = useState([
    { nombre: 'Camiseta', opciones: ['Roja', 'Azul', 'Verde'] },
    { nombre: 'Pantalón', opciones: ['Jeans', 'Short'] },
    { nombre: 'Zapato', opciones: ['Tenis', 'Botas'] }
  ]);

  const addPaso = () => {
    if (pasos.length < 4) {
      setPasos([...pasos, { nombre: `Paso ${pasos.length + 1}`, opciones: [] }]);
    }
  };

  const updatePaso = (index, field, value) => {
    const updated = [...pasos];
    if (field === 'opciones') {
      updated[index][field] = value.split(',').map(o => o.trim()).filter(o => o !== '');
    } else {
      updated[index][field] = value;
    }
    setPasos(updated);
  };

  const removePaso = (index) => {
    if (pasos.length > 2) {
      setPasos(pasos.filter((_, i) => i !== index));
    }
  };

  const totalCombinaciones = pasos.reduce((acc, p) => acc * (p.opciones.length || 0), 1);

  const generateTree = () => {
    let output = "Inicio\n";
    const buildTree = (pIndex, indent = "") => {
      if (pIndex >= pasos.length) return "";
      const currentPaso = pasos[pIndex];
      let str = "";
      currentPaso.opciones.forEach((op, idx) => {
        const isLast = idx === currentPaso.opciones.length - 1;
        const branch = isLast ? " └─ " : " ├─ ";
        str += `${indent}${branch}${op}`;
        
        if (pIndex < pasos.length - 1) {
          const nextPasosOp = buildTree(pIndex + 1, indent + (isLast ? "    " : " │  "));
          str += `\n${nextPasosOp}`;
        } else {
          str += "\n";
        
        }
      });
      return str;
    };
    return output + buildTree(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="calculos-page"
    >
      <div className="results-header" style={{ marginBottom: '2rem' }}>
        <h2>Regla Multiplicativa y Diagrama de Árbol</h2>
        <p>Configura los pasos y opciones para visualizar el árbol de decisiones.</p>
      </div>

      <div className="results-flex" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div className="results-section table-section" style={{ flex: '1 1 300px' }}>
          <h3>Pasos de la Decisión</h3>
          {pasos.map((p, i) => (
            <div key={i} className="stat-card" style={{ marginBottom: '1rem', alignItems: 'flex-start', padding: '1rem' }}>
              <input 
                className="input" 
                style={{ marginBottom: '0.5rem', fontSize: '1rem', padding: '10px' }}
                value={p.nombre} 
                onChange={(e) => updatePaso(i, 'nombre', e.target.value)}
              />
              <input 
                className="input" 
                style={{ fontSize: '0.9rem', padding: '8px' }}
                placeholder="Opciones (separadas por coma)" 
                value={p.opciones.join(', ')} 
                onChange={(e) => updatePaso(i, 'opciones', e.target.value)}
              />
              {pasos.length > 2 && (
                <button 
                  onClick={() => removePaso(i)} 
                  style={{ background: 'var(--color-red)', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '4px', marginTop: '5px', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Eliminar paso
                </button>
              )}
            </div>
          ))}
          {pasos.length < 4 && (
            <button className="send-button" onClick={addPaso} style={{ width: '100%', borderRadius: '8px', marginTop: '1rem' }}>
              Agregar Paso
            </button>
          )}

          <div className="stat-card" style={{ marginTop: '2rem', background: 'var(--color-blue)' }}>
            <span className="stat-label" style={{ color: 'white' }}>Total de Combinaciones</span>
            <span className="stat-value" style={{ color: 'var(--color-lime)', fontSize: '2rem' }}>{totalCombinaciones}</span>
          </div>
        </div>

        <div className="results-section charts-section" style={{ flex: '2 1 450px' }}>
          <h3>Visualización (Diagrama de Árbol)</h3>
          <pre style={{ 
            background: 'rgba(0,0,0,0.5)', 
            padding: '2rem', 
            borderRadius: '12px', 
            fontFamily: 'monospace', 
            color: 'var(--color-sky)',
            border: '1px solid #444',
            fontSize: '1.1rem',
            overflow: 'auto',
            maxHeight: '600px'
          }}>
            {generateTree()}
          </pre>
        </div>
      </div>
    </motion.div>
  );
};

export default ArbolPage;
