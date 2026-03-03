export const transformDataForCharts = (frecuencias, total) => {
  // 1. Histograma y Polígono (Ordenados por valor)
  const baseData = frecuencias.map(f => ({
    name: f.valor.toString(),
    fi: f.fi,
    Fi: f.Fi,
    porcentaje: (f.fr * 100).toFixed(2)
  }));

  // 2. Pareto (Ordenado por frecuencia descendente)
  const paretoData = [...frecuencias]
    .sort((a, b) => b.fi - a.fi)
    .reduce((acc, curr, idx) => {
      const prevFi = idx > 0 ? acc[idx - 1].acum : 0;
      const currentAcum = prevFi + curr.fi;
      acc.push({
        name: curr.valor.toString(),
        fi: curr.fi,
        porcentajeAcum: ((currentAcum / total) * 100).toFixed(2)
      });
      return acc;
    }, []);

  // 3. Pastel (Top 5 y el resto en "Otros")
  let pieData = baseData
    .sort((a, b) => b.fi - a.fi)
    .slice(0, 5);
  
  if (baseData.length > 5) {
    const otrosFi = baseData.slice(5).reduce((sum, item) => sum + item.fi, 0);
    pieData.push({ name: 'Otros', fi: otrosFi });
  }

  return { baseData, paretoData, pieData };
};
