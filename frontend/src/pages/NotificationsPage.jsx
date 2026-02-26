import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await notificationService.getMyNotifications();
        setNotifications(res.data.notifications || []);
      } catch (error) {
        console.error('Erreur chargement notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button
          onClick={markAllAsRead}
          className="text-sm text-green-600 hover:underline"
        >
          Tout marquer comme lu
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Aucune notification</p>
      ) : (
        <div className="space-y-3">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`p-4 rounded-lg border ${
                notif.is_read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
              }`}
              onClick={() => !notif.is_read && markAsRead(notif.id)}
            >
              <div className="flex justify-between">
                <h3 className="font-medium">{notif.title}</h3>
                <span className="text-xs text-gray-400">
                  {new Date(notif.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
              {!notif.is_read && (
                <span className="text-xs text-blue-600 mt-2 inline-block">
                  Nouveau
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;