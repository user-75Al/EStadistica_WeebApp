import { DatosRepository } from '../../core/repositorios/DatosRepository';

export class LocalDatosRepository extends DatosRepository {
  constructor() {
    super();
    this.storage = null;
  }

  save(datos) {
    this.storage = datos;
  }

  get() {
    return this.storage;
  }

  clear() {
    this.storage = null;
  }
}