import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mon profil</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Nom</label>
            <p className="mt-1 text-lg">{user.nom || 'Non renseigné'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <p className="mt-1 text-lg">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Rôle</label>
            <p className="mt-1 text-lg capitalize">{user.role}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Membre depuis
            </label>
            <p className="mt-1 text-lg">
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : 'Non disponible'}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <button
            onClick={() => alert('Fonctionnalité à venir')}
            className="text-green-600 hover:underline text-sm"
          >
            Modifier mon profil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;