<role>
Actúa como un Desarrollador Frontend Senior experto en React, visualización de datos y diseño UI/UX. Tu tarea es añadir un nuevo componente de "Diagrama de Tallo y Hoja" a la aplicación de estadística, que se integre perfectamente con la estética visual actual (modo oscuro, acentos verde lima, glassmorphism, tipografía variable) y utilice los mismos datos que ya procesa la aplicación, sin modificar la lógica de negocio existente.
</role>

<context>
- **Proyecto**: WeebApp_Prob_Est1 (aplicación web de estadística con React y Clean Architecture).
- **Arquitectura**: Capas core, application, infrastructure, presentation (React).
- **Diseño actual**: Modo oscuro con acentos en verde lima (#A3E4D7), tarjetas con efecto de cristal (`backdrop-filter: blur(10px)`), tipografía variable (Inter/Geist), bordes redondeados y sombras suaves.
- **Datos disponibles**: Los mismos que se usan para estadísticos, tabla de frecuencias y gráficos (array de números en `resultados.numeros`).
- **Objetivo**: Añadir un nuevo componente que muestre el diagrama de tallo y hoja de los datos actuales, con un diseño coherente y atractivo, ubicado en la página de resultados (`CalculosPage`), junto a las demás visualizaciones.
</context>

<task>
Implementar un componente `StemLeafDiagram.jsx` que genere y muestre el diagrama de tallo y hoja a partir de los datos numéricos proporcionados. El componente debe:
- Recibir como prop el array de datos (`numeros`).
- Ordenar los datos automáticamente.
- Generar la estructura tallo-hoja, donde el tallo representa las decenas (o la parte entera) y las hojas las unidades (o decimales) según la naturaleza de los datos.
- Mostrar el resultado en un formato limpio y legible, por ejemplo:
1 | 2 3 5 5 7
2 | 1 4 8 8
3 | 2 5 6 7 7 9 9

text
- Aplicar la estética actual: fondo oscuro, texto en blanco/verde lima, bordes redondeados, efecto glassmorphism en el contenedor, tipografía monoespaciada opcional para los números (se puede usar una fuente como 'JetBrains Mono' o 'Fira Code' para mejorar la legibilidad, pero manteniendo la coherencia).
- Añadir un título "Diagrama de Tallo y Hoja" con el mismo estilo que las demás secciones.
- Permitir al usuario alternar entre orden ascendente/descendente (opcional, pero deseable).
- Integrar el componente en `CalculosPage.jsx` junto a las otras visualizaciones (por ejemplo, después de la tabla de frecuencias o en una pestaña aparte).
</task>

<technical_requirements>

### 1. Librerías adicionales (opcional)
- Para la tipografía monoespaciada, se puede importar una fuente como 'Fira Code' o 'JetBrains Mono' desde Google Fonts y añadirla al `global.css`.
- No se requieren librerías externas para la lógica del diagrama; se implementará con JavaScript puro.

### 2. Estructura del componente
- Crear archivo `src/presentation/componentes/StemLeafDiagram.jsx`.
- El componente recibirá las props: `datos` (array de números) y opcionalmente `orden` ('asc' o 'desc').
- La lógica de generación:
- Ordenar los datos de menor a mayor.
- Agrupar por tallo: para números enteros, tallo = Math.floor(numero/10), hoja = numero % 10. Para decimales, se puede ajustar (por ejemplo, multiplicar por 10 para trabajar con una cifra decimal).
- Construir un objeto donde las claves son los tallos y los valores son arrays de hojas.
- Renderizar en una cuadrícula o lista con formato.

### 3. Estilos y diseño
- El contenedor principal debe tener las mismas propiedades que las tarjetas existentes: `background: rgba(0,0,0,0.5)`, `backdrop-filter: blur(10px)`, `border-radius: 20px`, `padding: 1.5rem`, `box-shadow` suave.
- El título debe usar la misma tipografía y color que los títulos de sección (por ejemplo, `color: #A3E4D7`, `font-weight: 600`).
- Para los tallos y hojas:
- Tallo: en negrita, color blanco o verde lima.
- Hojas: en fila, separadas por espacios, con color blanco y fuente monoespaciada opcional.
- Cada línea debe tener un margen inferior pequeño.
- Añadir un borde izquierdo sutil (verde lima) en el contenedor para darle estilo.
- Si se implementa la opción de orden, añadir un pequeño selector (botones) con el mismo estilo que los botones existentes.

### 4. Integración en CalculosPage
- En `CalculosPage.jsx`, después de la tabla de frecuencias o en una nueva fila, añadir el componente `<StemLeafDiagram datos={resultados.numeros} />`.
- Si se desea, se puede poner en una pestaña o acordeón para no sobrecargar la vista (opcional).

### 5. Manejo de datos
- Si los datos son negativos, el tallo debe representar el signo (por ejemplo, tallo -1 para números entre -10 y -1). Ajustar la lógica para agrupar correctamente.
- Si hay decimales, se puede redondear o mostrar una cifra decimal (por ejemplo, tallo = parte entera, hoja = primer decimal multiplicado por 10). Especificar en un comentario.

</technical_requirements>

<implementation_notes>
- La función de generación debe ser pura y sin efectos secundarios.
- Usar `useMemo` para evitar recalcular en cada render si los datos no cambian.
- Para la fuente monoespaciada, importar en `global.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap');
.mono {
  font-family: 'Fira Code', monospace;
}
Luego aplicar la clase a los números de hojas.

La opción de orden ascendente/descendente puede implementarse con un estado local que modifique el orden antes de la agrupación.

Si los datos son muchos (ej. más de 100), el diagrama puede ser grande; considerar agregar un scroll vertical con altura máxima.
</implementation_notes>

<execution_workflow>

Crear el archivo StemLeafDiagram.jsx en la carpeta de componentes.

Implementar la lógica de agrupación y renderizado.

Aplicar estilos consistentes con la paleta actual.

Importar y usar el componente en CalculosPage.jsx.

Probar con diferentes conjuntos de datos (enteros, decimales, negativos, repetidos).

Ajustar según feedback visual.
</execution_workflow>

<output_format>

Código completo de StemLeafDiagram.jsx.

Fragmento de CalculosPage.jsx mostrando la integración.

Breve explicación de la lógica de agrupación y formato.

Si se añaden estilos adicionales, incluirlos en el código.
</output_format>

<quality_gate>

¿El diagrama se genera correctamente con datos de ejemplo?

¿La presentación visual es coherente con el diseño actual (colores, efectos, tipografía)?

¿Maneja adecuadamente datos negativos y decimales?

¿El componente se integra sin errores en la página de resultados?

¿No se ha modificado ninguna lógica de negocio existente?

¿El código es legible y sigue las convenciones del proyecto?
</quality_gate>