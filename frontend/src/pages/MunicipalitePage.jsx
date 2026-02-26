import React from 'react';
import { Link } from 'react-router-dom';

const MunicipalitePage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Espace Municipalité</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/bins" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2">🗑️ Gestion des bacs</h2>
          <p className="text-gray-600">Voir et modifier les bacs, consulter leur état.</p>
        </Link>

        <Link to="/reports" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2">📋 Signalements</h2>
          <p className="text-gray-600">Gérer les signalements des citoyens.</p>
        </Link>

        <Link to="/dashboard" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2">📊 Statistiques</h2>
          <p className="text-gray-600">Consulter les données et KPIs.</p>
        </Link>
      </div>
    </div>
  );
};

export default MunicipalitePage;