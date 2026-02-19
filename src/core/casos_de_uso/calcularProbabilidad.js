/**
 * Calcula la probabilidad empírica de un evento basado en una condición.
 * @param {number[]} datos - Array de datos numéricos.
 * @param {string} condicion - Condición lógica (ej: "> 30", ">= 15 and < 40").
 * @returns {Object} - Resultados del cálculo de probabilidad.
 */
export const calcularProbabilidad = (datos, condicion) => {
  if (!datos || datos.length === 0 || !condicion) return null;

  // Limpiar y normalizar la condición
  let condOriginal = condicion.trim();
  let cond = condOriginal.toLowerCase();
  
  // Reemplazar operadores lógicos
  cond = cond.replace(/\band\b/g, ' && ').replace(/\bor\b/g, ' || ');
  
  // Permitir "valor" o "x" como referencia al dato
  cond = cond.replace(/\bvalor\b/g, 'x');
  
  // Si la condición empieza con un operador, prefijar con 'x'
  if (/^[<>=!]/.test(cond)) {
    cond = 'x ' + cond;
  } else if (!cond.includes('x')) {
    // Si no tiene 'x' ni empieza con operador, pero tiene algo como "30"
    // Esto es más ambiguo, mejor asumimos que el usuario sigue el formato
  }

  // Corregir el operador de igualdad (de = a ===)
  // Buscamos '=' que no esté precedido por <, >, !, ni seguido por =
  cond = cond.replace(/(^|[^<>!=])=([^=]|$)/g, '$1===$2');

  let favorablesCount = 0;
  let error = null;

  try {
    // Crear una función dinámica para evaluar la condición
    // eslint-disable-next-line no-new-func
    const evaluator = new Function('x', `try { return ${cond}; } catch(e) { return false; }`);
    
    const favorables = datos.filter(x => evaluator(x));
    favorablesCount = favorables.length;
  } catch (e) {
    error = "Condición no válida. Usa el formato: >30, >=15 and <40, =25";
  }

  if (error) return { error };

  const total = datos.length;
  const prob = total > 0 ? favorablesCount / total : 0;

  return {
    favorables: favorablesCount,
    total: total,
    probabilidad: prob.toFixed(4),
    porcentaje: (prob * 100).toFixed(2),
    espacioMuestral: [...new Set(datos)].sort((a, b) => a - b)
  };
};
