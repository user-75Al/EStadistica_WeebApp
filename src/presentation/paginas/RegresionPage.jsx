import React, { useState, useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Tooltip } from 'react-tooltip';
import { VscInfo } from 'react-icons/vsc';
import { calcularRegresion } from '../../core/casos_de_uso/calcularRegresion';
import ExplicacionProcedimiento from '../componentes/ExplicacionProcedimiento';
import { generateRegresionAI } from '../utils/insightGenerator';
import 'react-tooltip/dist/react-tooltip.css';
import '../estilos/App.css';

const regInfo = {
  'main': {
    titulo: "Análisis de Regresión",
    formula: "Y = f(X) + ε",
    desc: "Proceso estadístico para estimar las relaciones entre una variable dependiente y una o más variables independientes."
  },
  'ecuacion': { titulo: "Ecuación de Regresión", formula: "y = mx + b", desc: "Recta que mejor se ajusta a los datos dispersos." },
  'pearson': { titulo: "Pearson (r)", formula: "-1 ≤ r ≤ 1", desc: "Mide la fuerza y dirección de la relación lineal." },
  'determinacion': { titulo: "Coeficiente R²", formula: "r²", desc: "Porcentaje de variación explicada por el modelo." }
};

const RegresionPage = () => {
  const [inputX, setInputX] = useState('');
  const [inputY, setInputY] = useState('');
  const [resultados, setResultados] = useState(null);

  const handleCalcular = () => {
    const x = inputX.split(/[\s,]+/).filter(n => n !== "").map(Number);
    const y = inputY.split(/[\s,]+/).filter(n => n !== "").map(Number);
    if (x.length !== y.length || x.length < 2) { alert("Listas deben ser iguales."); return; }
    const res = calcularRegresion(x, y);
    setResultados({ ...res, x, y });
  };

  const pasosBasicos = [
    { titulo: "Correlación (r)", desc: "Indica qué tan fuertemente están relacionadas las dos variables. Un valor cercano a 1 o -1 indica una relación perfecta, mientras que cerca de 0 indica que no hay relación." },
    { titulo: "Recta de Regresión", desc: "Es la línea que minimiza la distancia entre todos los puntos. Su ecuación y = mx + b nos permite predecir valores de Y si conocemos el valor de X." },
    { titulo: "Determinación (R²)", desc: "Es el cuadrado del coeficiente de correlación. Representa qué tanta confianza podemos tener en nuestro modelo de predicción." }
  ];

  const iaPasos = resultados ? generateRegresionAI(resultados).map(text => ({
    titulo: "🤖 IA PREDICTIVA",
    desc: text,
    formula: "Correlación Maestro"
  })) : [];

  const pasosFinales = [...pasosBasicos, ...iaPasos];

  const chartData = useMemo(() => {
    if (!resultados) return null;
    const minX = Math.min(...resultados.x);
    const maxX = Math.max(...resultados.x);
    const rectaPoints = [
      { x: minX, y: Number(resultados.pendiente) * minX + Number(resultados.interseccion) },
      { x: maxX, y: Number(resultados.pendiente) * maxX + Number(resultados.interseccion) }
    ];
    return {
      datasets: [
        { label: 'Datos Reales', data: resultados.x.map((val, i) => ({ x: val, y: resultados.y[i] })), backgroundColor: '#006BB4', pointRadius: 6 },
        { label: 'Tendencia', data: rectaPoints, type: 'line', borderColor: '#DE443B', borderWidth: 2, pointRadius: 0, fill: false }
      ]
    };
  }, [resultados]);

  return (
    <div className="calculos-page" style={{ paddingTop: '100px' }}>
      <div className="results-header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <h2>Correlación y Regresión Lineal</h2>
        <span data-tooltip-id="reg-tooltip" data-tooltip-content="main" style={{ cursor: 'help' }}>
          <VscInfo size={24} style={{ color: 'var(--color-sky)' }} />
        </span>
      </div>

      <div className="results-flex" style={{ gap: '20px' }}>
        <div className="stat-card" style={{ flex: 1, padding: '1.5rem', alignItems: 'flex-start' }}>
          <label style={{ fontSize: '0.85rem', marginBottom: '5px' }}>Variable X</label>
          <textarea className="input" style={{height:'35px', marginBottom: '15px'}} placeholder="Ej: 1, 2, 3..." value={inputX} onChange={e => setInputX(e.target.value)} />
          <label style={{ fontSize: '0.85rem', marginBottom: '5px' }}>Variable Y</label>
          <textarea className="input" style={{height:'35px', marginBottom: '15px'}} placeholder="Ej: 2, 4, 6..." value={inputY} onChange={e => setInputY(e.target.value)} />
          <button className="send-button" style={{ width: '100%' }} onClick={handleCalcular}>Calcular</button>
        </div>

        {resultados && (
          <div className="stat-card" style={{ flex: 1, padding: '1.5rem' }}>
            <div data-tooltip-id="reg-tooltip" data-tooltip-content="ecuacion" style={{cursor:'help', marginBottom:'10px', width: '100%'}}>
              <strong>Ecuación:</strong> <span style={{color: 'var(--color-lime)'}}>{resultados.ecuacion}</span> <VscInfo size={12}/>
            </div>
            <div data-tooltip-id="reg-tooltip" data-tooltip-content="pearson" style={{cursor:'help', marginBottom:'10px', width: '100%'}}>
              <strong>Pearson:</strong> {resultados.correlacion} <VscInfo size={12}/>
            </div>
            <div data-tooltip-id="reg-tooltip" data-tooltip-content="determinacion" style={{cursor:'help', width: '100%'}}>
              <strong>R²:</strong> {resultados.determinacion} <VscInfo size={12}/>
            </div>
          </div>
        )}
      </div>

      {chartData && (
        <div className="chart-card" style={{ marginTop: '30px', height: '400px' }}>
          <Scatter data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      )}

      <ExplicacionProcedimiento pasos={pasosFinales} />

      <Tooltip id="reg-tooltip" style={{ backgroundColor: 'rgba(6, 0, 16, 0.95)', color: '#fff', borderRadius: '12px', zIndex: 100 }}
        render={({ content }) => (
          <div style={{ textAlign: 'left', padding: '10px', maxWidth: '250px' }}>
            <strong style={{ color: 'var(--color-lime)', display: 'block', marginBottom: '6px' }}>{regInfo[content]?.titulo}</strong>
            <p style={{ margin: '8px 0', fontSize: '1.1rem', color: 'var(--color-sky)' }}>{regInfo[content]?.formula}</p>
            <small style={{ color: '#aaa' }}>{regInfo[content]?.desc}</small>
          </div>
        )}
      />
    </div>
  );
};

export default RegresionPage;
