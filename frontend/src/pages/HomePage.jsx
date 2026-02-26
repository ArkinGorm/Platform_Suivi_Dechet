import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: '🗺️',
      title: 'Carte interactive',
      description: 'Suivez en temps réel le remplissage des bacs dans votre quartier.',
    },
    {
      icon: '📢',
      title: 'Signalement citoyen',
      description: 'Signalez un dépôt sauvage ou un bac endommagé en un clic.',
    },
    {
      icon: '📊',
      title: 'Tableau de bord',
      description: 'Visualisez les données et aidez votre mairie à mieux gérer.',
    },
    {
      icon: '🤝',
      title: 'Ensemble pour la propreté',
      description: 'Citoyens, municipalité : agissons pour un Sénégal plus propre.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <section className="relative bg-gradient-to-br from-green-600 to-green-800 text-white overflow-hidden">
        {/* Forme décorative (accolade sénégalaise) */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Smart Bins Sénégal
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-green-50">
            Une solution simple et moderne pour gérer les déchets dans nos villes.
          </p>

          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
              >
                Commencer
              </Link>
              <Link
                to="/login"
                className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition shadow-lg"
              >
                Se connecter
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-lg mb-4">Bienvenue, {user?.nom} !</p>
              <Link
                to="/dashboard"
                className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
              >
                Accéder au tableau de bord
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Section fonctionnalités */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Pour une ville plus propre
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Smart Bins connecte les citoyens et les municipalités pour une gestion plus efficace des déchets.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border border-gray-100"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appel à l'action */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Vous êtes une municipalité ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-green-50">
            Optimisez vos tournées, réduisez les coûts et améliorez la qualité de vie dans votre commune.
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block shadow-lg"
            >
              Créer un compte municipal
            </Link>
          )}
        </div>
      </section>

      {/* Footer simple */}
      <footer className="bg-white border-t py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          © 2026 Smart Bins Sénégal – Tous droits réservés.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;