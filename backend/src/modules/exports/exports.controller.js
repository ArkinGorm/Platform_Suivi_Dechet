const exportsService = require('./exports.service');

const exportsController = {
  // Exporter en CSV
  async exportCSV(req, res) {
    try {
      const { type, format = 'csv', limit } = req.query;
      
      if (!type) {
        return res.status(400).json({ error: 'Type d\'export requis (bacs, collectes, signalements, analytics)' });
      }

      // Définir les en-têtes selon le type
      let headers = [];
      switch(type) {
        case 'bacs':
          headers = [
            { key: 'id', label: 'ID' },
            { key: 'reference', label: 'Référence' },
            { key: 'type', label: 'Type' },
            { key: 'quartier', label: 'Quartier' },
            { key: 'dernier_niveau', label: 'Dernier niveau (%)' },
            { key: 'latitude', label: 'Latitude' },
            { key: 'longitude', label: 'Longitude' }
          ];
          break;
        case 'collectes':
          headers = [
            { key: 'date_collecte', label: 'Date' },
            { key: 'reference', label: 'Bac' },
            { key: 'type', label: 'Type' },
            { key: 'quartier', label: 'Quartier' },
            { key: 'agent', label: 'Agent' },
            { key: 'camion_id', label: 'Camion' },
            { key: 'niveau_avant', label: 'Niveau avant (%)' },
            { key: 'note', label: 'Note' }
          ];
          break;
        case 'signalements':
          headers = [
            { key: 'created_at', label: 'Date' },
            { key: 'type', label: 'Type' },
            { key: 'statut', label: 'Statut' },
            { key: 'citoyen', label: 'Citoyen' },
            { key: 'description', label: 'Description' },
            { key: 'latitude', label: 'Latitude' },
            { key: 'longitude', label: 'Longitude' }
          ];
          break;
        case 'analytics':
          headers = [
            { key: 'quartier', label: 'Quartier' },
            { key: 'total_bacs', label: 'Total bacs' },
            { key: 'bacs_rouges', label: 'Bacs rouges' },
            { key: 'taux_moyen', label: 'Taux moyen (%)' }
          ];
          break;
        default:
          return res.status(400).json({ error: 'Type d\'export invalide' });
      }

      // Récupérer les données
      const result = await exportsService.getExportData(type, { limit });
      
      // Générer le CSV
      const csvData = exportsService.generateCSV(result.rows, headers);
      
      // Définir les en-têtes HTTP
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=export_${type}_${Date.now()}.csv`);
      
      res.send(csvData);

    } catch (error) {
      console.error('❌ Erreur export CSV:', error);
      res.status(500).json({ error: 'Erreur lors de l\'export' });
    }
  },

  // Exporter en PDF
  async exportPDF(req, res) {
    try {
      const { type, limit } = req.query;
      
      if (!type) {
        return res.status(400).json({ error: 'Type d\'export requis' });
      }

      // Définir les colonnes selon le type
      let columns = [];
      let title = '';
      
      switch(type) {
        case 'bacs':
          title = 'Liste des bacs';
          columns = [
            { key: 'reference', label: 'Référence' },
            { key: 'type', label: 'Type' },
            { key: 'quartier', label: 'Quartier' },
            { key: 'dernier_niveau', label: 'Niveau (%)' }
          ];
          break;
        case 'collectes':
          title = 'Historique des collectes';
          columns = [
            { key: 'date_collecte', label: 'Date' },
            { key: 'reference', label: 'Bac' },
            { key: 'agent', label: 'Agent' },
            { key: 'niveau_avant', label: 'Niveau (%)' }
          ];
          break;
        case 'signalements':
          title = 'Signalements citoyens';
          columns = [
            { key: 'created_at', label: 'Date' },
            { key: 'type', label: 'Type' },
            { key: 'statut', label: 'Statut' },
            { key: 'citoyen', label: 'Citoyen' }
          ];
          break;
        case 'analytics':
          title = 'Analytics par quartier';
          columns = [
            { key: 'quartier', label: 'Quartier' },
            { key: 'total_bacs', label: 'Total' },
            { key: 'bacs_rouges', label: 'Rouges' },
            { key: 'taux_moyen', label: 'Taux moyen' }
          ];
          break;
        default:
          return res.status(400).json({ error: 'Type d\'export invalide' });
      }

      // Récupérer les données
      const result = await exportsService.getExportData(type, { limit });
      
      // Générer le PDF
      await exportsService.generatePDF(title, result.rows, columns, res);

    } catch (error) {
      console.error('❌ Erreur export PDF:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Erreur lors de l\'export PDF' });
      }
    }
  }
};

module.exports = exportsController;