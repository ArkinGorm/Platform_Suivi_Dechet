const pool = require('../../common/config/database');
const model = require('./predictions.model');

const predictionsService = {
  // Récupérer l'historique d'un bac
  async getBacHistory(bacId, limit = 24) {
    const result = await pool.query(
      `SELECT niveau_remplissage, timestamp
       FROM lectures_capteurs
       WHERE bac_id = $1
       ORDER BY timestamp DESC
       LIMIT $2`,
      [bacId, limit]
    );
    
    // Retourner du plus ancien au plus récent pour la régression
    return result.rows.reverse();
  },

  // Prédire pour un bac spécifique
  async predictBac(bacId, horizon = 6) {
    try {
      // Récupérer l'historique
      const history = await this.getBacHistory(bacId, 24);
      
      if (history.length === 0) {
        return {
          success: false,
          message: 'Pas assez de données pour ce bac'
        };
      }

      const valeurs = history.map(h => h.niveau_remplissage);
      const timestamps = history.map(h => h.timestamp);

      // Dernière valeur réelle
      const dernierReel = valeurs[valeurs.length - 1];

      // Prédictions pour les prochaines heures
      const predictions = [];
      let currentData = [...valeurs];

      for (let i = 1; i <= horizon; i++) {
        const pred = model.predictNext(currentData);
        
        // Ajouter un peu de variation selon l'heure
        const nextHour = new Date(Date.now() + i * 60 * 60 * 1000).getHours();
        const seasonalPred = model.predictWithSeasonality(
          valeurs, 
          timestamps, 
          nextHour
        );
        
        // Combiner les deux approches (60% régression, 40% saisonnalité)
        const combinedPred = pred * 0.6 + seasonalPred * 0.4;
        
        predictions.push({
          horizon: i,
          heure: nextHour,
          prediction: Math.round(combinedPred * 10) / 10,
          modele: 'hybride'
        });

        // Ajouter la prédiction pour la prochaine itération
        currentData.push(combinedPred);
      }

      // Calculer l'intervalle de confiance pour la dernière prédiction
      const confidence = model.confidenceInterval(
        valeurs, 
        predictions[predictions.length - 1].prediction
      );

      // Déterminer si une collecte sera bientôt nécessaire
      const besoinCollecte = predictions.some(p => p.prediction >= 90);
      const heuresAvantCollecte = besoinCollecte 
        ? predictions.findIndex(p => p.prediction >= 90) + 1
        : null;

      return {
        success: true,
        bac_id: bacId,
        dernier_reel: dernierReel,
        timestamp_dernier: history[history.length - 1]?.timestamp,
        historique: history.slice(-10).map(h => ({
          valeur: h.niveau_remplissage,
          date: h.timestamp
        })),
        predictions,
        analyse: {
          tendance: predictions[0].prediction > dernierReel ? 'hausse' : 'baisse',
          besoin_collecte: besoinCollecte,
          heures_avant_collecte: heuresAvantCollecte,
          intervalle_confiance: confidence
        }
      };

    } catch (error) {
      console.error(' Erreur prédiction bac:', error);
      throw error;
    }
  },

  // Prédire pour tous les bacs d'un quartier
  async predictQuartier(quartierId) {
    try {
      // Récupérer tous les bacs du quartier
      const bacs = await pool.query(
        'SELECT id, reference FROM bacs WHERE quartier_id = $1',
        [quartierId]
      );

      const predictions = [];
      for (const bac of bacs.rows) {
        const pred = await this.predictBac(bac.id, 6);
        if (pred.success) {
          predictions.push({
            bac_id: bac.id,
            reference: bac.reference,
            dernier_niveau: pred.dernier_reel,
            prediction_prochaine: pred.predictions[0]?.prediction,
            besoin_collecte: pred.analyse.besoin_collecte,
            heures_avant_collecte: pred.analyse.heures_avant_collecte
          });
        }
      }

      // Statistiques du quartier
      const stats = {
        total_bacs: bacs.rows.length,
        bacs_avec_donnees: predictions.length,
        bacs_necessitant_collecte: predictions.filter(p => p.besoin_collecte).length,
        heures_moyennes_avant_collecte: predictions
          .filter(p => p.heures_avant_collecte)
          .reduce((acc, p) => acc + p.heures_avant_collecte, 0) / 
          predictions.filter(p => p.heures_avant_collecte).length || 0
      };

      return {
        quartier_id: quartierId,
        stats,
        predictions
      };

    } catch (error) {
      console.error(' Erreur prédiction quartier:', error);
      throw error;
    }
  },

  // Prédire pour toute la ville
  async predictVille() {
    try {
      const quartiers = await pool.query('SELECT id, nom FROM quartiers');
      
      const resultats = [];
      for (const quartier of quartiers.rows) {
        const pred = await this.predictQuartier(quartier.id);
        resultats.push({
          quartier: quartier.nom,
          ...pred
        });
      }

      return resultats;

    } catch (error) {
      console.error(' Erreur prédiction ville:', error);
      throw error;
    }
  }
};

module.exports = predictionsService;