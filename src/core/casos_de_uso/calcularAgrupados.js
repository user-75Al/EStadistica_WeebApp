export const calcularAgrupados = (datos) => {
  const nums = datos.getDatos();
  const n = datos.getTamano();
  const min = nums[0];
  const max = nums[n - 1];
  const rango = max - min;

  // Regla de Sturges para número de clases K
  const k = Math.ceil(1 + 3.322 * Math.log10(n));
  const amplitud = Math.ceil(rango / k);

  const clases = [];
  let limiteInferior = min;

  for (let i = 0; i < k; i++) {
    const limiteSuperior = limiteInferior + amplitud;
    const marcaClase = (limiteInferior + limiteSuperior) / 2;
    
    // Contar frecuencia en el intervalo [Li, Ls)
    // El último intervalo es inclusivo en ambos lados [Li, Ls]
    const fi = nums.filter(num => {
      if (i === k - 1) return num >= limiteInferior && num <= limiteSuperior;
      return num >= limiteInferior && num < limiteSuperior;
    }).length;

    clases.push({
      intervalo: `[${limiteInferior} - ${limiteSuperior})`,
      li: limiteInferior,
      ls: limiteSuperior,
      xi: marcaClase,
      fi: fi,
      fr: (fi / n).toFixed(4)
    });

    limiteInferior = limiteSuperior;
  }

  return {
    k,
    amplitud,
    clases
  };
};
