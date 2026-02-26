import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role, loading } = useAuth();

  // Pendant le chargement, on peut afficher un indicateur
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, redirection vers login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si des rôles sont requis et que l'utilisateur n'a pas le bon rôle
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Tout est bon, on affiche le composant enfant
  return children;
};

export default RoleBasedRoute;