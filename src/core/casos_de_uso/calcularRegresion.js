export const calcularRegresion = (datosX, datosY) => {
  const n = datosX.length;
  if (n !== datosY.length || n === 0) return null;

  const sumaX = datosX.reduce((a, b) => a + b, 0);
  const sumaY = datosY.reduce((a, b) => a + b, 0);
  const sumaXY = datosX.reduce((sum, x, i) => sum + x * datosY[i], 0);
  const sumaX2 = datosX.reduce((sum, x) => sum + x * x, 0);
  const sumaY2 = datosY.reduce((sum, y) => sum + y * y, 0);

  const numeradorM = (n * sumaXY) - (sumaX * sumaY);
  const denominadorM = (n * sumaX2) - (sumaX * sumaX);
  const m = denominadorM !== 0 ? numeradorM / denominadorM : 0;

  const b = (sumaY - (m * sumaX)) / n;

  const numeradorR = (n * sumaXY) - (sumaX * sumaY);
  const denominadorR = Math.sqrt(((n * sumaX2) - (sumaX * sumaX)) * ((n * sumaY2) - (sumaY * sumaY)));
  const r = denominadorR !== 0 ? numeradorR / denominadorR : 0;

  const r2 = r * r;
  const absR = Math.abs(r);

  return {
    pendiente: m.toFixed(4),
    interseccion: b.toFixed(4),
    correlacion: r.toFixed(4),
    determinacion: r2.toFixed(4),
    ecuacion: `y = ${m.toFixed(2)}x + ${b.toFixed(2)}`,
    interpretacion: absR >= 0.7 ? "Correlación fuerte" : absR >= 0.4 ? "Correlación moderada" : "Correlación débil"
  };
};
