import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import HomePage from './pages/HomePage';
import BinsPage from './pages/BinsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import RoleBasedRoute from './components/Auth/RoleBasedRoute';
import AdminPage from './pages/AdminPage';
import AdminUsersPage from './pages/AdminUsersPage';
import MunicipalitePage from './pages/MunicipalitePage';

// Route protégée
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            {/* Routes publiques */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Routes protégées */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />

            <Route path="/bins" element={
              <RoleBasedRoute allowedRoles={['municipalite', 'admin']}>
                <BinsPage />
              </RoleBasedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <AdminPage />
              </RoleBasedRoute>
            } />
            
            <Route path="/admin/users" element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <AdminUsersPage />
              </RoleBasedRoute>
            } />

            <Route path="/municipalite" element={
              <RoleBasedRoute allowedRoles={['municipalite', 'admin']}>
                <MunicipalitePage />
              </RoleBasedRoute>
            } />

            {/* Redirection 404 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;