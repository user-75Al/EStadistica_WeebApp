<role>
Actúa como un Desarrollador Frontend Senior experto en React y en la integración de mejoras de experiencia de usuario en aplicaciones existentes. Debes implementar dos mejoras específicas en la aplicación de estadística, respetando la arquitectura actual y sin modificar la lógica de negocio.
</role>

<context>
- **Proyecto**: WeebApp_Prob_Est1 (aplicación web de estadística con React y Clean Architecture).
- **Estructura actual**: 
  - `src/core/` (entidades, casos de uso, repositorios)
  - `src/application/` (servicios que orquestan casos de uso)
  - `src/infrastructure/` (implementaciones de repositorios, como LocalDatosRepository)
  - `src/presentation/` (componentes React, páginas, estilos)
- **Componentes relevantes**:
  - `StatsGrid.jsx`: Muestra las tarjetas con los estadísticos (media, mediana, moda, etc.).
  - `LocalDatosRepository.js`: Repositorio que actualmente guarda datos en memoria.
  - `App.jsx`: Componente raíz que maneja el estado global y la navegación.
- **Objetivo**: Implementar dos mejoras:
  1. **Mejora 3**: Añadir explicaciones de fórmulas en `StatsGrid.jsx` mediante tooltips.
  2. **Mejora 4**: Persistir los datos en `localStorage` para que sobrevivan a recargas de página.
</context>

<task>
Implementar las mejoras 3 y 4 de la siguiente manera:

### Mejora 3: Explicación de fórmulas en StatsGrid
- En el componente `StatsGrid.jsx`, añadir un ícono de información (ℹ️) junto a cada estadístico (media, mediana, moda, mínimo, máximo, rango).
- Al pasar el mouse sobre el ícono, mostrar un tooltip con la fórmula matemática correspondiente.
- Las fórmulas a mostrar:
  - **Media**: $\bar{x} = \frac{\sum_{i=1}^{n} x_i}{n}$
  - **Mediana**: Si $n$ es impar: $x_{(n+1)/2}$; si es par: $\frac{x_{n/2} + x_{n/2+1}}{2}$
  - **Moda**: Valor(es) que más se repiten.
  - **Mínimo**: $x_{(1)}$
  - **Máximo**: $x_{(n)}$
  - **Rango**: $x_{(n)} - x_{(1)}$
- Utilizar una librería de tooltips simple como `react-tooltip` o implementar un tooltip personalizado con CSS.
- No modificar la lógica de cálculo de los estadísticos; solo la presentación.

### Mejora 4: Persistencia de sesión con localStorage
- Modificar el repositorio `LocalDatosRepository.js` (ubicado en `src/infrastructure/implementaciones/`) para que utilice `localStorage` como almacenamiento persistente.
  - Al guardar datos (`guardar`), escribirlos también en `localStorage` bajo una clave fija (ej. `'app_estadistica_datos'`).
  - Al obtener datos (`obtener`), primero intentar leer de `localStorage`; si no hay, retornar el array en memoria.
  - Al limpiar (`limpiar`), eliminar también de `localStorage`.
- En `App.jsx`, al cargar la aplicación (en un `useEffect`), verificar si hay datos guardados en `localStorage` a través del repositorio y, si existen, cargarlos automáticamente en el estado (`setResultados`). Esto permitirá que el usuario recupere su sesión tras un refresco accidental.
- Asegurar que la funcionalidad de generación aleatoria y entrada manual también persista los datos en localStorage (ya que usan el repositorio).
</task>

<technical_requirements>

### 1. Librerías adicionales (opcional para tooltips)
- Para tooltips, se puede usar `react-tooltip`:
  ```bash
  npm install react-tooltip
Si se prefiere un tooltip CSS puro, implementar con :hover y posicionamiento absoluto.

2. Modificaciones en StatsGrid.jsx
Importar react-tooltip (si se usa) o definir estilos CSS para tooltip personalizado.

Añadir un ícono (ej. <span className="info-icon">ℹ️</span>) junto a cada valor estadístico.

Envolver el ícono y el valor en un contenedor con posición relativa y añadir el tooltip.

Ejemplo con react-tooltip:

jsx
import { Tooltip } from 'react-tooltip';
// ...
<div data-tooltip-id="tooltip-media" data-tooltip-content="Fórmula: ...">
  Media: {media}
</div>
// luego al final del componente
<Tooltip id="tooltip-media" />
3. Modificaciones en LocalDatosRepository.js
Añadir constantes para la clave de localStorage.

En el método guardar(datos), después de actualizar el array interno, hacer:

javascript
localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
En el método obtener(), si el array interno está vacío, intentar leer de localStorage:

javascript
if (this.datos.length === 0) {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    this.datos = JSON.parse(stored);
  }
}
return this.datos;
En limpiar(), hacer localStorage.removeItem(STORAGE_KEY).

4. Modificaciones en App.jsx
En un useEffect con dependencias vacías (al montar), usar el repositorio para cargar datos:

javascript
useEffect(() => {
  const datosGuardados = servicios.obtenerDatos(); // asumiendo que servicios tiene acceso al repo
  if (datosGuardados && datosGuardados.length > 0) {
    // Calcular resultados con esos datos y actualizar estado
    const res = servicios.calcularResultados(datosGuardados); // necesitas este método
    setResultados(res);
  }
}, []);
Asegurar que ServiciosEstadistica tenga un método para obtener los datos sin procesar (si no existe, crearlo).

</technical_requirements>

<implementation_notes>

Para la Mejora 3, mantener la coherencia visual con el diseño actual.

Para la Mejora 4, tener cuidado con la serialización/deserialización de objetos complejos. Los datos son arrays de números, por lo que es seguro.

Si ServiciosEstadistica no tiene un método calcularResultados que acepte un array, es posible que necesites crear uno o reutilizar la lógica existente.

No olvidar importar los hooks necesarios en App.jsx (useEffect).
</implementation_notes>

<execution_workflow>

Mejora 3:

Instalar react-tooltip (opcional).

Modificar StatsGrid.jsx para añadir tooltips con las fórmulas.

Probar visualmente que aparecen al pasar el mouse.

Mejora 4:

Modificar LocalDatosRepository.js para integrar localStorage.

Modificar App.jsx para cargar datos al iniciar.

Probar: ingresar datos, recargar la página y verificar que los resultados persisten.
</execution_workflow>

<output_format>

Código completo de StatsGrid.jsx con los tooltips implementados.

Código completo de LocalDatosRepository.js modificado.

Fragmento de App.jsx con el useEffect de carga inicial.

Breve explicación de los cambios realizados.
</output_format>

<quality_gate>

¿Los tooltips muestran las fórmulas correctamente al pasar el mouse?

¿Al recargar la página, los datos y resultados se restauran automáticamente?

¿El código mantiene la arquitectura limpia (sin mezclar lógica de negocio con UI)?

¿Las modificaciones no introducen errores en otras funcionalidades?
</quality_gate>