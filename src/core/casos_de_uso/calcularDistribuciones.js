// Funciones matemáticas base
const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const combinacion = (n, k) => factorial(n) / (factorial(k) * factorial(n - k));

export const calcularDistribuciones = {
  binomial: (n, p, k) => {
    const prob = combinacion(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    return {
      resultado: prob.toFixed(4),
      porcentaje: (prob * 100).toFixed(2),
      formula: `P(X=${k}) = (${n}C${k}) * ${p}^${k} * (1-${p})^(${n}-${k})`
    };
  },

  poisson: (lambda, k) => {
    const prob = (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
    return {
      resultado: prob.toFixed(4),
      porcentaje: (prob * 100).toFixed(2),
      formula: `P(X=${k}) = (e^-${lambda} * ${lambda}^${k}) / ${k}!`
    };
  },

  normal: (media, desviacion, x) => {
    const z = (x - media) / desviacion;
    const prob = (1 / (desviacion * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow(z, 2));
    return {
      z: z.toFixed(2),
      densidad: prob.toFixed(4),
      formula: `Z = (${x} - ${media}) / ${desviacion}`
    };
  }
};
