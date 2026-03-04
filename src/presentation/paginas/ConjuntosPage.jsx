import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import { VscInfo } from 'react-icons/vsc';
import ExplicacionProcedimiento from '../componentes/ExplicacionProcedimiento';
import 'react-tooltip/dist/react-tooltip.css';

const conjuntosInfo = {
  'main': {
    titulo: "Teoría de Conjuntos",
    formula: "A, B, C...",
    desc: "Estudio de las propiedades y relaciones de colecciones abstractas de objetos."
  },
  'union': { titulo: "Unión (A ∪ B)", formula: "{x | x ∈ A o x ∈ B}", desc: "Conjunto de todos los elementos que pertenecen a A, a B o a ambos." },
  'interseccion': { titulo: "Intersección (A ∩ B)", formula: "{x | x ∈ A y x ∈ B}", desc: "Conjunto de elementos que pertenecen simultáneamente a A y a B." },
  'difAB': { titulo: "Diferencia (A − B)", formula: "{x | x ∈ A y x ∉ B}", desc: "Elementos que están en A pero NO están en B." },
  'difBA': { titulo: "Diferencia (B − A)", formula: "{x | x ∈ B y x ∉ A}", desc: "Elementos que están en B pero NO están en A." }
};

const ConjuntosPage = () => {
  const [setA, setSetA] = useState('');
  const [setB, setSetB] = useState('');
  const [resultados, setResultados] = useState(null);

  const handleCalcular = () => {
    const a = new Set(setA.split(',').map(n => n.trim()).filter(n => n !== ''));
    const b = new Set(setB.split(',').map(n => n.trim()).filter(n => n !== ''));
    setResultados({
      union: Array.from(new Set([...a, ...b])).sort(),
      interseccion: Array.from(new Set([...a].filter(x => b.has(x)))).sort(),
      diferenciaAB: Array.from(new Set([...a].filter(x => !b.has(x)))).sort(),
      diferenciaBA: Array.from(new Set([...b].filter(x => !a.has(x)))).sort()
    });
  };

  const pasos = [
    { titulo: "Unión de Conjuntos", desc: "Consiste en agrupar todos los elementos de ambos conjuntos. Si un elemento aparece en ambos, solo se escribe una vez en el resultado final." },
    { titulo: "Intersección", desc: "Aquí buscamos únicamente los elementos que se repiten. Es el área donde ambos conjuntos se solapan en un diagrama de Venn." },
    { titulo: "Diferencia Relativa", desc: "Calculamos qué elementos son exclusivos de un conjunto. A-B elimina de A todo lo que también pertenezca a B." }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="calculos-page" style={{ paddingTop: '100px' }}>
      <div className="results-header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <h2>Operaciones con Conjuntos</h2>
        <span data-tooltip-id="conj-tooltip" data-tooltip-content="main" style={{ cursor: 'help' }}>
          <VscInfo size={24} style={{ color: 'var(--color-sky)' }} />
        </span>
      </div>

      <div className="form-container" style={{ margin: '0 auto 2rem', maxWidth: '100%' }}>
        <div className="form">
          <label className="c1">Conjunto A (ej: 1,2,3)</label>
          <input className="input" type="text" value={setA} onChange={(e) => setSetA(e.target.value)} placeholder="Ingrese elementos" />
          <label className="c1" style={{ marginTop: '1rem', display: 'block' }}>Conjunto B (ej: 3,4,5)</label>
          <input className="input" type="text" value={setB} onChange={(e) => setSetB(e.target.value)} placeholder="Ingrese elementos" />
          <button className="send-button" onClick={handleCalcular} style={{ width: '100%', marginTop: '1rem' }}>Calcular Operaciones</button>
        </div>
      </div>

      {resultados && (
        <>
          <div className="stats-grid">
            <div className="stat-card" data-tooltip-id="conj-tooltip" data-tooltip-content="union" style={{ cursor: 'help' }}>
              <span className="stat-label">A ∪ B (Unión) <VscInfo size={14} /></span>
              <span className="stat-value">{`{ ${resultados.union.join(', ')} }`}</span>
            </div>
            <div className="stat-card" data-tooltip-id="conj-tooltip" data-tooltip-content="interseccion" style={{ cursor: 'help' }}>
              <span className="stat-label">A ∩ B (Intersección) <VscInfo size={14} /></span>
              <span className="stat-value">{resultados.interseccion.length > 0 ? `{ ${resultados.interseccion.join(', ')} }` : '∅'}</span>
            </div>
            <div className="stat-card" data-tooltip-id="conj-tooltip" data-tooltip-content="difAB" style={{ cursor: 'help' }}>
              <span className="stat-label">A − B (Diferencia) <VscInfo size={14} /></span>
              <span className="stat-value">{resultados.diferenciaAB.length > 0 ? `{ ${resultados.diferenciaAB.join(', ')} }` : '∅'}</span>
            </div>
            <div className="stat-card" data-tooltip-id="conj-tooltip" data-tooltip-content="difBA" style={{ cursor: 'help' }}>
              <span className="stat-label">B − A (Diferencia) <VscInfo size={14} /></span>
              <span className="stat-value">{resultados.diferenciaBA.length > 0 ? `{ ${resultados.diferenciaBA.join(', ')} }` : '∅'}</span>
            </div>
          </div>
          <ExplicacionProcedimiento pasos={pasos} />
        </>
      )}

      <Tooltip 
        id="conj-tooltip" 
        place="bottom"
        style={{ backgroundColor: 'rgba(6, 0, 16, 0.95)', color: '#fff', borderRadius: '12px', zIndex: 100 }}
        render={({ content }) => (
          <div style={{ textAlign: 'left', padding: '10px', maxWidth: '250px' }}>
            <strong style={{ color: 'var(--color-lime)', display: 'block', marginBottom: '6px' }}>{conjuntosInfo[content]?.titulo}</strong>
            <p style={{ margin: '8px 0', fontSize: '1.1rem', color: 'var(--color-sky)' }}>{conjuntosInfo[content]?.formula}</p>
            <small style={{ color: '#aaa' }}>{conjuntosInfo[content]?.desc}</small>
          </div>
        )}
      />
    </motion.div>
  );
};

export default ConjuntosPage;
