<role>
Actúa como un Desarrollador Frontend Senior experto en React, UX y diseño moderno. Tu tarea es implementar una serie de mejoras de interfaz y experiencia de usuario en la aplicación de estadística, manteniendo la apariencia visual actual (modo oscuro con acentos verde lima) y sin modificar la lógica de negocio existente.
</role>

<context>
- **Proyecto**: WeebApp_Prob_Est1 (aplicación web de estadística con React y Clean Architecture).
- **Arquitectura**: Capas core, application, infrastructure, presentation (React).
- **Estado actual**: La aplicación funciona correctamente con cálculos estadísticos, tablas de frecuencias, gráficos (Chart.js/Recharts), exportación a Excel y PDF. El diseño visual actual es modo oscuro con acentos en verde lima, utilizando variables CSS y estilos definidos.
- **Objetivo**: Implementar las mejoras 1, 2, 3 y 4 descritas a continuación, sin alterar la apariencia fundamental ni la lógica de negocio.
</context>

<task>
Incorporar las siguientes mejoras de UI/UX a la aplicación, manteniendo la coherencia visual existente y sin modificar los casos de uso, servicios o repositorios.

### 1. Feedback y Micro-interacciones
- **Skeleton Screens**: Reemplazar los spinners genéricos actuales (si existen) por esqueletos animados que imiten la forma de los gráficos y tablas mientras se cargan los datos o se realizan cálculos. Usar CSS o una librería como `react-loading-skeleton`.
- **Toast Notifications**: Implementar un sistema de notificaciones no intrusivas con `react-hot-toast` o `sonner`. Deben mostrarse para acciones como "Datos copiados al portapapeles", "Cálculo realizado con éxito", "Error al procesar datos", etc.
- **Validación en tiempo real**: En el componente de entrada de datos (`InputForm` o similar), mientras el usuario escribe, mostrar un contador de números válidos detectados. Resaltar en rojo los caracteres no permitidos (letras, símbolos) en el mismo campo de texto o con un mensaje.

### 2. Visualización de Datos Avanzada
- **Gráficos interactivos con sincronización**: Configurar los gráficos (Chart.js/Recharts) para que, al pasar el mouse por una barra en el histograma, se resalte la fila correspondiente en la tabla de frecuencias (o viceversa). Usar eventos de hover y estado compartido entre componentes.
- **Modo de enfoque (Fullscreen Charts)**: Añadir un icono de "Expandir" en cada tarjeta de gráfico que, al hacer clic, abra un modal con el gráfico a pantalla completa (usar `react-modal` o un modal simple con CSS). El gráfico debe escalar adecuadamente.
- **Anotaciones en gráficos**: En el histograma, marcar automáticamente la posición de la media y la moda con líneas verticales de colores distintos (ej. media en rojo, moda en azul) usando las capacidades de anotación de Chart.js o Recharts.

### 3. Diseño y Estética (Glassmorphism y Gradientes)
- **Tarjetas con efecto de cristal**: Aplicar `backdrop-filter: blur(10px)` y una ligera transparencia (`background-color: rgba(0,0,0,0.5)` o similar) a los contenedores de las tarjetas de estadísticos y gráficos, manteniendo el fondo oscuro original. Ajustar el contraste para que el texto siga siendo legible.
- **Gradientes dinámicos en barras**: En el histograma, usar gradientes lineales (por ejemplo, de verde lima a azul cielo) en las barras, de modo que el color varíe según la altura de la barra (o valor de frecuencia). Esto se puede lograr con la función `createLinearGradient` de Canvas o mediante la configuración de `fill` en Chart.js.
- **Tipografía variable**: Asegurar que la fuente utilizada sea una variable font como `Inter` o `Geist` (si no lo es ya) para permitir pesos intermedios y mejorar la legibilidad. Si la fuente actual no es variable, se puede cambiar manteniendo la apariencia general.

### 4. Funcionalidades de "Power User"
- **Importación por arrastrar y soltar (Drag & Drop)**: Implementar un área en la página de ingreso de datos que permita arrastrar archivos `.txt`, `.csv` o `.xlsx`. Usar la librería `react-dropzone`. Al soltar, leer el archivo (usando `PapaParse` para CSV, `xlsx` para Excel) y cargar los números automáticamente, reemplazando o añadiendo a los datos existentes.
- **Historial de sesión**: Crear una pequeña barra lateral o sección "Recientes" que muestre los últimos 3-5 conjuntos de datos analizados. Usar `localStorage` para guardar estos históricos (sin guardar resultados, solo los datos brutos). Al hacer clic en uno, cargar esos datos y recalcular.
- **Copia rápida**: Añadir botones de "Copiar tabla" junto a la tabla de frecuencias y a los estadísticos que permitan copiar al portapapeles en formato CSV (texto separado por comas). Usar `navigator.clipboard.writeText()`.

</task>

<technical_requirements>

### 1. Librerías a instalar (sugeridas)
```bash
npm install react-hot-toast react-loading-skeleton react-dropzone papaparse xlsx react-modal
# Si se necesita manipulación de CSV/Excel
2. Modificaciones en componentes existentes
Skeleton Screens: Envolver las secciones de gráficos y tablas en un componente condicional que muestre esqueletos mientras isLoading sea true.

Toast Notifications: Crear un contexto o usar directamente toast en acciones relevantes (ej. después de cálculos, al copiar).

Validación en tiempo real: Modificar el componente InputForm para añadir un contador y resaltado de errores.

Gráficos interactivos: Refactorizar la lógica de gráficos para que compartan un estado de hover (usar useState en el padre o un contexto).

Fullscreen charts: Envolver cada gráfico con un botón de expandir y un modal.

Anotaciones: Configurar Chart.js o Recharts para añadir líneas de anotación.

Glassmorphism: Añadir clases CSS con backdrop-filter a las tarjetas existentes.

Gradientes dinámicos: Modificar la configuración de los gráficos para usar gradientes (ver documentación de Chart.js/Recharts).

Drag & drop: Crear un componente FileUploader que use react-dropzone y que al recibir archivos los procese y llame a la función de carga de datos.

Historial: Implementar un servicio sencillo que use localStorage para guardar/recuperar los últimos datos.

Copia rápida: Añadir botones en StatsGrid y TablaFrecuencias que copien al portapapeles.

3. Mantener la apariencia actual
No cambiar los colores base (modo oscuro, verde lima). Los nuevos efectos (glassmorphism, gradientes) deben superponerse sin alterar la paleta.

Las fuentes deben seguir siendo las mismas o cambiarse por una variable font similar (ej. Inter).

El diseño responsive actual debe conservarse.

4. Sin modificar la lógica de negocio
Los casos de uso (core/casos_de_uso) y servicios (application) no deben ser alterados.

La lógica de cálculo, generación de datos, etc., permanece intacta.

Solo se tocan componentes de presentación (presentation) y posiblemente se añadan nuevos servicios de utilidad (como el historial).

</technical_requirements>

<implementation_notes>

Para los esqueletos, se pueden usar componentes simples con CSS animado o la librería mencionada.

Para la sincronización de gráficos, se puede implementar un contexto HoverContext que almacene el índice o valor hovereado y lo consuman los componentes de tabla y gráficos.

Los gradientes en barras pueden requerir el uso de getDatasetMeta o configuraciones específicas; documentar bien.

El historial debe guardar solo los datos (array de números) y no los resultados para ahorrar espacio.

Asegurar que la validación en tiempo real no interfiera con la entrada; debe ser informativa.
</implementation_notes>

<execution_workflow>

Instalar las nuevas dependencias.

Implementar el sistema de toasts y skeletons (son rápidos y visibles en toda la app).

Añadir la validación en tiempo real en el input.

Crear el componente de drag & drop y el procesamiento de archivos.

Implementar el historial de sesión con localStorage.

Mejorar los gráficos con anotaciones y sincronización.

Añadir los botones de copia rápida.

Integrar los modales de pantalla completa.

Aplicar los efectos de glassmorphism y gradientes en el CSS.

Probar todas las funcionalidades en conjunto.
</execution_workflow>

<output_format>

Código completo de los componentes modificados (con indicación de cambios).

Código de nuevos componentes creados (FileUploader, Historial, etc.).

Explicación de cómo se implementó cada mejora.

Instrucciones para instalar las nuevas dependencias.
</output_format>

<quality_gate>

¿Los skeletons se muestran correctamente durante la carga?

¿Las notificaciones aparecen y desaparecen sin interrumpir?

¿La validación en tiempo real funciona y es clara?

¿Los gráficos se sincronizan con la tabla de frecuencias?

¿El modo fullscreen abre un modal con el gráfico ampliado?

¿Las anotaciones de media y moda aparecen en el histograma?

¿El efecto glassmorphism se ve bien sin afectar la legibilidad?

¿Los gradientes en barras se aplican correctamente?

¿El drag & drop carga archivos CSV/Excel correctamente?

¿El historial guarda y recupera datos?

¿Los botones de copia funcionan?
|
¿No se ha alterado la lógica de negocio?
</quality_gate>