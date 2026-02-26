import React from 'react';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  const sections = [
    {
      title: '👥 Utilisateurs',
      description: 'Gérer les comptes, modifier les rôles',
      link: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: '🗑️ Bacs',
      description: 'Ajouter, modifier ou supprimer des bacs',
      link: '/bins',
      color: 'bg-green-500'
    },
    {
      title: '📋 Signalements',
      description: 'Voir et traiter tous les signalements',
      link: '/admin/reports',
      color: 'bg-yellow-500'
    },
    {
      title: '⚙️ Paramètres',
      description: 'Configurer l’application (seuils, etc.)',
      link: '/admin/settings',
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Administration</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, index) => (
          <Link
            key={index}
            to={section.link}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border border-gray-100"
          >
            <div className={`w-12 h-12 rounded-full ${section.color} mb-4 flex items-center justify-center text-white text-xl`}>
              {section.title[0]}
            </div>
            <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
            <p className="text-gray-600">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;