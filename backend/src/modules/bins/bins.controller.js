const pool = require('../../common/config/database');

const binsController = {
  // Récupérer tous les bacs avec leur état
  async getAllBacs(req, res) {
    try {
      const result = await pool.query(`
        SELECT b.*, q.nom as quartier_nom,
          (SELECT niveau_remplissage FROM lectures_capteurs 
           WHERE bac_id = b.id ORDER BY timestamp DESC LIMIT 1) as dernier_niveau,
          (SELECT timestamp FROM lectures_capteurs 
           WHERE bac_id = b.id ORDER BY timestamp DESC LIMIT 1) as dernier_releve
        FROM bacs b
        LEFT JOIN quartiers q ON b.quartier_id = q.id
        ORDER BY b.id
      `);
      
      // Ajouter l'état (vert/orange/rouge) basé sur le dernier niveau
      const bacsAvecEtat = result.rows.map(bac => {
        let etat = 'inconnu';
        if (bac.dernier_niveau !== null) {
          if (bac.dernier_niveau >= 90) etat = 'rouge';
          else if (bac.dernier_niveau >= 70) etat = 'orange';
          else etat = 'vert';
        }
        
        return {
          ...bac,
          etat
        };
      });
      
      res.json(bacsAvecEtat);
    } catch (error) {
      console.error('Erreur getAllBacs:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // Récupérer un bac spécifique
  async getBacById(req, res) {
    try {
      const { id } = req.params;
      
      const result = await pool.query(`
        SELECT b.*, q.nom as quartier_nom
        FROM bacs b
        LEFT JOIN quartiers q ON b.quartier_id = q.id
        WHERE b.id = $1
      `, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Bac non trouvé' });
      }
      
      const bac = result.rows[0];
      
      // Récupérer l'historique des lectures
      const lectures = await pool.query(`
        SELECT niveau_remplissage, batterie, timestamp
        FROM lectures_capteurs
        WHERE bac_id = $1
        ORDER BY timestamp DESC
        LIMIT 24
      `, [id]);
      
      // Déterminer l'état actuel
      let etat = 'inconnu';
      if (lectures.rows.length > 0) {
        const dernierNiveau = lectures.rows[0].niveau_remplissage;
        if (dernierNiveau >= 90) etat = 'rouge';
        else if (dernierNiveau >= 70) etat = 'orange';
        else etat = 'vert';
      }
      
      res.json({
        ...bac,
        etat,
        historique: lectures.rows
      });
    } catch (error) {
      console.error('Erreur getBacById:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = binsController;