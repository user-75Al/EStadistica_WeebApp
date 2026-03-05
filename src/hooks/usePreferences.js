import { useState, useEffect } from 'react';

export const usePreferences = () => {
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('weebapp_user_prefs');
    return saved ? JSON.parse(saved) : {
      visibleCharts: {
        histograma: true,
        ojiva: true,
        pareto: true,
        pie: true
      },
      lastAnalysisType: 'individual'
    };
  });

  useEffect(() => {
    localStorage.setItem('weebapp_user_prefs', JSON.stringify(preferences));
  }, [preferences]);

  const toggleChart = (chartId) => {
    setPreferences(prev => ({
      ...prev,
      visibleCharts: {
        ...prev.visibleCharts,
        [chartId]: !prev.visibleCharts[chartId]
      }
    }));
  };

  return { preferences, toggleChart };
};
