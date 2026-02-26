import api from './api';

export const dashboardService = {
  // Récupérer les KPI (adapté au rôle)
  getKPI: (role) => {
    if (role === 'citoyen') {
      // Route spécifique pour citoyen
      return api.get('/citoyen/dashboard');
    } else {
      // Route pour municipalité/admin
      return api.get('/analytics/dashboard');
    }
  },

  // Récupérer les signalements du citoyen connecté
  getMesSignalements: () => api.get('/reports/mes-signalements'),
};