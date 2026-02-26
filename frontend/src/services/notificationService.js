import api from './api';

export const notificationService = {
  // Récupérer les notifications de l'utilisateur
  getMyNotifications: () => api.get('/notifications'),

  // Récupérer les notifications non lues
  getUnread: () => api.get('/notifications?unreadOnly=true'),

  // Marquer comme lue
  markAsRead: (id) => api.put(`/notifications/${id}/read`),

  // Marquer toutes comme lues
  markAllAsRead: () => api.put('/notifications/read-all'),
};