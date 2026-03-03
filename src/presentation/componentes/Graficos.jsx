import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  BarController,
  LineController
} from 'chart.js';
import { Chart, Bar, Line, Pie } from 'react-chartjs-2';
import { Tooltip } from 'react-tooltip';
import { VscInfo } from 'react-icons/vsc';
import 'react-tooltip/dist/react-tooltip.css';
import '../estilos/App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  BarController,
  LineController,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

const chartExplanations = {
  'histograma': {
    titulo: "Histograma y Polígono",
    formula: "fᵢ vs xᵢ",
    desc: "El histograma muestra la distribución de frecuencias absolutas. El polígono une los puntos medios para visualizar la tendencia de la distribución."
  },
  'ojiva': {
    titulo: "Ojiva",
    formula: "Fᵢ vs xᵢ",
    desc: "Representa las frecuencias acumuladas. Es fundamental para determinar cuántos datos están por debajo de un valor específico (percentiles)."
  },
  'pareto': {
    titulo: "Diagrama de Pareto",
    formula: "80/20 Rule",
    desc: "Muestra los valores ordenados por frecuencia descendente. Ayuda a identificar los pocos valores vitales que representan la mayor parte del total."
  },
  'pastel': {
    titulo: "Gráfico de Pastel",
    formula: "fᵣ * 360°",
    desc: "Visualiza la proporción o porcentaje que cada valor representa respecto al total de la muestra."
  }
};

const Graficos = ({ frecuencias, datosOriginales }) => {
  const labels = frecuencias.map(f => f.valor);
  const fiData = frecuencias.map(f => f.fi);
  const FiData = frecuencias.map(f => f.Fi);

  // Datos para Pareto
  const paretoData = [...frecuencias].sort((a, b) => b.fi - a.fi);
  const paretoLabels = paretoData.map(f => f.valor);
  const paretoFi = paretoData.map(f => f.fi);
  let accumulated = 0;
  const total = paretoFi.reduce((a, b) => a + b, 0);
  const paretoPercent = paretoFi.map(fi => {
    accumulated += fi;
    return ((accumulated / total) * 100).toFixed(2);
  });

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#fff', font: { size: 10 } } },
    },
    scales: {
      x: { ticks: { color: '#888' }, grid: { color: '#333' } },
      y: { ticks: { color: '#888' }, grid: { color: '#333' } }
    }
  };

  const histogramaData = {
    labels,
    datasets: [
      {
        label: 'fi (Frecuencia Absoluta)',
        data: fiData,
        backgroundColor: '#006BB4',
        borderColor: '#DE443B',
        borderWidth: 1,
      },
      {
        label: 'Polígono de Frecuencias',
        data: fiData,
        borderColor: '#DE443B',
        backgroundColor: '#DE443B',
        type: 'line',
        tension: 0.4,
        fill: false,
      }
    ]
  };

  const ojivaData = {
    labels,
    datasets: [{
      label: 'Fi (Frecuencia Acumulada)',
      data: FiData,
      borderColor: '#DE443B',
      backgroundColor: '#DE443B',
      fill: false,
      tension: 0.1,
    }]
  };

  const paretoChartData = {
    labels: paretoLabels,
    datasets: [
      {
        type: 'bar',
        label: 'fi',
        data: paretoFi,
        backgroundColor: '#006BB4',
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: '% Acumulado',
        data: paretoPercent,
        borderColor: '#DE443B',
        backgroundColor: '#DE443B',
        yAxisID: 'y1',
        tension: 0.4,
      }
    ]
  };

  const pieData = {
    labels: labels.slice(0, 5),
    datasets: [{
      data: fiData.slice(0, 5),
      backgroundColor: ['#DE443B', '#006BB4', '#162325', '#b1dae7', '#caf438'],
    }]
  };

  return (
    <div className="graficos-container">
      <div className="chart-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          Histograma y Polígono 
          <span data-tooltip-id="chart-tooltip" data-tooltip-content="histograma" style={{ cursor: 'help' }}>
            <VscInfo size={16} style={{ color: 'var(--color-sky)' }} />
          </span>
        </h3>
        <div className="chart-box">
          <Chart type='bar' data={histogramaData} options={commonOptions} />
        </div>
      </div>
      
      <div className="chart-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          Ojiva (Frecuencia Acumulada)
          <span data-tooltip-id="chart-tooltip" data-tooltip-content="ojiva" style={{ cursor: 'help' }}>
            <VscInfo size={16} style={{ color: 'var(--color-sky)' }} />
          </span>
        </h3>
        <div className="chart-box">
          <Line data={ojivaData} options={commonOptions} />
        </div>
      </div>

      <div className="chart-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          Diagrama de Pareto
          <span data-tooltip-id="chart-tooltip" data-tooltip-content="pareto" style={{ cursor: 'help' }}>
            <VscInfo size={16} style={{ color: 'var(--color-sky)' }} />
          </span>
        </h3>
        <div className="chart-box">
          <Chart type='bar' data={paretoChartData} options={{
            ...commonOptions,
            scales: {
              ...commonOptions.scales,
              y1: {
                position: 'right',
                min: 0,
                max: 100,
                ticks: { color: '#DE443B' },
                grid: { display: false }
              }
            }
          }} />
        </div>
      </div>

      <div className="chart-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          Distribución (Top 5)
          <span data-tooltip-id="chart-tooltip" data-tooltip-content="pastel" style={{ cursor: 'help' }}>
            <VscInfo size={16} style={{ color: 'var(--color-sky)' }} />
          </span>
        </h3>
        <div className="chart-box">
          <Pie data={pieData} options={{ ...commonOptions, scales: {} }} />
        </div>
      </div>

      <Tooltip 
        id="chart-tooltip" 
        style={{ backgroundColor: 'rgba(6, 0, 16, 0.95)', color: '#fff', borderRadius: '12px', zIndex: 100, maxWidth: '280px' }}
        render={({ content }) => (
          <div style={{ textAlign: 'left', padding: '10px' }}>
            <strong style={{ color: 'var(--color-lime)', display: 'block', marginBottom: '6px' }}>
              {chartExplanations[content]?.titulo}
            </strong>
            <p style={{ margin: '8px 0', fontSize: '1.1rem', color: 'var(--color-sky)', fontWeight: 'bold' }}>
              {chartExplanations[content]?.formula}
            </p>
            <small style={{ color: '#aaa', lineHeight: '1.4' }}>
              {chartExplanations[content]?.desc}
            </small>
          </div>
        )}
      />
    </div>
  );
};

export default Graficos;
