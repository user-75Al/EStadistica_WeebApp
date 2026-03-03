import React from 'react';
import '../estilos/ExplicacionCards.css';

const ExplicacionProcedimiento = ({ resultados }) => {
  if (!resultados) return null;

  const { estadisticos, agrupados } = resultados;

  const pasos = [
    {
      titulo: "1. Preparación de Datos",
      desc: `Primero ordenamos los ${resultados.datosOriginales.length} datos de forma ascendente. El valor mínimo es ${estadisticos.min} y el máximo es ${estadisticos.max}, dándonos un rango total de ${estadisticos.rango}.`
    },
    {
      titulo: "2. Tendencia Central",
      desc: `La media (promedio) es ${estadisticos.media}. La mediana, que es el valor central, es ${estadisticos.mediana}. La moda (valor más frecuente) es ${estadisticos.moda}.`
    },
    {
      titulo: "3. Dispersión",
      desc: `Para medir qué tan alejados están los datos del promedio, calculamos la varianza (${estadisticos.varianza}) y la desviación estándar (${estadisticos.desviacion}). Esto indica que tus datos varían en promedio ${estadisticos.desviacion} unidades respecto a la media.`
    },
    {
      titulo: "4. Datos Agrupados (Sturges)",
      desc: `Aplicamos la regla de Sturges para crear ${agrupados.k} intervalos de clase con una amplitud de ${agrupados.amplitud}. Esto permite organizar los datos en grupos para un análisis visual más claro.`
    }
  ];

  return (
    <div className="results-section">
      <h3>Interpretación Paso a Paso</h3>
      <div className="explicacion-container">
        {pasos.map((paso, idx) => (
          <div key={idx} className="card-explicacion">
            <p className="card-title">{paso.titulo}</p>
            <p className="small-desc">{paso.desc}</p>
            <div className="go-corner">
              <div className="go-arrow">→</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplicacionProcedimiento;
