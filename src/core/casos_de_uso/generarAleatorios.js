export const generarAleatorios = (cantidad = 20, min = 1, max = 100) => {
  const numeros = [];
  for (let i = 0; i < cantidad; i++) {
    numeros.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return numeros;
};