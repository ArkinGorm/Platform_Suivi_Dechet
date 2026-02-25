const predictionsService = require('./predictions.service');
const pool = require('../../common/config/database');

const predictionsController = {
  // Prédire pour un bac spécifique
  async predictBac(req, res) {
    try {
      const { bacId } = req.params;
      const { horizon } = req.query;

      const result = await predictionsService.predictBac(bacId, horizon || 6);

      res.json(result);

    } catch (error) {
      console.error(' Erreur contrôleur predictBac:', error);
      res.status(500).json({ error: 'Erreur lors de la prédiction' });
    }
  },

  // Prédire pour un quartier
  async predictQuartier(req, res) {
    try {
      const { quartierId } = req.params;

      const result = await predictionsService.predictQuartier(quartierId);

      res.json(result);

    } catch (error) {
      console.error(' Erreur contrôleur predictQuartier:', error);
      res.status(500).json({ error: 'Erreur lors de la prédiction' });
    }
  },

  // Prédire pour toute la ville
  async predictVille(req, res) {
    try {
      const result = await predictionsService.predictVille();

      res.json(result);

    } catch (error) {
      console.error(' Erreur contrôleur predictVille:', error);
      res.status(500).json({ error: 'Erreur lors de la prédiction' });
    }
  },

  // Obtenir les bacs à risque (qui seront pleins bientôt)
  async getBacsARisque(req, res) {
    try {
      const { seuil = 80, heures = 24 } = req.query;

      // Récupérer tous les bacs avec leur historique récent
      const bacs = await pool.query('SELECT id FROM bacs');
      
      const bacsRisque = [];

      for (const bac of bacs.rows) {
        const pred = await predictionsService.predictBac(bac.id, 6);
        
        if (pred.success) {
          // Vérifier si une prédiction dépasse le seuil dans les prochaines heures
          const risque = pred.predictions.some(p => p.prediction >= seuil);
          
          if (risque) {
            bacsRisque.push({
              bac_id: bac.id,
              reference: pred.reference,
              dernier_niveau: pred.dernier_reel,
              predictions: pred.predictions,
              heures_avant_seuil: pred.analyse.heures_avant_collecte
            });
          }
        }
      }

      res.json({
        seuil: parseInt(seuil),
        total: bacsRisque.length,
        bacs: bacsRisque
      });

    } catch (error) {
      console.error(' Erreur bacs à risque:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = predictionsController;