const pool = require('../../common/config/database');
const notificationsService = require('../notifications/notifications.service');
const sensorsController = {
  // 1. Recevoir les données d'un capteur
  async receiveData(req, res) {
    try {
      const { capteur_id, niveau_remplissage, batterie, timestamp } = req.body;

      // Validation des données requises
      if (!capteur_id || niveau_remplissage === undefined) {
        return res.status(400).json({
          error: 'Données incomplètes. Requis: capteur_id, niveau_remplissage'
        });
      }

      // Vérifier que le capteur existe et est associé à un bac
      const bacResult = await pool.query(
        'SELECT id, reference FROM bacs WHERE capteur_id = $1',
        [capteur_id]
      );

      if (bacResult.rows.length === 0) {
        return res.status(404).json({
          error: 'Capteur non trouvé ou non associé à un bac'
        });
      }

      const bac_id = bacResult.rows[0].id;

      // Insérer la lecture
      const lectureResult = await pool.query(
        `INSERT INTO lectures_capteurs (bac_id, niveau_remplissage, batterie, timestamp)
         VALUES ($1, $2, $3, COALESCE($4, NOW()))
         RETURNING *`,
        [bac_id, niveau_remplissage, batterie, timestamp]
      );

      // Vérifier si le bac est plein (≥ 90%)
      const seuil_alerte = 90;
      if (niveau_remplissage >= seuil_alerte) {
        console.log(`⚠️ ALERTE: Bac ${bacResult.rows[0].reference} (${capteur_id}) est plein à ${niveau_remplissage}%`);

        // Créer une notification pour la municipalité
        await notificationsService.createNotificationForMunicipalite(
          bacResult.rows[0].quartier_id,
          'alerte',
          `Bac plein - ${bacResult.rows[0].reference}`,
          `Le bac ${bacResult.rows[0].reference} est plein à ${niveau_remplissage}%`,
          { bac_id: bac_id, capteur_id, niveau: niveau_remplissage }
        );
      }

      res.status(201).json({
        success: true,
        message: 'Données reçues avec succès',
        data: lectureResult.rows[0]
      });

    } catch (error) {
      console.error(' Erreur réception capteur:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // 2. Obtenir la dernière lecture d'un capteur
  async getLastData(req, res) {
    try {
      const { capteur_id } = req.params;

      const result = await pool.query(
        `SELECT l.*, b.reference, b.type 
         FROM lectures_capteurs l
         JOIN bacs b ON l.bac_id = b.id
         WHERE b.capteur_id = $1
         ORDER BY l.timestamp DESC
         LIMIT 1`,
        [capteur_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Aucune donnée pour ce capteur' });
      }

      res.json(result.rows[0]);

    } catch (error) {
      console.error(' Erreur getLastData:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // 3. Obtenir l'historique d'un capteur
  async getHistory(req, res) {
    try {
      const { capteur_id } = req.params;
      const { limit = 24 } = req.query; // Par défaut 24 dernières lectures

      const result = await pool.query(
        `SELECT l.niveau_remplissage, l.batterie, l.timestamp
         FROM lectures_capteurs l
         JOIN bacs b ON l.bac_id = b.id
         WHERE b.capteur_id = $1
         ORDER BY l.timestamp DESC
         LIMIT $2`,
        [capteur_id, limit]
      );

      res.json({
        capteur_id,
        total: result.rows.length,
        lectures: result.rows
      });

    } catch (error) {
      console.error(' Erreur getHistory:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = sensorsController;