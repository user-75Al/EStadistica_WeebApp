export const generateChartConfigs = (frecuencias, datosOriginales) => {
  const labels = frecuencias.map(f => f.valor);
  const fiData = frecuencias.map(f => f.fi);
  const FiData = frecuencias.map(f => f.Fi);
  
  // Colores corporativos para el PDF
  const primaryColor = '#1E3A5F';
  const secondaryColor = '#006BB4';
  const accentColor = '#CAF438';

  const commonOptions = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#666', font: { size: 10 } } },
      y: { grid: { color: '#eee' }, ticks: { color: '#666', font: { size: 10 } } }
    }
  };

  return {
    histograma: {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Frecuencia Absoluta',
          data: fiData,
          backgroundColor: primaryColor,
          barPercentage: 1,
          categoryPercentage: 1,
          borderWidth: 1,
          borderColor: '#fff'
        }]
      },
      options: { ...commonOptions, plugins: { ...commonOptions.plugins, title: { display: true, text: 'Histograma de Frecuencias' } } }
    },
    poligono: {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: fiData,
          borderColor: secondaryColor,
          backgroundColor: 'transparent',
          pointBackgroundColor: accentColor,
          tension: 0.1,
          fill: false
        }]
      },
      options: commonOptions
    },
    ojiva: {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: FiData,
          borderColor: primaryColor,
          backgroundColor: 'rgba(30, 58, 95, 0.1)',
          fill: true,
          stepped: false,
        }]
      },
      options: commonOptions
    },
    pareto: {
      type: 'bar',
      data: {
        labels: frecuencias.sort((a,b) => b.fi - a.fi).map(f => f.valor),
        datasets: [
          {
            type: 'line',
            label: '% Acumulado',
            data: frecuencias.sort((a,b) => b.fi - a.fi).map(f => (f.Fi / datosOriginales.length * 100)),
            borderColor: '#DE443B',
            yAxisID: 'y1',
          },
          {
            label: 'Frecuencia',
            data: frecuencias.sort((a,b) => b.fi - a.fi).map(f => f.fi),
            backgroundColor: primaryColor,
          }
        ]
      },
      options: {
        ...commonOptions,
        scales: {
          y: { type: 'linear', position: 'left' },
          y1: { type: 'linear', position: 'right', grid: { drawOnChartArea: false }, min: 0, max: 100 }
        }
      }
    },
    pastel: {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data: fiData,
          backgroundColor: [
            '#1E3A5F', '#006BB4', '#CAF438', '#DE443B', '#87A4B6', '#162325'
          ]
        }]
      },
      options: {
        plugins: { legend: { display: true, position: 'bottom', labels: { boxWidth: 10, font: { size: 8 } } } }
      }
    }
  };
};
