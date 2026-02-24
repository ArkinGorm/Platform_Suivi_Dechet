import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">
            Smart Bins – Gestion intelligente des déchets
          </h1>
          <p className="text-xl mb-8">
            Optimisez la collecte, réduisez les coûts, améliorez la propreté de votre ville.
          </p>
          {!isAuthenticated ? (
            <div className="space-x-4">
              <Link
                to="/login"
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800"
              >
                S'inscrire
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-lg mb-4">Bienvenue, {user?.nom} !</p>
              <Link
                to="/dashboard"
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
              >
                Accéder au tableau de bord
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Fonctionnalités principales
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">📊 Suivi en temps réel</h3>
            <p className="text-gray-600">
              Visualisez l'état de tous les bacs sur une carte interactive.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">🔔 Alertes automatiques</h3>
            <p className="text-gray-600">
              Recevez des notifications quand un bac est plein.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">📝 Signalements citoyens</h3>
            <p className="text-gray-600">
              Signalez un problème directement depuis l'application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;