import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bacService } from '../services/bacService';
import { reportService } from '../services/reportService';
import { notificationService } from '../services/notificationService';
import { dashboardService } from '../services/dashboardService';
import KPICards from '../components/Dashboard/KPICards';
import QuickActions from '../components/Dashboard/QuickActions';

const DashboardPage = () => {
  const { user, role } = useAuth();
  const [kpiData, setKpiData] = useState(null);
  const [mesBacs, setMesBacs] = useState([]);
  const [mesSignalements, setMesSignalements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (role === 'citoyen') {
          // Données pour citoyen
          const [bacsRes, signalementsRes, notifRes] = await Promise.all([
            bacService.getMesBacs(),
            reportService.getMesSignalements(),
            notificationService.getUnread()
          ]);

          setMesBacs(bacsRes.data);
          setMesSignalements(signalementsRes.data);
          setNotifications(notifRes.data.notifications || []);

          setKpiData({
            bacs: { total: bacsRes.data.length },
            signalements: { total: signalementsRes.data.length },
            notifications: { non_lues: notifRes.data.unread || 0 }
          });
        } 
        else {
          // Données pour municipalité/admin via l'API analytics
          const kpiRes = await dashboardService.getKPI();
          setKpiData(kpiRes.data);
        }
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
        setError('Impossible de charger les données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Chargement...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Bonjour, {user?.nom || 'utilisateur'} 👋
      </h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {kpiData && <KPICards data={kpiData} role={role} />}

      <QuickActions role={role} />

      {role === 'citoyen' && mesBacs.length > 0 && (
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">🗑️ Mes bacs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mesBacs.map(bac => (
            <div key={bac.id} className="bg-white p-4 rounded-lg shadow border">
              <p className="font-medium">{bac.reference}</p>
              <p className="text-sm text-gray-600">
              État : {bac.etat || 'Non disponible'}
              </p>
              {bac.dernier_niveau && (
                <p className="text-sm text-gray-600">
                  Niveau : {bac.dernier_niveau}%
                </p>
            )}
            {bac.dernier_releve && (
              <p className="text-xs text-gray-400 mt-2">
                Dernier relevé : {new Date(bac.dernier_releve).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )}

      {/* Section : Mes signalements */}
      {role === 'citoyen' && mesSignalements.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">📋 Mes signalements</h2>
          <div className="space-y-2">
            {mesSignalements.slice(0, 3).map(s => (
              <div key={s.id} className="bg-gray-50 p-3 rounded">
                <p className="font-medium">{s.type}</p>
                <p className="text-sm text-gray-600">Statut : {s.statut}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section : Notifications récentes */}
      {role === 'citoyen' && notifications.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">🔔 Notifications</h2>
          <div className="space-y-2">
            {notifications.slice(0, 3).map(n => (
              <div key={n.id} className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-gray-600">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;