import React, { useState } from 'react';
import api from '../services/api';

const AdminAddBacPage = () => {
  const [formData, setFormData] = useState({
    reference: '',
    latitude: '',
    longitude: '',
    type: 'ordures',
    capteur_id: '',
    proprietaire_id: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.post('/bins', formData);
      setMessage('✅ Bac ajouté avec succès');
      console.log('Bac créé:', response.data);
      setFormData({
        reference: '',
        latitude: '',
        longitude: '',
        type: 'ordures',
        capteur_id: '',
        proprietaire_id: ''
      });
    } catch (error) {
      console.error('Erreur complète:', error.response?.data);
      setMessage('❌ Erreur : ' + (error.response?.data?.error || 'Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ajouter un bac</h1>

      {message && (
        <div className={`p-4 rounded mb-4 ${
          message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Référence <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ex: BAC001"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ex: 14.7167"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ex: -17.4677"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="ordures">Ordures ménagères</option>
            <option value="recyclage">Recyclage</option>
            <option value="verre">Verre</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID du capteur
          </label>
          <input
            type="text"
            name="capteur_id"
            value={formData.capteur_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ex: SENSOR001 (optionnel)"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Propriétaire (UUID)
          </label>
          <input
            type="text"
            name="proprietaire_id"
            value={formData.proprietaire_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="UUID du citoyen (laisser vide pour bac public)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Laissez vide pour un bac public (appartient à la municipalité)
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Ajout en cours...' : 'Ajouter le bac'}
        </button>
      </form>
    </div>
  );
};

export default AdminAddBacPage;