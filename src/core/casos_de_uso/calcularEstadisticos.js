export const calcularEstadisticos = (datos) => {
  const nums = datos.getDatos();
  const n = datos.getTamano();

  // Media
  const suma = nums.reduce((acc, curr) => acc + curr, 0);
  const media = (suma / n).toFixed(2);

  // Mediana
  let mediana;
  const mitad = Math.floor(n / 2);
  if (n % 2 === 0) {
    mediana = ((nums[mitad - 1] + nums[mitad]) / 2).toFixed(2);
  } else {
    mediana = nums[mitad].toFixed(2);
  }

  // Moda (Multimodal)
  const frecuencias = {};
  nums.forEach(num => {
    frecuencias[num] = (frecuencias[num] || 0) + 1;
  });

  let maxFrecuencia = 0;
  for (const num in frecuencias) {
    if (frecuencias[num] > maxFrecuencia) {
      maxFrecuencia = frecuencias[num];
    }
  }

  let moda = [];
  if (maxFrecuencia > 1) {
    for (const num in frecuencias) {
      if (frecuencias[num] === maxFrecuencia) {
        moda.push(Number(num));
      }
    }
    // Si todos tienen la misma frecuencia mayor que 1 y no hay otros, 
    // pero si todos tienen la misma frecuencia, se dice que no hay moda
    if (moda.length === Object.keys(frecuencias).length) {
       moda = "Sin moda";
    }
  } else {
    moda = "Sin moda";
  }

  // Min, Max, Rango
  const min = nums[0];
  const max = nums[n - 1];
  const rango = max - min;

  return {
    media,
    mediana,
    moda: Array.isArray(moda) ? moda.join(", ") : moda,
    min,
    max,
    rango
  };
};