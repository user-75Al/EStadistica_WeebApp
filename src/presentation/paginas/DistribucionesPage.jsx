import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import { VscInfo } from 'react-icons/vsc';
import { calcularDistribuciones } from '../../core/casos_de_uso/calcularDistribuciones';
import ExplicacionProcedimiento from '../componentes/ExplicacionProcedimiento';
import 'react-tooltip/dist/react-tooltip.css';
import '../estilos/App.css';

const distInfo = {
  'main': {
    titulo: "Probabilidad Teórica",
    formula: "P(X)",
    desc: "Uso de modelos matemáticos para asignar probabilidades a los resultados de un experimento antes de que este ocurra."
  },
  'binomial': { titulo: "Distribución Binomial", formula: "P(X=k) = (nCk) p^k (1-p)^(n-k)", desc: "Mide la probabilidad de obtener k éxitos en n ensayos." },
  'poisson': { titulo: "Distribución de Poisson", formula: "P(X=k) = (e^-λ * λ^k) / k!", desc: "Probabilidad de eventos en un intervalo fijo." },
  'normal': { titulo: "Distribución Normal", formula: "Z = (x - μ) / σ", desc: "La campana de Gauss. Se usa el valor Z para tipificar." }
};

const DistribucionesPage = () => {
  const [tipo, setTipo] = useState('binomial');
  const [params, setParams] = useState({ n: 10, p: 0.5, k: 5, lambda: 2, media: 0, desviacion: 1, x: 1 });
  const [resultado, setResultado] = useState(null);

  const handleCalcular = () => {
    let res;
    if (tipo === 'binomial') res = calcularDistribuciones.binomial(params.n, params.p, params.k);
    else if (tipo === 'poisson') res = calcularDistribuciones.poisson(params.lambda, params.k);
    else res = calcularDistribuciones.normal(params.media, params.desviacion, params.x);
    setResultado(res);
  };

  const pasos = [
    { titulo: "Distribución Binomial", desc: "Se usa para experimentos con solo dos resultados posibles (éxito/fracaso). Requiere un número fijo de ensayos (n) y una probabilidad constante (p)." },
    { titulo: "Distribución de Poisson", desc: "Útil para contar eventos raros que ocurren en un tiempo o espacio determinado. Se basa en el promedio de ocurrencias (lambda)." },
    { titulo: "Distribución Normal", desc: "Es la más importante en estadística. Permite calcular qué tan alejado está un valor (x) del promedio (media) usando desviaciones estándar." }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="calculos-page" style={{ paddingTop: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
        <h2>Probabilidad Teórica</h2>
        <span data-tooltip-id="dist-tooltip" data-tooltip-content="main" style={{ cursor: 'help' }}>
          <VscInfo size={24} style={{ color: 'var(--color-sky)' }} />
        </span>
      </div>
      <p style={{ color: 'var(--color-gray)', marginBottom: '2rem' }}>Calcula distribuciones discretas y continuas.</p>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {['binomial', 'poisson', 'normal'].map(t => (
          <button key={t} onClick={() => { setTipo(t); setResultado(null); }} className="send-button"
            style={{ background: tipo === t ? 'var(--color-blue)' : 'var(--color-dark)', border: `1px solid ${tipo === t ? 'var(--color-lime)' : 'var(--color-gray)'}`, flex: 1 }}>
            {t}
          </button>
        ))}
      </div>

      <div className="stat-card" style={{ padding: '2rem', textAlign: 'left', alignItems: 'flex-start' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-sky)' }}>Parámetros ({tipo})</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', width: '100%' }}>
          {tipo === 'binomial' && (
            <>
              <div><label>n (Ensayos)</label><input type="number" className="input" value={params.n} onChange={e => setParams({...params, n: Number(e.target.value)})} /></div>
              <div><label>p (Probabilidad)</label><input type="number" step="0.1" className="input" value={params.p} onChange={e => setParams({...params, p: Number(e.target.value)})} /></div>
              <div><label>k (Éxitos)</label><input type="number" className="input" value={params.k} onChange={e => setParams({...params, k: Number(e.target.value)})} /></div>
            </>
          )}
          {tipo === 'poisson' && (
            <>
              <div><label>λ (Lambda)</label><input type="number" step="0.1" className="input" value={params.lambda} onChange={e => setParams({...params, lambda: Number(e.target.value)})} /></div>
              <div><label>k (Eventos)</label><input type="number" className="input" value={params.k} onChange={e => setParams({...params, k: Number(e.target.value)})} /></div>
            </>
          )}
          {tipo === 'normal' && (
            <>
              <div><label>μ (Media)</label><input type="number" className="input" value={params.media} onChange={e => setParams({...params, media: Number(e.target.value)})} /></div>
              <div><label>σ (Desv. Est.)</label><input type="number" className="input" value={params.desviacion} onChange={e => setParams({...params, desviacion: Number(e.target.value)})} /></div>
              <div><label>x (Valor)</label><input type="number" className="input" value={params.x} onChange={e => setParams({...params, x: Number(e.target.value)})} /></div>
            </>
          )}
        </div>
        <button className="send-button" style={{ marginTop: '30px', width: '100%' }} onClick={handleCalcular}>Calcular</button>

        {resultado && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(202, 244, 56, 0.1)', borderRadius: '12px', border: '1px solid var(--color-lime)', width: '100%' }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-lime)' }}>
              {tipo === 'normal' ? `Z = ${resultado.z}` : `P = ${resultado.porcentaje}%`}
            </p>
          </div>
        )}
      </div>

      <ExplicacionProcedimiento pasos={pasos} />

      <Tooltip id="dist-tooltip" style={{ backgroundColor: 'rgba(6, 0, 16, 0.95)', color: '#fff', borderRadius: '12px', zIndex: 100 }}
        render={({ content }) => (
          <div style={{ textAlign: 'left', padding: '10px', maxWidth: '250px' }}>
            <strong style={{ color: 'var(--color-lime)', display: 'block', marginBottom: '6px' }}>{distInfo[content]?.titulo}</strong>
            <p style={{ margin: '8px 0', fontSize: '1.1rem', color: 'var(--color-sky)' }}>{distInfo[content]?.formula}</p>
            <small style={{ color: '#aaa' }}>{distInfo[content]?.desc}</small>
          </div>
        )}
      />
    </motion.div>
  );
};

export default DistribucionesPage;
