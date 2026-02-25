const pool = require('../../common/config/database');
const optimizer = require('./routes.algorithm');

const routesService = {
  // Récupérer les bacs à collecter (par priorité)
  async getBacsForCollection(quartier_id = null, seuilRouge = 90, seuilOrange = 70) {
    let query = `
      WITH dernieres_lectures AS (
        SELECT DISTINCT ON (bac_id) bac_id, niveau_remplissage
        FROM lectures_capteurs
        ORDER BY bac_id, timestamp DESC
      )
      SELECT 
        b.id,
        b.reference,
        b.latitude,
        b.longitude,
        b.type,
        q.nom as quartier,
        COALESCE(dl.niveau_remplissage, 0) as niveau,
        CASE 
          WHEN dl.niveau_remplissage >= $1 THEN 'rouge'
          WHEN dl.niveau_remplissage >= $2 THEN 'orange'
          ELSE 'vert'
        END as etat
      FROM bacs b
      LEFT JOIN dernieres_lectures dl ON b.id = dl.bac_id
      LEFT JOIN quartiers q ON b.quartier_id = q.id
      WHERE 1=1
    `;
    
    const params = [seuilRouge, seuilOrange];
    
    if (quartier_id) {
      params.push(quartier_id);
      query += ` AND b.quartier_id = $${params.length}`;
    }
    
    query += ` ORDER BY 
      CASE WHEN dl.niveau_remplissage >= $1 THEN 1
           WHEN dl.niveau_remplissage >= $2 THEN 2
           ELSE 3 END,
      dl.niveau_remplissage DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  },

  // Récupérer le dépôt (point de départ)
  async getDepot() {
    // Par défaut, utiliser la mairie ou un point central
    // À adapter selon vos données
    return {
      id: 'depot',
      reference: 'Dépôt',
      latitude: 48.8566, // Paris par défaut
      longitude: 2.3522,
      type: 'depot'
    };
  },

  // Optimiser une tournée
  async optimizeRoute(quartier_id = null) {
    try {
      // 1. Récupérer les bacs à collecter
      const bacs = await this.getBacsForCollection(quartier_id);
      
      if (bacs.length === 0) {
        return {
          success: false,
          message: 'Aucun bac à collecter'
        };
      }

      // 2. Récupérer le dépôt
      const depot = await this.getDepot();

      // 3. Optimiser la tournée
      const optimizedTour = optimizer.optimizeWithPriority(bacs, depot);
      
      // 4. Calculer les métriques
      const metrics = optimizer.calculateMetrics(optimizedTour);

      // 5. Formater la réponse
      const tournee = optimizedTour.map((point, index) => ({
        ordre: index,
        id: point.id || point.reference,
        reference: point.reference,
        type: point.type,
        latitude: point.latitude,
        longitude: point.longitude,
        etat: point.etat,
        niveau: point.niveau,
        est_depot: point.id === 'depot'
      }));

      return {
        success: true,
        date_optimisation: new Date(),
        total_bacs: bacs.length,
        ...metrics,
        tournee
      };

    } catch (error) {
      console.error(' Erreur optimisation route:', error);
      throw error;
    }
  },

  // Sauvegarder une tournée optimisée
  async saveRoute(routeData, userId) {
    const { nom, description, quartier_id, tournee, distance_km, duree_minutes } = routeData;

    const result = await pool.query(
      `INSERT INTO tournees_optimisees 
       (nom, description, quartier_id, tournee_data, distance_km, duree_minutes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [nom, description, quartier_id, JSON.stringify(tournee), distance_km, duree_minutes, userId]
    );

    return result.rows[0];
  },

  // Récupérer l'historique des tournées
  async getRouteHistory(limit = 10) {
    const result = await pool.query(
      `SELECT * FROM tournees_optimisees 
       ORDER BY created_at DESC 
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }
};

module.exports = routesService;