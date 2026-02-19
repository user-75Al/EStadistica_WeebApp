export class Datos {
  constructor(numeros) {
    this.numeros = numeros.sort((a, b) => a - b);
    this.n = numeros.length;
  }

  getDatos() {
    return this.numeros;
  }

  getTamano() {
    return this.n;
  }
}