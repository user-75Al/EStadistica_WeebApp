import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarController,
  LineController
} from 'chart.js';
import { Chart, Bar, Line, Pie } from 'react-chartjs-2';
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
  Tooltip,
  Legend
);

const Graficos = ({ frecuencias, datosOriginales }) => {
  const labels = frecuencias.map(f => f.valor);
  const fiData = frecuencias.map(f => f.fi);
  const FiData = frecuencias.map(f => f.Fi);
  const FrData = frecuencias.map(f => (f.Fr * 100).toFixed(2));

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
      legend: { labels: { color: '#fff' } },
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
    labels: labels.slice(0, 5), // Top 5
    datasets: [{
      data: fiData.slice(0, 5),
      backgroundColor: ['#DE443B', '#006BB4', '#162325', '#b1dae7', '#caf438'],
    }]
  };

  return (
    <div className="graficos-container">
      <div className="chart-card">
        <h3>Histograma y Polígono</h3>
        <div className="chart-box">
          <Chart type='bar' data={histogramaData} options={commonOptions} />
        </div>
      </div>
      
      <div className="chart-card">
        <h3>Ojiva (Frecuencia Acumulada)</h3>
        <div className="chart-box">
          <Line data={ojivaData} options={commonOptions} />
        </div>
      </div>

      <div className="chart-card">
        <h3>Diagrama de Pareto</h3>
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
        <h3>Distribución (Top 5)</h3>
        <div className="chart-box">
          <Pie data={pieData} options={{ ...commonOptions, scales: {} }} />
        </div>
      </div>
    </div>
  );
};

export default Graficos;