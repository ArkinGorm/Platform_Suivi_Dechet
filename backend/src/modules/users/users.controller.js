const pool = require('../../common/config/database');

const usersController = {
  // 1. Récupérer tous les utilisateurs (admin seulement)
  async getAllUsers(req, res) {
    try {
      const { role, quartier, search } = req.query;

      let query = `
        SELECT id, email, nom, role, quartier_id, created_at
        FROM users
        WHERE 1=1
      `;
      const params = [];

      if (role) {
        params.push(role);
        query += ` AND role = $${params.length}`;
      }

      if (quartier) {
        params.push(quartier);
        query += ` AND quartier_id = $${params.length}`;
      }

      if (search) {
        params.push(`%${search}%`);
        query += ` AND (nom ILIKE $${params.length} OR email ILIKE $${params.length})`;
      }

      query += ` ORDER BY created_at DESC`;

      const result = await pool.query(query, params);

      res.json({
        total: result.rows.length,
        users: result.rows
      });

    } catch (error) {
      console.error('Erreur récupération utilisateurs:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // 2. Récupérer un utilisateur par ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `SELECT id, email, nom, role, quartier_id, created_at
         FROM users
         WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json(result.rows[0]);

    } catch (error) {
      console.error('Erreur récupération utilisateur:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // 3. Mettre à jour le rôle d'un utilisateur
  async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const validRoles = ['citoyen', 'municipalite', 'admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Rôle invalide' });
      }

      // Empêcher un admin de se modifier lui-même (optionnel)
      if (id === req.user.id && role !== req.user.role) {
        return res.status(403).json({ error: 'Vous ne pouvez pas modifier votre propre rôle' });
      }

      const result = await pool.query(
        `UPDATE users
         SET role = $1
         WHERE id = $2
         RETURNING id, email, nom, role, quartier_id`,
        [role, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json({
        success: true,
        message: `Rôle modifié avec succès`,
        user: result.rows[0]
      });

    } catch (error) {
      console.error('Erreur mise à jour rôle:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // 4. Supprimer un utilisateur
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Empêcher l'auto-suppression
      if (id === req.user.id) {
        return res.status(403).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' });
      }

      const result = await pool.query(
        `DELETE FROM users WHERE id = $1 RETURNING id`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json({
        success: true,
        message: 'Utilisateur supprimé'
      });

    } catch (error) {
      console.error('Erreur suppression utilisateur:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // 5. Récupérer les statistiques utilisateurs (pour dashboard)
  async getUserStats(req, res) {
    try {
      const stats = await pool.query(`
        SELECT
          COUNT(*) as total,
          COUNT(CASE WHEN role = 'citoyen' THEN 1 END) as citoyens,
          COUNT(CASE WHEN role = 'municipalite' THEN 1 END) as municipalites,
          COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins
        FROM users
      `);

      const recent = await pool.query(`
        SELECT id, email, nom, role, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT 5
      `);

      res.json({
        stats: stats.rows[0],
        recent: recent.rows
      });

    } catch (error) {
      console.error('Erreur statistiques utilisateurs:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = usersController;