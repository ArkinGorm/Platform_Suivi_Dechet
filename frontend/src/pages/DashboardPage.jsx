import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dashboardService } from '../services/dashboardService';
import bacServices from '../services/bacServices';
import KPICards from '../components/Dashboard/KPICards';
import QuickActions from '../components/Dashboard/QuickActions';

const DashboardPage = () => {
  const { user, role } = useAuth();
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mesBacs, setMesBacs] = useState([]);

  // Données factices pour citoyen (si API pas encore prête)
  const mockCitoyenData = {
    bacs: { total: 12 },
    mesSignalements: 3
  };

  // Données factices pour municipalité/admin
  const mockMunicipaliteData = {
    bacs: {
      total: 45,
      rouges: 8,
      taux_remplissage_moyen: 67.5
    },
    signalements: {
      en_attente: 5
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (role === 'citoyen') {
          // Charger ses bacs
          const bacsRes = await bacServices.getMesBacs();
          setMesBacs(bacsRes); // L'API renvoie directement le tableau selon le contrôleur actuel

          // Charger ses signalements (optionnel, selon dashboardService)
          let mesSignalementsCount = 0;
          try {
            const signalementsRes = await dashboardService.getMesSignalements();
            mesSignalementsCount = signalementsRes.data.length;
          } catch {
            mesSignalementsCount = mockCitoyenData.mesSignalements;
          }

          // Construire les données pour KPICards
          setKpiData({
            bacs: {
              total: bacsRes.length, // Le vrai nombre de ses bacs
            },
            mesSignalements: mesSignalementsCount
          });
        } else {
          // Pour municipalité/admin : données globales
          const response = await dashboardService.getKPI(role);
          setKpiData(response.data);
        }
      } catch (error) {
        setError('Erreur lors du chargement des données');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Chargement du tableau de bord...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* En-tête personnalisé */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Bonjour, {user?.nom || 'utilisateur'} 👋
        </h1>
        <p className="text-gray-600">
          {role === 'citoyen' && "Bienvenue sur votre espace citoyen."}
          {role === 'municipalite' && "Espace municipalité – Suivez l'activité de votre ville."}
          {role === 'admin' && "Espace administrateur – Gérez l'application."}
        </p>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Indicateurs clés */}
      {kpiData && (
        <div className="mb-8">
          <KPICards data={kpiData} role={role} />
        </div>
      )}

      {/* Actions rapides */}
      <div className="mb-8">
        <QuickActions role={role} />
      </div>

      {role === 'citoyen' && mesBacs.length > 0 && (
        <div className="mt-8 mb-8">
          <h2 className="text-lg font-semibold mb-4">Mes bacs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mesBacs.map(bac => (
              <div key={bac.id} className="bg-white p-4 rounded-lg shadow">
                <p className="font-medium">{bac.reference || `Bac #${bac.id}`}</p>
                <p className="text-sm text-gray-600">État : {bac.etat || 'Inconnu'}</p>
                {bac.dernier_niveau && (
                  <p className="text-sm text-gray-600">Niveau : {bac.dernier_niveau}%</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sections spécifiques selon le rôle */}
      {role === 'citoyen' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-green-800 mb-2">
            🌱 Votre impact
          </h2>
          <p className="text-green-700">
            Merci de contribuer à une ville plus propre !
          </p>
        </div>
      )}

      {(role === 'municipalite' || role === 'admin') && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            📊 Outils de gestion
          </h2>
          <p className="text-blue-700 mb-4">
            Accédez aux fonctionnalités avancées :
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/bins"
              className="text-blue-600 hover:underline bg-white px-4 py-2 rounded shadow-sm"
            >
              Gérer les bacs
            </a>
            <a
              href="/reports"
              className="text-blue-600 hover:underline bg-white px-4 py-2 rounded shadow-sm"
            >
              Signalements
            </a>
            {role === 'admin' && (
              <a
                href="/admin"
                className="text-blue-600 hover:underline bg-white px-4 py-2 rounded shadow-sm"
              >
                Administration
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;