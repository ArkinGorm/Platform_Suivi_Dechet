const pool = require('../../common/config/database');

const collectesController = {
  // 1. Enregistrer une nouvelle collecte
  async createCollecte(req, res) {
    try {
      const { bac_id, agent, camion_id, niveau_avant, note } = req.body;

      if (!bac_id) {
        return res.status(400).json({ error: 'bac_id requis' });
      }

      // Vérifier que le bac existe
      const bacExists = await pool.query(
        'SELECT id, reference FROM bacs WHERE id = $1',
        [bac_id]
      );

      if (bacExists.rows.length === 0) {
        return res.status(404).json({ error: 'Bac non trouvé' });
      }

      // Enregistrer la collecte
      const result = await pool.query(
        `INSERT INTO collectes (bac_id, agent, camion_id, niveau_avant, note)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [bac_id, agent, camion_id, niveau_avant, note]
      );

      // Optionnel : Ajouter une notification pour confirmer la collecte
      // (on pourra le faire plus tard)

      res.status(201).json({
        success: true,
        message: `Collecte enregistrée pour le bac ${bacExists.rows[0].reference}`,
        data: result.rows[0]
      });

    } catch (error) {
      console.error(' Erreur création collecte:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // 2. Récupérer toutes les collectes
  async getAllCollectes(req, res) {
    try {
      const { limit = 100, bac_id, startDate, endDate } = req.query;

      let query = `
        SELECT c.*, b.reference, b.type, q.nom as quartier_nom
        FROM collectes c
        JOIN bacs b ON c.bac_id = b.id
        LEFT JOIN quartiers q ON b.quartier_id = q.id
        WHERE 1=1
      `;
      const params = [];
      let paramIndex = 1;

      if (bac_id) {
        params.push(bac_id);
        query += ` AND c.bac_id = $${paramIndex++}`;
      }

      if (startDate) {
        params.push(startDate);
        query += ` AND c.date_collecte >= $${paramIndex++}`;
      }

      if (endDate) {
        params.push(endDate);
        query += ` AND c.date_collecte <= $${paramIndex++}`;
      }

      query += ` ORDER BY c.date_collecte DESC LIMIT $${paramIndex}`;
      params.push(limit);

      const result = await pool.query(query, params);

      res.json({
        total: result.rows.length,
        collectes: result.rows
      });

    } catch (error) {
      console.error(' Erreur récupération collectes:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // 3. Récupérer les collectes d'un bac spécifique
  async getCollectesByBac(req, res) {
    try {
      const { bac_id } = req.params;
      const { limit = 20 } = req.query;

      const result = await pool.query(
        `SELECT c.*, b.reference
         FROM collectes c
         JOIN bacs b ON c.bac_id = b.id
         WHERE c.bac_id = $1
         ORDER BY c.date_collecte DESC
         LIMIT $2`,
        [bac_id, limit]
      );

      res.json({
        bac_id,
        total: result.rows.length,
        collectes: result.rows
      });

    } catch (error) {
      console.error(' Erreur récupération collectes par bac:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // 4. Statistiques des collectes
  async getCollectesStats(req, res) {
    try {
      const { periode = 'semaine' } = req.query; // 'jour', 'semaine', 'mois'

      let interval;
      if (periode === 'jour') interval = '1 day';
      else if (periode === 'semaine') interval = '7 days';
      else interval = '30 days';

      // Nombre de collectes par jour
      const quotidien = await pool.query(`
        SELECT
          DATE(date_collecte) as date,
          COUNT(*) as nombre_collectes,
          COUNT(DISTINCT bac_id) as bacs_differents
        FROM collectes
        WHERE date_collecte > NOW() - $1::interval
        GROUP BY DATE(date_collecte)
        ORDER BY date DESC
      `, [interval]);

      // Statistiques globales
      const global = await pool.query(`
        SELECT
          COUNT(*) as total_collectes,
          COUNT(DISTINCT bac_id) as bacs_collectes,
          AVG(niveau_avant)::numeric(10,2) as niveau_moyen_avant_collecte,
          MAX(niveau_avant) as niveau_max_avant_collecte,
          MIN(niveau_avant) as niveau_min_avant_collecte
        FROM collectes
        WHERE date_collecte > NOW() - $1::interval
      `, [interval]);

      res.json({
        periode,
        quotidien: quotidien.rows,
        stats: global.rows[0]
      });

    } catch (error) {
      console.error(' Erreur statistiques collectes:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // 5. Dernière collecte d'un bac
  async getLastCollecte(req, res) {
    try {
      const { bac_id } = req.params;

      const result = await pool.query(
        `SELECT *
         FROM collectes
         WHERE bac_id = $1
         ORDER BY date_collecte DESC
         LIMIT 1`,
        [bac_id]
      );

      if (result.rows.length === 0) {
        return res.json({ message: 'Aucune collecte enregistrée pour ce bac' });
      }

      res.json(result.rows[0]);

    } catch (error) {
      console.error(' Erreur récupération dernière collecte:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = collectesController;