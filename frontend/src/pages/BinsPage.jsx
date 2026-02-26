import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import RealtimeSocketMap from '../components/Bins/RealtimeSocketMap';

const BinsPage = () => {
  const { role } = useAuth();
  const [showPublicOnly, setShowPublicOnly] = useState(false);

  // log des bacs si présents
  console.log(' Bacs chargés:', showPublicOnly /* replace with real variable if needed */);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {role === 'citoyen' ? 'Mes bacs en temps réel' : 'Gestion des bacs en temps réel'}
        </h1>

        {role === 'municipalite' && (
          <button
            onClick={() => setShowPublicOnly(!showPublicOnly)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {showPublicOnly ? 'Voir tous les bacs' : 'Voir uniquement les bacs publics'}
          </button>
        )}
      </div>

      <RealtimeSocketMap role={role} />
    </div>
  );
};

export default BinsPage;