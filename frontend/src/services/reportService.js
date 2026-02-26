import api from './api';

export const reportService = {
  // Créer un signalement
  createReport: (data) => api.post('/reports', data),

  // Récupérer tous les signalements (municipalité)
  getAllReports: () => api.get('/reports'),

  // Récupérer les signalements du citoyen connecté
  getMesSignalements: () => api.get('/reports/mes-signalements'),

  // Récupérer un signalement par ID
  getReportById: (id) => api.get(`/reports/${id}`),

  // Mettre à jour le statut (municipalité)
  updateStatus: (id, status) => api.put(`/reports/${id}/statut`, { statut: status }),
};