const pool = require('../../common/config/database');

const notificationsService = {
  // Créer une notification pour un utilisateur
  async createNotification(user_id, type, title, message, data = null) {
    try {
      const result = await pool.query(
        `INSERT INTO notifications (user_id, type, title, message, data)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [user_id, type, title, message, data]
      );
      
      console.log(` Notification créée pour l'utilisateur ${user_id}: ${title}`);
      return result.rows[0];
    } catch (error) {
      console.error('Erreur création notification:', error);
      return null;
    }
  },

  // Créer une notification pour tous les utilisateurs d'un rôle
  async createNotificationForRole(role, type, title, message, data = null) {
    try {
      const users = await pool.query(
        'SELECT id FROM users WHERE role = $1',
        [role]
      );

      for (const user of users.rows) {
        await this.createNotification(user.id, type, title, message, data);
      }

      console.log(` Notifications créées pour ${users.rows.length} utilisateurs (rôle: ${role})`);
    } catch (error) {
      console.error('Erreur création notifications pour rôle:', error);
    }
  },

  // Créer une notification pour les responsables municipaux d'un quartier
  async createNotificationForMunicipalite(quartier_id, type, title, message, data = null) {
    try {
      const users = await pool.query(
        `SELECT id FROM users 
         WHERE role = 'municipalite' 
         AND (quartier_id = $1 OR quartier_id IS NULL)`,
        [quartier_id]
      );

      for (const user of users.rows) {
        await this.createNotification(user.id, type, title, message, data);
      }

      console.log(` Notifications créées pour la municipalité du quartier ${quartier_id}`);
    } catch (error) {
      console.error('Erreur création notifications municipalité:', error);
    }
  }
};

module.exports = notificationsService;