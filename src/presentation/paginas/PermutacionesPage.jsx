import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PermutacionesPage = () => {
  const [n, setN] = useState(10);
  const [r, setR] = useState(3);

  // Función factorial con números normales (sin BigInt)
  const factorial = (n) => {
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const permutacion = (n, r) => {
    if (n < r) return 0;
    return factorial(n) / factorial(n - r);
  };

  const combinacion = (n, r) => {
    if (n < r) return 0;
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="calculos-page"
    >
      <div className="results-header" style={{ marginBottom: '2rem' }}>
        <h2>Permutaciones y Combinaciones</h2>
        <p>Introduce n (total) y r (selección) para calcular las posibilidades.</p>
      </div>

      <div className="form-container" style={{ margin: '0 auto 2rem', maxWidth: '800px' }}>
        <div className="form">
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label className="c1">Valor de n (Total)</label>
              <input 
                className="input" 
                type="number" 
                value={n} 
                onChange={(e) => setN(Number(e.target.value))}
                placeholder="n"
                min="0"
              />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label className="c1">Valor de r (Selección)</label>
              <input 
                className="input" 
                type="number" 
                value={r} 
                onChange={(e) => setR(Number(e.target.value))}
                placeholder="r"
                min="0"
                max={n}
              />
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', color: 'var(--color-gray)', fontSize: '0.9rem' }}>
            * Cálculos realizados con precisión estándar (máximo n=170 aprox.)
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">n! (Factorial de n)</span>
          <span className="stat-value" style={{ fontSize: '1.2rem', wordBreak: 'break-all', textAlign: 'center' }}>
            {factorial(n).toLocaleString()}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">P({n}, {r}) (Permutaciones)</span>
          <span className="stat-value" style={{ fontSize: '1.2rem', wordBreak: 'break-all', textAlign: 'center' }}>
            {permutacion(n, r).toLocaleString()}
          </span>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)', marginTop: '0.5rem' }}>Importa el orden</p>
        </div>
        <div className="stat-card">
          <span className="stat-label">C({n}, {r}) (Combinaciones)</span>
          <span className="stat-value" style={{ fontSize: '1.2rem', wordBreak: 'break-all', textAlign: 'center' }}>
            {combinacion(n, r).toLocaleString()}
          </span>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)', marginTop: '0.5rem' }}>No importa el orden</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PermutacionesPage;
