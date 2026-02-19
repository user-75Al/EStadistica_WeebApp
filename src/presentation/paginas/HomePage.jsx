import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BlurText from '../componentes/BlurText';
import StartButton from '../componentes/StartButton';
import Dock from '../componentes/Dock';
import { VscArchive, VscSettingsGear } from 'react-icons/vsc';

const HomePage = ({ onOptionSelect }) => {
  const [showDock, setShowDock] = useState(false);

  const dockItems = [
    { 
      icon: <VscArchive size={24} />, 
      label: 'Ingresar cadena', 
      onClick: () => onOptionSelect('manual') 
    },
    { 
      icon: <VscSettingsGear size={24} />, 
      label: 'Generar aleatorios', 
      onClick: () => onOptionSelect('random') 
    },
  ];

  // Imágenes originales
  const imagenesConceptos = [
    "/assets/img1.png",
    "/assets/img2.png",
    "/assets/img3.png",
    "/assets/img4.png",
    "/assets/img5.png"
  ];

  const imagenIntercalada = "/assets/img_intercalada.png";

  // Generar lista intercalada: Concepto 1 -> Intercalada -> Concepto 2 ... -> Concepto 5
  const listaFinal = [];
  imagenesConceptos.forEach((img, index) => {
    listaFinal.push({ src: img, type: 'full' });
    // Añadir la imagen 7 como separador entre conceptos
    if (index < imagenesConceptos.length - 1) {
      listaFinal.push({ src: imagenIntercalada, type: 'divider' });
    }
  });

  return (
    <div className="home-container" style={{ width: '100vw', overflowX: 'hidden', margin: 0, padding: 0, background: '#000000' }}>
      
      {/* SECCIÓN PRINCIPAL (HERO) */}
      <section style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'transparent' }}>
        <div style={{ zIndex: 2 }}>
          <BlurText
            text="Calculadora Estadística"
            delay={200}
            animateBy="words"
            direction="top"
            className="text-title"
          />
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ fontSize: '1.4rem', color: 'var(--color-gray)', margin: '1rem 0 2rem' }}
          >
            ¿Desea continuar?
          </motion.p>

          {!showDock ? (
            <div className="start-btn-container">
              <StartButton onClick={() => setShowDock(true)} />
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Dock 
                items={dockItems}
                panelHeight={80}
                baseItemSize={65}
                magnification={100}
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* SECCIONES DE IMÁGENES INTERCALADAS - Fondo negro garantizado */}
      <div className="conceptos-scroll" style={{ position: 'relative', zIndex: 10, width: '100vw', background: '#000000' }}>
        {listaFinal.map((item, idx) => (
          <section 
            key={idx}
            style={{ 
              height: item.type === 'divider' ? '50vh' : '100vh', // Imagen 7 más baja
              width: '100vw', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              overflow: 'hidden',
              margin: 0,
              padding: 0,
              background: '#000000' 
            }}
          >
            <motion.img 
              src={item.src} 
              alt={`Imagen ${idx + 1}`} 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.2 }}
              style={{ 
                width: '100%', // Ocupa todo el ancho
                height: '100%', 
                display: 'block', 
                objectFit: 'cover', // Cubre todo el área asignada
                margin: 0,
                padding: 0
              }} 
            />
          </section>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
