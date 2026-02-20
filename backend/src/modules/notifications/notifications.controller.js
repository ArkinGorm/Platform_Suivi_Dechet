const pool = require('../../common/config/database');

const notificationsController = {
  // Récupérer les notifications de l'utilisateur connecté
  async getMyNotifications(req, res) {
    try {
      const user_id = req.user.id;
      const { limit = 50, unreadOnly = false } = req.query;

      let query = `
        SELECT * FROM notifications
        WHERE user_id = $1
      `;
      
      if (unreadOnly === 'true') {
        query += ` AND is_read = false`;
      }
      
      query += ` ORDER BY created_at DESC LIMIT $2`;

      const result = await pool.query(query, [user_id, limit]);

      // Compter les non lues
      const unreadCount = await pool.query(
        `SELECT COUNT(*) FROM notifications 
         WHERE user_id = $1 AND is_read = false`,
        [user_id]
      );

      res.json({
        total: result.rows.length,
        unread: parseInt(unreadCount.rows[0].count),
        notifications: result.rows
      });

    } catch (error) {
      console.error('Erreur récupération notifications:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // Marquer une notification comme lue
  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      const result = await pool.query(
        `UPDATE notifications 
         SET is_read = true 
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [id, user_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Notification non trouvée' });
      }

      res.json({
        success: true,
        message: 'Notification marquée comme lue',
        data: result.rows[0]
      });

    } catch (error) {
      console.error('Erreur marquage notification:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // Marquer toutes les notifications comme lues
  async markAllAsRead(req, res) {
    try {
      const user_id = req.user.id;

      const result = await pool.query(
        `UPDATE notifications 
         SET is_read = true 
         WHERE user_id = $1 AND is_read = false
         RETURNING id`,
        [user_id]
      );

      res.json({
        success: true,
        message: `${result.rowCount} notifications marquées comme lues`,
        count: result.rowCount
      });

    } catch (error) {
      console.error('Erreur marquage toutes notifications:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // Supprimer une notification
  async deleteNotification(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      const result = await pool.query(
        `DELETE FROM notifications 
         WHERE id = $1 AND user_id = $2
         RETURNING id`,
        [id, user_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Notification non trouvée' });
      }

      res.json({
        success: true,
        message: 'Notification supprimée'
      });

    } catch (error) {
      console.error('Erreur suppression notification:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = notificationsController;