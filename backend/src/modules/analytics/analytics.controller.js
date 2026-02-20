const pool = require('../../common/config/database');

const analyticsController = {
  // 1. Récupérer les KPI principaux
  async getDashboardKPI(req, res) {
    try {
      // Total bacs
      const totalBacs = await pool.query('SELECT COUNT(*) FROM bacs');

      // Dernière lecture pour chaque bac
      const etatsBacs = await pool.query(`
        WITH dernieres_lectures AS (
          SELECT DISTINCT ON (bac_id) bac_id, niveau_remplissage
          FROM lectures_capteurs
          ORDER BY bac_id, timestamp DESC
        )
        SELECT
          COUNT(CASE WHEN niveau_remplissage >= 90 THEN 1 END) as bacs_rouges,
          COUNT(CASE WHEN niveau_remplissage >= 70 AND niveau_remplissage < 90 THEN 1 END) as bacs_oranges,
          COUNT(CASE WHEN niveau_remplissage < 70 THEN 1 END) as bacs_verts,
          AVG(niveau_remplissage) as taux_moyen
        FROM dernieres_lectures
      `);

      // Signalements
      const signalements = await pool.query(`
        SELECT
          COUNT(CASE WHEN statut = 'en_attente' THEN 1 END) as en_attente,
          COUNT(CASE WHEN statut = 'en_cours' THEN 1 END) as en_cours,
          COUNT(CASE WHEN statut = 'resolu' THEN 1 END) as resolus
        FROM signalements
      `);

      // Collectes aujourd'hui
      const collectesToday = await pool.query(`
        SELECT COUNT(*) FROM collectes
        WHERE DATE(date_collecte) = CURRENT_DATE
      `);

      res.json({
        bacs: {
          total: parseInt(totalBacs.rows[0].count),
          rouges: parseInt(etatsBacs.rows[0].bacs_rouges) || 0,
          oranges: parseInt(etatsBacs.rows[0].bacs_oranges) || 0,
          verts: parseInt(etatsBacs.rows[0].bacs_verts) || 0,
          taux_remplissage_moyen: parseFloat(etatsBacs.rows[0].taux_moyen || 0).toFixed(1)
        },
        signalements: {
          en_attente: parseInt(signalements.rows[0].en_attente),
          en_cours: parseInt(signalements.rows[0].en_cours),
          resolus: parseInt(signalements.rows[0].resolus),
          total: parseInt(signalements.rows[0].en_attente) + 
                  parseInt(signalements.rows[0].en_cours) + 
                  parseInt(signalements.rows[0].resolus)
        },
        collectes_aujourdhui: parseInt(collectesToday.rows[0].count)
      });

    } catch (error) {
      console.error('Erreur récupération KPI:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  async getRemplissageEvolution(req, res) {
    try {
      const { periode = 'jour' } = req.query; // 'jour', 'semaine', 'mois'

      let interval;
      let format;
      
      if (periode === 'jour') {
        interval = '24 hours';
        format = 'HH24';
      } else if (periode === 'semaine') {
        interval = '7 days';
        format = 'YYYY-MM-DD';
      } else {
        interval = '30 days';
        format = 'YYYY-MM-DD';
      }

      console.log('Intervalle utilisé:', interval); // Pour debug

      const result = await pool.query(`
        SELECT
          DATE(timestamp) as date,
          EXTRACT(HOUR FROM timestamp) as heure,
          AVG(niveau_remplissage)::numeric(10,2) as moyenne,
          MAX(niveau_remplissage) as maximum,
          MIN(niveau_remplissage) as minimum
        FROM lectures_capteurs
        WHERE timestamp > NOW() - $1::interval
        GROUP BY DATE(timestamp), EXTRACT(HOUR FROM timestamp)
        ORDER BY date DESC, heure DESC
      `, [interval]);

      res.json({
        periode,
        total: result.rows.length,
        data: result.rows
      });

    } catch (error) {
      console.error('❌ Erreur évolution remplissage:', error);
      res.status(500).json({ 
        error: 'Erreur serveur',
        details: error.message 
      });
    }
  },

  // 3. Classement des quartiers par remplissage
  async getQuartiersRanking(req, res) {
    try {
      const result = await pool.query(`
        WITH dernieres_lectures AS (
          SELECT DISTINCT ON (b.id) b.quartier_id, l.niveau_remplissage
          FROM bacs b
          LEFT JOIN lectures_capteurs l ON b.id = l.bac_id
          ORDER BY b.id, l.timestamp DESC
        )
        SELECT
          q.id,
          q.nom,
          q.ville,
          COUNT(dl.niveau_remplissage) as bacs_avec_donnees,
          AVG(dl.niveau_remplissage) as taux_moyen,
          COUNT(CASE WHEN dl.niveau_remplissage >= 90 THEN 1 END) as bacs_rouges
        FROM quartiers q
        LEFT JOIN bacs b ON q.id = b.quartier_id
        LEFT JOIN dernieres_lectures dl ON b.id = dl.quartier_id
        GROUP BY q.id, q.nom, q.ville
        ORDER BY taux_moyen DESC NULLS LAST
      `);

      res.json(result.rows);

    } catch (error) {
      console.error('Erreur classement quartiers:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // 4. Activité des signalements (7 derniers jours)
  async getSignalementsActivity(req, res) {
    try {
      const result = await pool.query(`
        SELECT
          DATE(created_at) as date,
          COUNT(*) as total,
          COUNT(CASE WHEN statut = 'resolu' THEN 1 END) as resolus
        FROM signalements
        WHERE created_at > NOW() - '7 jours'::interval
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `);

      res.json(result.rows);

    } catch (error) {
      console.error('Erreur activité signalements:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // 5. Alertes récentes (dernières 24h)
  async getRecentAlerts(req, res) {
    try {
      const result = await pool.query(`
        SELECT
          n.*,
          u.nom as user_nom,
          u.email
        FROM notifications n
        LEFT JOIN users u ON n.user_id = u.id
        WHERE n.type = 'alerte'
          AND n.created_at > NOW() - '24 heures'::interval
        ORDER BY n.created_at DESC
        LIMIT 20
      `);

      res.json(result.rows);

    } catch (error) {
      console.error('Erreur alertes récentes:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = analyticsController;