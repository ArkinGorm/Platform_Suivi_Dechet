import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { reportService } from '../services/reportService';

const ReportsPage = () => {
  const { role } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    localisation: ''
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = role === 'citoyen'
          ? await reportService.getMesSignalements()
          : await reportService.getAllReports();
        setReports(res.data);
      } catch (error) {
        console.error('Erreur chargement signalements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await reportService.createReport(formData);
      alert('Signalement envoyé !');
      setFormData({ type: '', description: '', localisation: '' });
      // Recharger la liste
      const res = await reportService.getMesSignalements();
      setReports(res.data);
    } catch (error) {
      alert('Erreur lors de l\'envoi');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-6">Chargement...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Signalements</h1>

      {/* Formulaire pour les citoyens */}
      {role === 'citoyen' && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">Nouveau signalement</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Sélectionnez</option>
                <option value="bac_plein">Bac plein</option>
                <option value="bac_casse">Bac cassé</option>
                <option value="depot_sauvage">Dépôt sauvage</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Localisation</label>
              <input
                type="text"
                name="localisation"
                value={formData.localisation}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="Adresse ou coordonnées"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Envoyer
            </button>
          </form>
        </div>
      )}

      {/* Liste des signalements */}
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold p-4 border-b">
          {role === 'citoyen' ? 'Mes signalements' : 'Tous les signalements'}
        </h2>
        {reports.length === 0 ? (
          <p className="p-4 text-gray-500">Aucun signalement</p>
        ) : (
          <ul className="divide-y">
            {reports.map(report => (
              <li key={report.id} className="p-4">
                <div className="flex justify-between">
                  <span className="font-medium">{report.type}</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    report.statut === 'resolu' ? 'bg-green-100 text-green-700' :
                    report.statut === 'en_cours' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {report.statut}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                <p className="text-xs text-gray-400 mt-1">{report.localisation}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;