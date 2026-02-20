const pool = require('../../common/config/database');

const reportsController = {
  // 1. Créer un signalement
  async createReport(req, res) {
    try {
      const { type, latitude, longitude, description, photo_url } = req.body;
      const citoyen_id = req.user.id;

      // Validation
      if (!type || !latitude || !longitude) {
        return res.status(400).json({
          error: 'Champs requis : type, latitude, longitude'
        });
      }

      const result = await pool.query(
        `INSERT INTO signalements 
         (citoyen_id, type, latitude, longitude, description, photo_url, statut)
         VALUES ($1, $2, $3, $4, $5, $6, 'en_attente')
         RETURNING *`,
        [citoyen_id, type, latitude, longitude, description, photo_url]
      );

      res.status(201).json({
        success: true,
        message: 'Signalement envoyé',
        data: result.rows[0]
      });

    } catch (error) {
      console.error('Erreur création signalement:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // 2. Récupérer tous les signalements
  async getAllReports(req, res) {
    try {
      const result = await pool.query(
        `SELECT s.*, u.nom as citoyen_nom, u.email 
         FROM signalements s
         LEFT JOIN users u ON s.citoyen_id = u.id
         ORDER BY s.created_at DESC`
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Erreur récupération signalements:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // 3. Récupérer les signalements d'un citoyen connecté
  async getMyReports(req, res) {
    try {
      const citoyen_id = req.user.id;

      const result = await pool.query(
        `SELECT * FROM signalements 
         WHERE citoyen_id = $1 
         ORDER BY created_at DESC`,
        [citoyen_id]
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Erreur récupération mes signalements:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // 4. Récupérer un signalement par ID
  async getReportById(req, res) {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `SELECT s.*, u.nom, u.email 
         FROM signalements s
         LEFT JOIN users u ON s.citoyen_id = u.id
         WHERE s.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Signalement non trouvé' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erreur récupération signalement:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // 5. Mettre à jour le statut d'un signalement
  async updateReportStatus(req, res) {
    try {
      const { id } = req.params;
      const { statut } = req.body;

      const validStatuses = ['en_attente', 'en_cours', 'resolu'];
      if (!validStatuses.includes(statut)) {
        return res.status(400).json({ error: 'Statut invalide' });
      }

      const result = await pool.query(
        `UPDATE signalements 
         SET statut = $1, 
             resolved_at = CASE WHEN $1 = 'resolu' THEN NOW() ELSE resolved_at END
         WHERE id = $2
         RETURNING *`,
        [statut, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Signalement non trouvé' });
      }

      res.json({
        success: true,
        message: 'Statut mis à jour',
        data: result.rows[0]
      });

    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = reportsController;