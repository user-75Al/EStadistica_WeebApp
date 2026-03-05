import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import { VscInfo } from 'react-icons/vsc';
import ExplicacionProcedimiento from '../componentes/ExplicacionProcedimiento';
import 'react-tooltip/dist/react-tooltip.css';

const arbolInfo = {
  'main': {
    titulo: "Análisis Multietapa",
    formula: "S = {e₁, e₂, ...}",
    desc: "Método gráfico para representar todos los eventos posibles de un experimento aleatorio que tiene varios pasos."
  },
  'multiplicativa': { 
    titulo: "Regla Multiplicativa", 
    formula: "N = n₁ × n₂ × ... × nₖ", 
    desc: "El total de combinaciones es el producto de las opciones de cada etapa." 
  }
};

const ArbolPage = () => {
  const [pasosData, setPasosData] = useState([
    { nombre: 'Camiseta', opciones: ['Roja', 'Azul', 'Verde'] },
    { nombre: 'Pantalón', opciones: ['Jeans', 'Short'] },
    { nombre: 'Zapato', opciones: ['Tenis', 'Botas'] }
  ]);

  const updatePaso = (index, field, value) => {
    const updated = [...pasosData];
    if (field === 'opciones') updated[index][field] = value.split(',').map(o => o.trim()).filter(o => o !== '');
    else updated[index][field] = value;
    setPasosData(updated);
  };

  const total = pasosData.reduce((acc, p) => acc * (p.opciones.length || 0), 1);

  const pasosExplicacion = [
    { titulo: "Principio de Conteo", desc: "La regla multiplicativa nos dice que si un evento ocurre en varias etapas, el número total de formas es el producto de las opciones de cada etapa." },
    { titulo: "Diagrama de Árbol", desc: "Es una representación gráfica que permite visualizar todas las rutas posibles. Cada ramificación representa una opción disponible." },
    { titulo: "Espacio Muestral", desc: `En este caso, tienes ${pasosData.length} etapas que generan un total de ${total} combinaciones únicas posibles.` }
  ];

  const generateTree = () => {
    let output = "Inicio\n";
    const buildTree = (pIndex, indent = "") => {
      if (pIndex >= pasosData.length) return "";
      const currentPaso = pasosData[pIndex];
      let str = "";
      currentPaso.opciones.forEach((op, idx) => {
        const isLast = idx === currentPaso.opciones.length - 1;
        const branch = isLast ? " └─ " : " ├─ ";
        str += `${indent}${branch}${op}`;
        if (pIndex < pasosData.length - 1) {
          const nextPasosOp = buildTree(pIndex + 1, indent + (isLast ? "    " : " │  "));
          str += `\n${nextPasosOp}`;
        } else str += "\n";
      });
      return str;
    };
    return output + buildTree(0);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="calculos-page" style={{ paddingTop: '100px' }}>
      <div className="results-header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <h2>Diagrama de Árbol</h2>
        <span data-tooltip-id="tree-tooltip" data-tooltip-content="main" style={{ cursor: 'help' }}>
          <VscInfo size={24} style={{ color: 'var(--color-sky)' }} />
        </span>
      </div>

      <div className="results-flex" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div className="results-section table-section" style={{ flex: '1 1 300px' }}>
          <h3>Pasos de la Decisión</h3>
          {pasosData.map((p, i) => (
            <div key={i} className="stat-card" style={{ marginBottom: '1rem', alignItems: 'flex-start', padding: '1rem' }}>
              <input className="input" style={{ marginBottom: '0.5rem' }} value={p.nombre} onChange={(e) => updatePaso(i, 'nombre', e.target.value)} />
              <input className="input" placeholder="Opciones..." value={p.opciones.join(', ')} onChange={(e) => updatePaso(i, 'opciones', e.target.value)} />
            </div>
          ))}
          
          <div className="stat-card" data-tooltip-id="tree-tooltip" data-tooltip-content="multiplicativa" style={{ marginTop: '2rem', background: 'var(--color-blue)', cursor: 'help' }}>
            <span className="stat-label" style={{ color: 'white' }}>Total Combinaciones <VscInfo size={14} /></span>
            <span className="stat-value" style={{ color: 'var(--color-lime)', fontSize: '2rem' }}>{total}</span>
          </div>
        </div>

        <div className="results-section charts-section" style={{ flex: '2 1 450px' }}>
          <h3>Visualización</h3>
          <pre style={{ background: 'rgba(0,0,0,0.5)', padding: '2rem', borderRadius: '12px', fontFamily: 'monospace', color: 'var(--color-sky)', border: '1px solid #444', overflow: 'auto', maxHeight: '600px' }}>{generateTree()}</pre>
        </div>
      </div>

      <ExplicacionProcedimiento pasos={pasosExplicacion} />

      <Tooltip id="tree-tooltip" style={{ backgroundColor: 'rgba(6, 0, 16, 0.95)', color: '#fff', zIndex: 100 }}
        border="1px solid var(--color-lime)"
        render={({ content }) => (
          <div style={{ textAlign: 'left', padding: '10px', maxWidth: '250px' }}>
            <strong style={{ color: 'var(--color-lime)', display: 'block', marginBottom: '6px' }}>{arbolInfo[content]?.titulo}</strong>
            <p style={{ margin: '8px 0', fontSize: '1.1rem', color: 'var(--color-sky)' }}>{arbolInfo[content]?.formula}</p>
            <small style={{ color: '#aaa' }}>{arbolInfo[content]?.desc}</small>
          </div>
        )}
      />
    </motion.div>
  );
};

export default ArbolPage;
