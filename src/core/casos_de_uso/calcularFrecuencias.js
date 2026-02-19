export const calcularFrecuencias = (datos) => {
  const nums = datos.getDatos();
  const n = datos.getTamano();
  
  const frecuenciasMap = {};
  nums.forEach(num => {
    frecuenciasMap[num] = (frecuenciasMap[num] || 0) + 1;
  });

  const valoresUnicos = Object.keys(frecuenciasMap).sort((a, b) => Number(a) - Number(b));
  
  let Fi = 0;
  const tabla = valoresUnicos.map(valor => {
    const fi = frecuenciasMap[valor];
    const fr = (fi / n).toFixed(4);
    Fi += fi;
    const Fr = (Fi / n).toFixed(4);
    
    return {
      valor: Number(valor),
      fi,
      fr,
      Fi,
      Fr
    };
  });

  return tabla;
};