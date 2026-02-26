import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions = ({ role }) => {
  const actions = {
    citoyen: [
      { to: '/reports', label: 'Signaler un problème', icon: '📝', color: 'bg-yellow-500' },
      { to: '/bins', label: 'Voir les bacs', icon: '🗺️', color: 'bg-blue-500' },
      { to: '/profile', label: 'Mon profil', icon: '👤', color: 'bg-gray-500' }
    ],
    municipalite: [
      { to: '/bins', label: 'Gérer les bacs', icon: '🗑️', color: 'bg-green-500' },
      { to: '/reports', label: 'Signalements', icon: '📋', color: 'bg-yellow-500' }
    ],
    admin: [
      { to: '/admin', label: 'Administration', icon: '⚙️', color: 'bg-red-500' },
      { to: '/bins', label: 'Gérer les bacs', icon: '🗑️', color: 'bg-green-500' }
    ]
  };

  const userActions = actions[role] || actions.citoyen;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {userActions.map((action, index) => (
          <Link
            key={index}
            to={action.to}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center text-white mb-2`}>
              {action.icon}
            </div>
            <span className="text-sm text-center text-gray-700">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;