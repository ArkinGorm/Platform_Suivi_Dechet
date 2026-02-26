import React, { useState } from 'react';
import BinsMap from '../components/Bins/BinsMap';

const BinsPage = () => {
  const [viewMode, setViewMode] = useState('map'); // 'map' ou 'list'
  const [filterMode, setFilterMode] = useState('all'); // 'all' ou 'public'

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Gestion des bacs</h1>

        <div className="flex flex-wrap items-center gap-4">
          {/* Filtres de bacs */}
          <div className="flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg border border-gray-200 ${filterMode === 'all'
                  ? 'bg-blue-50 text-blue-700 border-blue-200 z-10'
                  : 'bg-white text-gray-900 hover:bg-gray-100 hover:text-blue-700'
                }`}
            >
              Tous les bacs
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('public')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg border border-l-0 border-gray-200 ${filterMode === 'public'
                  ? 'bg-blue-50 text-blue-700 border-blue-200 z-10'
                  : 'bg-white text-gray-900 hover:bg-gray-100 hover:text-blue-700'
                }`}
            >
              Bacs publics
            </button>
          </div>

          {/* Boutons de changement de vue */}
          <div className="flex space-x-2 border-l pl-4 border-gray-300">
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded ${viewMode === 'map'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Carte
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded ${viewMode === 'list'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Liste
            </button>
          </div>
        </div>
      </div>

      {/* Affichage selon le mode choisi */}
      {viewMode === 'map' ? (
        <BinsMap filterMode={filterMode} />
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-center">
            Vue liste à venir...
          </p>
        </div>
      )}
    </div>
  );
};

export default BinsPage;