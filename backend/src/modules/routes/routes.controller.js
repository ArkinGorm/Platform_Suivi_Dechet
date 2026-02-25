const routesService = require('./routes.service');

const routesController = {
  // Optimiser une tournée
  async optimizeRoute(req, res) {
    try {
      const { quartier_id } = req.query;

      const result = await routesService.optimizeRoute(quartier_id);

      res.json(result);

    } catch (error) {
      console.error(' Erreur optimisation:', error);
      res.status(500).json({ error: 'Erreur lors de l\'optimisation' });
    }
  },

  // Sauvegarder une tournée
  async saveRoute(req, res) {
    try {
      const routeData = req.body;
      const userId = req.user.id;

      const savedRoute = await routesService.saveRoute(routeData, userId);

      res.status(201).json({
        success: true,
        message: 'Tournée sauvegardée',
        data: savedRoute
      });

    } catch (error) {
      console.error(' Erreur sauvegarde:', error);
      res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
    }
  },

  // Récupérer l'historique des tournées
  async getHistory(req, res) {
    try {
      const { limit } = req.query;
      const history = await routesService.getRouteHistory(limit);

      res.json(history);

    } catch (error) {
      console.error(' Erreur historique:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
  },

  // Obtenir les bacs prioritaires
  async getPriorityBacs(req, res) {
    try {
      const { quartier_id } = req.query;
      const bacs = await routesService.getBacsForCollection(quartier_id);

      const stats = {
        total: bacs.length,
        rouges: bacs.filter(b => b.etat === 'rouge').length,
        oranges: bacs.filter(b => b.etat === 'orange').length,
        verts: bacs.filter(b => b.etat === 'vert').length
      };

      res.json({
        stats,
        bacs: bacs.slice(0, 50) // Limiter pour la performance
      });

    } catch (error) {
      console.error(' Erreur récupération bacs prioritaires:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = routesController;