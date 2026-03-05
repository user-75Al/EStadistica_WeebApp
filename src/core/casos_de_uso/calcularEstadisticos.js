export const calcularEstadisticos = (datos) => {
  const nums = datos.getDatos();
  const n = datos.getTamano();

  // Media
  const suma = nums.reduce((acc, curr) => acc + curr, 0);
  const mediaVal = suma / n;
  const media = mediaVal.toFixed(2);

  // Mediana
  const getPercentile = (p) => {
    const pos = (n - 1) * p;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (nums[base + 1] !== undefined) {
      return nums[base] + rest * (nums[base + 1] - nums[base]);
    } else {
      return nums[base];
    }
  };

  const q2 = getPercentile(0.5);
  const mediana = q2.toFixed(2);

  // Moda
  const frecuencias = {};
  nums.forEach(num => { frecuencias[num] = (frecuencias[num] || 0) + 1; });
  let maxFrecuencia = 0;
  for (const num in frecuencias) { if (frecuencias[num] > maxFrecuencia) maxFrecuencia = frecuencias[num]; }
  let moda = [];
  if (maxFrecuencia > 1) {
    for (const num in frecuencias) { if (frecuencias[num] === maxFrecuencia) moda.push(Number(num)); }
    if (moda.length === Object.keys(frecuencias).length) moda = "Sin moda";
  } else { moda = "Sin moda"; }

  // Dispersión y Rango
  const min = nums[0];
  const max = nums[n - 1];
  const rango = max - min;
  const sumaCuadrados = nums.reduce((acc, curr) => acc + Math.pow(curr - mediaVal, 2), 0);
  const varianzaMuestral = (sumaCuadrados / (n - 1)).toFixed(2);
  const desviacionEstandar = Math.sqrt(Number(varianzaMuestral)).toFixed(2);

  // NUEVO: Cuartiles y Outliers (Limpieza de Datos)
  const q1 = getPercentile(0.25);
  const q3 = getPercentile(0.75);
  const iqr = q3 - q1;
  const limiteInferior = q1 - 1.5 * iqr;
  const limiteSuperior = q3 + 1.5 * iqr;

  const outliers = nums.filter(x => x < limiteInferior || x > limiteSuperior);
  
  // NUEVO: Análisis de Sesgo (Simetría)
  let sesgoLabel = "Simétricos";
  const diferencia = mediaVal - q2;
  if (diferencia > 0.1) sesgoLabel = "Sesgo a la Derecha (Positivo)";
  else if (diferencia < -0.1) sesgoLabel = "Sesgo a la Izquierda (Negativo)";

  // NUEVO: Curtosis (Apuntamiento)
  const sumaCuarta = nums.reduce((acc, curr) => acc + Math.pow(curr - mediaVal, 4), 0);
  const m4 = sumaCuarta / n;
  const m2 = sumaCuadrados / n;
  const curtosisVal = (m4 / Math.pow(m2, 2)) - 3;
  let curtosisLabel = "Mesocúrtica";
  if (curtosisVal > 0.5) curtosisLabel = "Leptocúrtica (Puntiaguda)";
  else if (curtosisVal < -0.5) curtosisLabel = "Platicúrtica (Aplanada)";

  return {
    media,
    mediana,
    moda: Array.isArray(moda) ? moda.join(", ") : moda,
    min,
    max,
    rango,
    varianza: varianzaMuestral,
    desviacion: desviacionEstandar,
    // Datos de Calidad
    q1: q1.toFixed(2),
    q3: q3.toFixed(2),
    iqr: iqr.toFixed(2),
    outliers: outliers,
    sesgo: sesgoLabel,
    curtosis: curtosisLabel
  };
};
