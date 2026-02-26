import api from './api';

export const bacService = {
  // Récupérer tous les bacs (admin / municipalité)
  getAllBacs: () => api.get('/bins'),

  // Récupérer les bacs du citoyen connecté
  getMesBacs: () => api.get('/bins/mes-bacs'),

  // Récupérer les bacs publics
  getPublicBacs: () => api.get('/bins/publics'),

  // Récupérer les détails d'un bac
  getBacById: (id) => api.get(`/bins/${id}`),
};