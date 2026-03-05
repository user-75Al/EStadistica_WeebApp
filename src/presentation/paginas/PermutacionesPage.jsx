import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import { VscInfo } from 'react-icons/vsc';
import ExplicacionProcedimiento from '../componentes/ExplicacionProcedimiento';
import { generateCombinatoriaAI } from '../utils/insightGenerator';
import 'react-tooltip/dist/react-tooltip.css';

const helperContent = {
  'main': {
    titulo: "Análisis Combinatorio",
    formula: "Principios de Conteo",
    desc: "Rama de las matemáticas que estudia las diversas formas de agrupar y ordenar elementos de un conjunto."
  },
  'factorial': { titulo: "Factorial (n!)", formula: "n! = n × (n-1) × ... × 1", desc: "Producto de todos los números enteros positivos desde 1 hasta n." },
  'permutacion': { titulo: "Permutación P(n, r)", formula: "n! / (n - r)!", desc: "Arreglo de r elementos donde EL ORDEN SÍ IMPORTA." },
  'combinacion': { titulo: "Combinación C(n, r)", formula: "n! / [r!(n - r)!]", desc: "Selección de r elementos donde EL ORDEN NO IMPORTA." }
};

const PermutacionesPage = () => {
  const [n, setN] = useState(10);
  const [r, setR] = useState(3);

  const factorial = (num) => {
    let result = 1;
    for (let i = 2; i <= num; i++) result *= i;
    return result;
  };

  const p = n < r ? 0 : factorial(n) / factorial(n - r);
  const c = n < r ? 0 : factorial(n) / (factorial(r) * factorial(n - r));

  const pasosBasicos = [
    { titulo: "Factorial (n!)", desc: "Es la base de la combinatoria. Multiplicamos todos los números desde 1 hasta el total para conocer todas las formas posibles de organizar los elementos." },
    { titulo: "Permutaciones", desc: "Se usan cuando el orden de los elementos es importante (ej: posiciones en una carrera). Aplicamos la fórmula n! / (n-r)!." },
    { titulo: "Combinaciones", desc: "Se usan cuando el orden NO importa (ej: elegir personas para un comité). Es igual a la permutación pero dividida entre r! para quitar duplicados por orden." }
  ];

  const iaPasos = generateCombinatoriaAI(n, r, p, c).map(text => ({
    titulo: "🤖 IA ESTRUCTURAL",
    desc: text,
    formula: "Espacio Muestral"
  }));

  const pasosFinales = [...pasosBasicos, ...iaPasos];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="calculos-page" style={{ paddingTop: '100px' }}>
      <div className="results-header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <h2>Permutaciones y Combinaciones</h2>
        <span data-tooltip-id="perm-tooltip" data-tooltip-content="main" style={{ cursor: 'help' }}>
          <VscInfo size={24} style={{ color: 'var(--color-sky)' }} />
        </span>
      </div>

      <div className="form-container" style={{ margin: '0 auto 2rem', maxWidth: '800px' }}>
        <div className="form">
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label className="c1">Valor de n (Total)</label>
              <input className="input" type="number" value={n} onChange={(e) => setN(Number(e.target.value))} />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label className="c1">Valor de r (Selección)</label>
              <input className="input" type="number" value={r} onChange={(e) => setR(Number(e.target.value))} />
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" data-tooltip-id="perm-tooltip" data-tooltip-content="factorial" style={{ cursor: 'help' }}>
          <span className="stat-label">n! (Factorial) <VscInfo size={14} /></span>
          <span className="stat-value">{factorial(n).toLocaleString()}</span>
        </div>
        <div className="stat-card" data-tooltip-id="perm-tooltip" data-tooltip-content="permutacion" style={{ cursor: 'help' }}>
          <span className="stat-label">P(n, r) (Permutaciones) <VscInfo size={14} /></span>
          <span className="stat-value">{p.toLocaleString()}</span>
        </div>
        <div className="stat-card" data-tooltip-id="perm-tooltip" data-tooltip-content="combinacion" style={{ cursor: 'help' }}>
          <span className="stat-label">C(n, r) (Combinaciones) <VscInfo size={14} /></span>
          <span className="stat-value">{c.toLocaleString()}</span>
        </div>
      </div>

      <ExplicacionProcedimiento pasos={pasosFinales} />

      <Tooltip id="perm-tooltip" style={{ backgroundColor: 'rgba(6, 0, 16, 0.95)', color: '#fff', borderRadius: '12px', zIndex: 100 }}
        render={({ content }) => (
          <div style={{ textAlign: 'left', padding: '10px', maxWidth: '250px' }}>
            <strong style={{ color: 'var(--color-lime)', display: 'block', marginBottom: '6px' }}>{helperContent[content]?.titulo}</strong>
            <p style={{ margin: '8px 0', fontSize: '1.1rem', color: 'var(--color-sky)' }}>{helperContent[content]?.formula}</p>
            <small style={{ color: '#aaa' }}>{helperContent[content]?.desc}</small>
          </div>
        )}
      />
    </motion.div>
  );
};

export default PermutacionesPage;
