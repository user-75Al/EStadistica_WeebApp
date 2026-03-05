import React, { useState } from 'react';
import Modal from 'react-modal';
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
  LineController,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart, Bar, Line, Pie } from 'react-chartjs-2';
import { Tooltip } from 'react-tooltip';
import { VscInfo, VscScreenFull } from 'react-icons/vsc';
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
  Legend,
  annotationPlugin
);

Modal.setAppElement('#root');

const chartExplanations = {
  'histograma': {
    titulo: "Histograma y Polígono",
    formula: "fᵢ vs xᵢ",
    desc: "Muestra la distribución de frecuencias absolutas. El polígono ayuda a visualizar la tendencia y forma de la distribución."
  },
  'ojiva': {
    titulo: "Ojiva",
    formula: "Fᵢ vs xᵢ",
    desc: "Representa las frecuencias acumuladas. Útil para determinar cuántos datos están por debajo de un valor (percentiles)."
  },
  'pareto': {
    titulo: "Diagrama de Pareto",
    formula: "Regla 80/20",
    desc: "Ordena los valores por frecuencia descendente para identificar los elementos más significativos de la muestra."
  },
  'pie': {
    titulo: "Distribución Top 5",
    formula: "fᵣ * 360°",
    desc: "Visualiza la proporción de los 5 valores más frecuentes respecto al total de la muestra."
  }
};

const Graficos = ({ frecuencias, datosOriginales, estadisticos, onHoverIndex }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeChart, setActiveChart] = useState(null);

  const labels = frecuencias.map(f => f.valor);
  const fiData = frecuencias.map(f => f.fi);
  const FiData = frecuencias.map(f => f.Fi);

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
    onHover: (event, chartElement) => {
      if (chartElement.length > 0 && onHoverIndex) {
        onHoverIndex(chartElement[0].index);
      } else if (onHoverIndex) {
        onHoverIndex(null);
      }
    },
    plugins: {
      legend: { labels: { color: '#fff', font: { size: 10 } } },
    },
    scales: {
      x: { ticks: { color: '#888' }, grid: { color: '#333' } },
      y: { ticks: { color: '#888' }, grid: { color: '#333' } }
    }
  };

  const getGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, '#006BB4');
    gradient.addColorStop(1, '#caf438');
    return gradient;
  };

  const histogramaData = {
    labels,
    datasets: [
      {
        label: 'fi',
        data: fiData,
        backgroundColor: (context) => {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return '#006BB4';
          return getGradient(ctx, chartArea);
        },
        borderColor: '#caf438',
        borderWidth: 1,
      },
      {
        label: 'Polígono',
        data: fiData,
        borderColor: '#DE443B',
        backgroundColor: '#DE443B',
        type: 'line',
        tension: 0.4,
        fill: false,
      }
    ]
  };

  const annotationOptions = {
    plugins: {
      annotation: {
        annotations: {
          lineMedia: {
            type: 'line',
            xMin: labels.indexOf(Number(estadisticos?.media)),
            xMax: labels.indexOf(Number(estadisticos?.media)),
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
            label: { display: true, content: 'x̄', position: 'start' }
          }
        }
      }
    }
  };

  const renderChart = (type, isModal = false) => {
    const options = isModal ? { ...commonOptions, maintainAspectRatio: true } : commonOptions;
    switch(type) {
      case 'histograma': return <Chart type='bar' data={histogramaData} options={{...options, ...annotationOptions}} />;
      case 'ojiva': return <Line data={{ labels, datasets: [{ label: 'Fi', data: FiData, borderColor: '#DE443B', backgroundColor: '#DE443B', tension: 0.1 }] }} options={options} />;
      case 'pareto': return <Chart type='bar' data={{ labels: paretoLabels, datasets: [{ type: 'bar', label: 'fi', data: paretoFi, backgroundColor: '#006BB4', yAxisID: 'y' }, { type: 'line', label: '% Acum', data: paretoPercent, borderColor: '#DE443B', yAxisID: 'y1' }] }} options={{...options, scales: {...options.scales, y1: { position: 'right', min: 0, max: 100, ticks: { color: '#DE443B' }, grid: { display: false } }}}} />;
      case 'pie': return <Pie data={{ labels: labels.slice(0, 5), datasets: [{ data: fiData.slice(0, 5), backgroundColor: ['#DE443B', '#006BB4', '#162325', '#b1dae7', '#caf438'] }] }} options={{...options, maintainAspectRatio: true, scales: {}}} />;
      default: return null;
    }
  };

  return (
    <div className="graficos-container">
      {[
        { id: 'histograma', title: 'Histograma y Polígono' },
        { id: 'ojiva', title: 'Ojiva' },
        { id: 'pareto', title: 'Pareto' },
        { id: 'pie', title: 'Distribución Top 5' }
      ].map(chart => (
        <div key={chart.id} className="chart-card glass">
          <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {chart.title}
              <VscInfo size={14} style={{ color: 'var(--color-sky)', cursor: 'help' }} data-tooltip-id="chart-info-tooltip" data-tooltip-content={chart.id} />
            </span>
            <VscScreenFull size={16} style={{ cursor: 'pointer', color: 'var(--color-lime)' }} onClick={() => { setActiveChart(chart.id); setModalIsOpen(true); }} />
          </h3>
          <div className="chart-box" style={{ height: '180px' }}>
            {renderChart(chart.id)}
          </div>
        </div>
      ))}

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.9)', zIndex: 2000 }, content: { background: '#060010', border: '1px solid var(--color-lime)', borderRadius: '20px' } }}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <button onClick={() => setModalIsOpen(false)} style={{ alignSelf: 'flex-end', background: 'var(--color-lime)', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cerrar</button>
          <div style={{ flex: 1, marginTop: '20px' }}>{renderChart(activeChart, true)}</div>
        </div>
      </Modal>

      <Tooltip id="chart-info-tooltip" style={{ backgroundColor: '#162325', color: '#fff', borderRadius: '10px', zIndex: 3000, maxWidth: '250px' }} render={({ content }) => (
        <div style={{ padding: '5px' }}>
          <strong style={{ color: 'var(--color-lime)' }}>{chartExplanations[content]?.titulo}</strong>
          <p style={{ fontSize: '0.8rem', margin: '5px 0', color: 'var(--color-sky)' }}>{chartExplanations[content]?.formula}</p>
          <p style={{ fontSize: '0.75rem', color: '#ccc' }}>{chartExplanations[content]?.desc}</p>
        </div>
      )} />
    </div>
  );
};

export default Graficos;
