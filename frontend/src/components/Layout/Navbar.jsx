import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/notificationService';

const Navbar = () => {
  const { user, isAuthenticated, isMunicipalite, isAdmin, logout } = useAuth();
  const [notifCount, setNotifCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // Charger le nombre de notifications non lues
      notificationService.getUnread()
        .then(res => setNotifCount(res.data.unread || 0))
        .catch(err => console.error('Erreur chargement notifications:', err));
    }
  }, [isAuthenticated]);

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
          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:bg-green-700 px-3 py-2 rounded">
              Accueil
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:bg-green-700 px-3 py-2 rounded">
                  Dashboard
                </Link>

                {/* Notifications avec compteur */}
                <Link to="/notifications" className="relative hover:bg-green-700 px-3 py-2 rounded">
                  🔔
                  {notifCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifCount}
                    </span>
                  )}
                </Link>

                {/*{isMunicipalite && (
                  <Link to="/bins" className="hover:bg-green-700 px-3 py-2 rounded">
                    Bacs
                  </Link>
                )}*/}

                {isAdmin && (
                  <>
                    <Link to="/admin" className="hover:bg-green-700 px-3 py-2 rounded">
                      Administration
                    </Link>
                    {/* <Link to="/admin/add-bac" className="hover:bg-green-700 px-3 py-2 rounded"> 
                      + Ajouter un bac
                    </Link>*/}
                  </>
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