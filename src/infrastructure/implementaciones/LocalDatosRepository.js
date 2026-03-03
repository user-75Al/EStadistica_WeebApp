import { Datos } from '../../core/entidades/Datos';

export class LocalDatosRepository {
  constructor() {
    this.storageKey = 'weebapp_prob_est1_datos';
  }

  save(datos) {
    const dataArray = datos.getDatos();
    localStorage.setItem(this.storageKey, JSON.stringify(dataArray));
  }

  get() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const array = JSON.parse(stored);
      return new Datos(array);
    }
    return null;
  }

  clear() {
    localStorage.removeItem(this.storageKey);
  }
}
