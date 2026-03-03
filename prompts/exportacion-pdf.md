<role>
Actúa como un Desarrollador Frontend Senior especializado en React y en la integración de librerías de generación de informes (PDF) y persistencia. Debes implementar mejoras en la aplicación existente respetando la arquitectura actual y sin modificar la lógica de negocio (casos de uso, entidades, servicios).
</role>

<context>
- **Proyecto**: WeebApp_Prob_Est1 (aplicación web de estadística con React y Clean Architecture).
- **Estructura actual**: 
  - `src/core/` (entidades, casos de uso, repositorios)
  - `src/application/` (servicios que orquestan casos de uso)
  - `src/infrastructure/` (implementaciones de repositorios, como LocalDatosRepository)
  - `src/presentation/` (componentes React, páginas, estilos)
- **Funcionalidades existentes**: 
  - Ingreso de datos (manual o aleatorio)
  - Cálculo de estadísticos (media, mediana, moda, etc.)
  - Tabla de frecuencias
  - Gráficos (histograma, polígono, ojiva, Pareto, pastel) con Chart.js
  - Cálculo de probabilidad con condiciones definidas por el usuario
- **Repositorio actual**: `LocalDatosRepository.js` guarda los datos en memoria; se puede extender para usar localStorage.
</context>

<task>
Implementar tres mejoras específicas en la aplicación, respetando estrictamente la lógica de negocio existente y la arquitectura limpia:

1. **Exportación de resultados a PDF** (mejora 1).
2. **Explicación de fórmulas en el grid de estadísticos** (mejora 3).
3. **Persistencia de sesión con localStorage** (mejora 4).

</task>

<technical_requirements>

### 1. Exportación a PDF
- Añadir un botón "Descargar reporte PDF" en la página de resultados (`CalculosPage` o un lugar visible).
- Utilizar la librería **`@react-pdf/renderer`** para construir el PDF.
- El PDF debe incluir:
  - Los datos ingresados por el usuario (mostrar los primeros N o un resumen).
  - Los estadísticos calculados (media, mediana, moda, mínimo, máximo, rango).
  - La tabla de frecuencias (con todas las columnas: valor, fi, fr, Fi, Fr).
  - Los gráficos (histograma, polígono, ojiva, Pareto, pastel) como imágenes.
- Para incluir los gráficos:
  - Usar la librería **`html-to-image`** para capturar el elemento `<canvas>` de cada gráfico y convertirlo a una imagen en formato base64.
  - Insertar las imágenes en el PDF usando el componente `<Image>` de `@react-pdf/renderer`.
- No modificar los componentes de gráficos existentes; solo capturarlos al momento de generar el PDF.
- El botón de descarga debe estar disponible solo cuando haya resultados.

### 2. Explicación de fórmulas
- En el componente `StatsGrid.jsx`, añadir un tooltip o un ícono de información (ℹ️) junto a cada estadístico.
- Al pasar el mouse (o hacer clic) sobre el ícono, mostrar un pequeño cuadro con:
  - La fórmula matemática utilizada (en formato LaTeX o texto legible).
  - Un ejemplo breve con los datos actuales del usuario (opcional, pero deseable).
- Las fórmulas a incluir:
  - **Media**: $\bar{x} = \frac{\sum_{i=1}^{n} x_i}{n}$
  - **Mediana**: Si $n$ es impar, $Mediana = x_{(n+1)/2}$; si es par, $Mediana = \frac{x_{n/2} + x_{n/2+1}}{2}$
  - **Moda**: Valor(es) que más se repiten.
  - **Mínimo**: $x_{(1)}$
  - **Máximo**: $x_{(n)}$
  - **Rango**: $x_{(n)} - x_{(1)}$
- Utilizar una librería de tooltips como `react-tooltip` o implementar un simple tooltip con CSS.
- No alterar la lógica de cálculo; solo añadir el componente de ayuda visual.

### 3. Persistencia de sesión con localStorage
- Modificar el repositorio `LocalDatosRepository.js` (en `infrastructure/implementaciones/`) para que utilice `localStorage` como almacenamiento persistente.
- Actualmente el repositorio guarda los datos en memoria; se debe cambiar para:
  - Al guardar datos (`guardar`), también escribirlos en `localStorage` bajo una clave fija (ej. `'app_estadistica_datos'`).
  - Al obtener datos (`obtener`), primero intentar leer de `localStorage`; si no hay, retornar el array en memoria.
  - Al limpiar (`limpiar`), eliminar también de `localStorage`.
- En `App.jsx`, al cargar la aplicación (useEffect), verificar si hay datos guardados en `localStorage` a través del repositorio y, si existen, cargarlos automáticamente en el estado (`setResultados`). Esto permitirá que el usuario recupere su sesión tras un refresco accidental.
- Asegurar que la funcionalidad de generación aleatoria y entrada manual también persista los datos en localStorage (ya que usan el repositorio).
- No modificar la interfaz de los casos de uso; solo la implementación del repositorio y la lógica de carga inicial en `App.jsx`.

</technical_requirements>

<implementation_notes>
- Para la exportación a PDF, instalar: `npm install @react-pdf/renderer html-to-image`.
- Para los tooltips, instalar: `npm install react-tooltip` (opcional, se puede hacer con CSS puro).
- La persistencia con localStorage no requiere librerías adicionales.
- Todos los cambios deben realizarse respetando la estructura de carpetas existente y sin alterar los casos de uso puros (`core/casos_de_uso/`).
- Los componentes modificados serán principalmente:
  - `StatsGrid.jsx` (para tooltips)
  - `CalculosPage.jsx` (para botón PDF)
  - `LocalDatosRepository.js` (para localStorage)
  - `App.jsx` (para carga inicial)
</implementation_notes>

<execution_workflow>
1. **Instalar** las nuevas dependencias (`@react-pdf/renderer`, `html-to-image`, `react-tooltip`).
2. **Modificar** `LocalDatosRepository.js` para usar localStorage.
3. **Actualizar** `App.jsx` para leer datos guardados al inicio.
4. **Crear** un nuevo componente (o función) para generar el PDF, que capture los gráficos y construya el documento.
5. **Integrar** el botón de descarga en `CalculosPage.jsx`.
6. **Añadir** tooltips con fórmulas en `StatsGrid.jsx`.
7. **Probar** todas las funcionalidades: persistencia tras recargar, generación de PDF con gráficos, y visualización de tooltips.
</execution_workflow>

<output_format>
- Código completo de los archivos modificados (con indicación de los cambios).
- Breve explicación de cómo se implementó cada mejora.
- Instrucciones para instalar las nuevas dependencias.
</output_format>

<quality_gate>
- ¿El PDF generado incluye todos los elementos requeridos (datos, estadísticos, tabla, gráficos)?
- ¿Los tooltips muestran las fórmulas correctamente sin interferir con la funcionalidad existente?
- ¿Al recargar la página, los datos persisten y se restauran automáticamente?
- ¿La lógica de negocio (casos de uso) permanece intacta?
- ¿El código sigue la arquitectura limpia y las buenas prácticas de React?
</quality_gate>