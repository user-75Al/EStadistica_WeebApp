import React from 'react';
import { VscInbox, VscEdit, VscSymbolEnum } from 'react-icons/vsc';

const EmptyState = ({ onManual, onRandom }) => (
  <div className="empty-state-container glass" style={{ padding: '4rem', textAlign: 'center', maxWidth: '700px', margin: '4rem auto' }}>
    <VscInbox size={60} style={{ color: 'var(--color-lime)', marginBottom: '1.5rem', opacity: 0.6 }} />
    <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>No hay datos para analizar</h2>
    <p style={{ color: 'var(--color-gray)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
      Para comenzar tu análisis estadístico profesional, por favor ingresa una muestra manualmente o genera datos de prueba aleatorios.
    </p>
    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
      <button className="action-btn-pill" onClick={onManual}><VscEdit /> Entrada Manual</button>
      <button className="action-btn-pill pdf-btn-new" onClick={onRandom}><VscSymbolEnum /> Datos Aleatorios</button>
    </div>
  </div>
);

export default EmptyState;
