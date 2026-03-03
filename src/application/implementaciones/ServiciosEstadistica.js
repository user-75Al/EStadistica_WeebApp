import { calcularEstadisticos } from '../../core/casos_de_uso/calcularEstadisticos';
import { calcularFrecuencias } from '../../core/casos_de_uso/calcularFrecuencias';
import { generarAleatorios } from '../../core/casos_de_uso/generarAleatorios';
import { calcularAgrupados } from '../../core/casos_de_uso/calcularAgrupados';
import { Datos } from '../../core/entidades/Datos';

export class ServiciosEstadistica {
  constructor(repository) {
    this.repository = repository;
  }

  procesarCadena(cadena) {
    const numeros = cadena
      .split(/[\s,]+/)
      .map(n => n.trim())
      .filter(n => n !== "" && !isNaN(n))
      .map(Number);

    if (numeros.length < 20) {
      throw new Error("Se requieren al menos 20 números.");
    }

    const datos = new Datos(numeros);
    this.repository.save(datos);
    return this.obtenerResultados(datos);
  }

  generarYProcesarAleatorios() {
    const numeros = generarAleatorios(20);
    const datos = new Datos(numeros);
    this.repository.save(datos);
    return this.obtenerResultados(datos);
  }

  obtenerResultados(datos) {
    const estadisticos = calcularEstadisticos(datos);
    const frecuencias = calcularFrecuencias(datos);
    const agrupados = calcularAgrupados(datos);
    return {
      datosOriginales: datos.getDatos(),
      estadisticos,
      frecuencias,
      agrupados
    };
  }

  limpiar() {
    this.repository.clear();
  }
}
