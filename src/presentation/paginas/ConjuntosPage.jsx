import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ConjuntosPage = () => {
  const [setA, setSetA] = useState('');
  const [setB, setSetB] = useState('');
  const [resultados, setResultados] = useState(null);

  const parseSet = (str) => {
    const numbers = str.replace(/[{}]/g, '').split(',').map(n => n.trim()).filter(n => n !== '');
    return new Set(numbers);
  };

  const handleCalcular = () => {
    const a = parseSet(setA);
    const b = parseSet(setB);

    const union = new Set([...a, ...b]);
    const interseccion = new Set([...a].filter(x => b.has(x)));
    const diferenciaAB = new Set([...a].filter(x => !b.has(x)));
    const diferenciaBA = new Set([...b].filter(x => !a.has(x)));

    setResultados({
      union: Array.from(union).sort(),
      interseccion: Array.from(interseccion).sort(),
      diferenciaAB: Array.from(diferenciaAB).sort(),
      diferenciaBA: Array.from(diferenciaBA).sort()
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="calculos-page"
    >
      <div className="results-header" style={{ marginBottom: '2rem' }}>
        <h2>Operaciones con Conjuntos</h2>
        <p>Define tus conjuntos A y B para calcular sus operaciones básicas.</p>
      </div>

      <div className="form-container" style={{ margin: '0 auto 2rem', maxWidth: '100%' }}>
        <div className="form">
          <label className="c1">Conjunto A (ej: 1,2,3,4,5,6)</label>
          <input 
            className="input" 
            type="text" 
            value={setA} 
            onChange={(e) => setSetA(e.target.value)}
            placeholder="Ingrese elementos separados por coma"
          />
          
          <label className="c1" style={{ marginTop: '1rem', display: 'block' }}>Conjunto B (ej: 4,5,6,7,8)</label>
          <input 
            className="input" 
            type="text" 
            value={setB} 
            onChange={(e) => setSetB(e.target.value)}
            placeholder="Ingrese elementos separados por coma"
          />

          <button className="send-button" onClick={handleCalcular} style={{ width: '100%', marginTop: '1rem' }}>
            Calcular Operaciones
          </button>
        </div>
      </div>

      {resultados && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">A ∪ B (Unión)</span>
            <span className="stat-value" style={{ fontSize: '1.2rem' }}>{`{ ${resultados.union.join(', ')} }`}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">A ∩ B (Intersección)</span>
            <span className="stat-value" style={{ fontSize: '1.2rem' }}>{resultados.interseccion.length > 0 ? `{ ${resultados.interseccion.join(', ')} }` : '∅'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">A − B (Diferencia)</span>
            <span className="stat-value" style={{ fontSize: '1.2rem' }}>{resultados.diferenciaAB.length > 0 ? `{ ${resultados.diferenciaAB.join(', ')} }` : '∅'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">B − A (Diferencia)</span>
            <span className="stat-value" style={{ fontSize: '1.2rem' }}>{resultados.diferenciaBA.length > 0 ? `{ ${resultados.diferenciaBA.join(', ')} }` : '∅'}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ConjuntosPage;
