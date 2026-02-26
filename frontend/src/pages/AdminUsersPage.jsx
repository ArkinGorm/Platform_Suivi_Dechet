import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data.users || response.data);
      } catch (error) {
        console.error('Erreur chargement utilisateurs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const changeRole = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error('Erreur changement rôle:', error);
      alert('Impossible de modifier le rôle');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Impossible de supprimer');
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4">{user.nom || '-'}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => changeRole(user.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="citoyen">Citoyen</option>
                    <option value="municipalite">Municipalité</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;