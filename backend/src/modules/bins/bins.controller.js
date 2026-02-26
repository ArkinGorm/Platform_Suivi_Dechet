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
  },

  // Récupérer les bacs d’un citoyen connecté
  async getMesBacs(req, res) {
    try {
      const userId = req.user.id;
      const result = await pool.query(
        'SELECT * FROM bacs WHERE proprietaire_id = $1',
        [userId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Erreur getMesBacs:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // Récupérer les bacs publics (proprietaire_id IS NULL)
  async getPublicBacs(req, res) {
    try {
      const result = await pool.query(
        'SELECT * FROM bacs WHERE proprietaire_id IS NULL'
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Erreur getPublicBacs:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // Ajouter un nouveau bac (admin / municipalité)
  async createBac(req, res) {
    try {
      const { reference, latitude, longitude, type, capteur_id, proprietaire_id } = req.body;

      if (!reference || !latitude || !longitude) {
        return res.status(400).json({ 
          error: 'Les champs reference, latitude et longitude sont requis' 
        });
      }

      // Vérifier si le capteur est déjà utilisé
      if (capteur_id) {
        const existing = await pool.query(
          'SELECT id FROM bacs WHERE capteur_id = $1',
          [capteur_id]
        );
        if (existing.rows.length > 0) {
          return res.status(400).json({ 
            error: 'Ce capteur est déjà associé à un autre bac' 
          });
        }
      }

      // Insertion du nouveau bac
      const result = await pool.query(
        `INSERT INTO bacs (reference, latitude, longitude, type, capteur_id, proprietaire_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [reference, latitude, longitude, type, capteur_id || null, proprietaire_id || null]
      );

      res.status(201).json({
        success: true,
        message: 'Bac ajouté avec succès',
        bac: result.rows[0]
      });
    } catch (error) {
      console.error('Erreur createBac:', error);
      
      if (error.code === '23505') {
        return res.status(400).json({ 
          error: 'Un bac avec cette référence ou ce capteur existe déjà' 
        });
      }

      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = binsController;