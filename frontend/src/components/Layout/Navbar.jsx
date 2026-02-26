import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isMunicipalite, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Accueil */}
          <Link to="/" className="text-xl font-bold">
            Smart Bins
          </Link>

          {/* Liens de navigation */}
          <div className="flex space-x-4">
            <Link to="/" className="hover:bg-green-700 px-3 py-2 rounded">
              Accueil
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:bg-green-700 px-3 py-2 rounded">
                  Dashboard
                </Link>

                {isMunicipalite && (
                  <Link to="/bins" className="hover:bg-green-700 px-3 py-2 rounded">
                    Bacs
                  </Link>
                )}

                {isAdmin && (
                  <Link to="/admin" className="hover:bg-green-700 px-3 py-2 rounded">
                    Administration
                  </Link>
                )}

                <Link to="/profile" className="hover:bg-green-700 px-3 py-2 rounded">
                  {user?.nom || 'Profil'}
                </Link>

                <button
                  onClick={handleLogout}
                  className="hover:bg-green-700 px-3 py-2 rounded"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:bg-green-700 px-3 py-2 rounded">
                  Connexion
                </Link>
                <Link to="/register" className="hover:bg-green-700 px-3 py-2 rounded">
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;