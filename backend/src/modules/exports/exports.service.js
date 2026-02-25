const pool = require('../../common/config/database');
const createCsvWriter = require('csv-writer').createObjectCsvStringifier;
const PDFDocument = require('pdfkit');

const exportsService = {
  // Générer un CSV à partir d'un tableau d'objets
  generateCSV(data, headers) {
    const csvWriter = createCsvWriter({
      header: headers.map(h => ({ id: h.key, title: h.label }))
    });
    
    return csvWriter.stringifyRecords(data);
  },

  // Générer un PDF basique
  generatePDF(title, data, columns, res) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        
        // Définir les en-têtes HTTP pour le PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${title}.pdf`);
        
        // Pipe le PDF directement vers la réponse
        doc.pipe(res);
        
        // Titre du document
        doc.fontSize(20).text(title, { align: 'center' });
        doc.moveDown();
        
        // Date de génération
        doc.fontSize(10).text(`Généré le ${new Date().toLocaleString()}`, { align: 'right' });
        doc.moveDown();
        
        // Tableau (simplifié)
        if (data.length > 0) {
          // En-têtes du tableau
          let yPosition = doc.y;
          let xPosition = 50;
          
          doc.fontSize(10).font('Helvetica-Bold');
          columns.forEach(col => {
            doc.text(col.label, xPosition, yPosition);
            xPosition += 150;
          });
          
          // Ligne de séparation
          doc.moveTo(50, yPosition + 15)
             .lineTo(550, yPosition + 15)
             .stroke();
          
          // Données
          doc.font('Helvetica');
          yPosition += 30;
          
          data.forEach((row, index) => {
            xPosition = 50;
            columns.forEach(col => {
              doc.text(String(row[col.key] || ''), xPosition, yPosition + (index * 20));
              xPosition += 150;
            });
          });
        } else {
          doc.text('Aucune donnée à afficher');
        }
        
        // Finaliser le PDF
        doc.end();
        
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  },

  // Récupérer les données selon le type d'export
  async getExportData(type, params = {}) {
    switch(type) {
      case 'bacs':
        return await pool.query(`
          SELECT 
            b.id, b.reference, b.type, 
            q.nom as quartier,
            b.latitude, b.longitude,
            (SELECT niveau_remplissage FROM lectures_capteurs 
             WHERE bac_id = b.id ORDER BY timestamp DESC LIMIT 1) as dernier_niveau
          FROM bacs b
          LEFT JOIN quartiers q ON b.quartier_id = q.id
          ORDER BY q.nom, b.reference
        `);
        
      case 'collectes':
        return await pool.query(`
          SELECT 
            c.date_collecte, b.reference, b.type,
            q.nom as quartier, c.agent, c.camion_id,
            c.niveau_avant, c.note
          FROM collectes c
          JOIN bacs b ON c.bac_id = b.id
          LEFT JOIN quartiers q ON b.quartier_id = q.id
          ORDER BY c.date_collecte DESC
          LIMIT $1
        `, [params.limit || 1000]);
        
      case 'signalements':
        return await pool.query(`
          SELECT 
            s.created_at, s.type, s.statut,
            s.latitude, s.longitude,
            u.nom as citoyen, u.email, s.description
          FROM signalements s
          LEFT JOIN users u ON s.citoyen_id = u.id
          ORDER BY s.created_at DESC
          LIMIT $1
        `, [params.limit || 1000]);
        
      case 'analytics':
        return await pool.query(`
          WITH dernieres_lectures AS (
            SELECT DISTINCT ON (bac_id) bac_id, niveau_remplissage
            FROM lectures_capteurs
            ORDER BY bac_id, timestamp DESC
          )
          SELECT
            q.nom as quartier,
            COUNT(*) as total_bacs,
            COUNT(CASE WHEN dl.niveau_remplissage >= 90 THEN 1 END) as bacs_rouges,
            AVG(dl.niveau_remplissage)::numeric(10,2) as taux_moyen
          FROM bacs b
          JOIN quartiers q ON b.quartier_id = q.id
          LEFT JOIN dernieres_lectures dl ON b.id = dl.bac_id
          GROUP BY q.nom
          ORDER BY q.nom
        `);
        
      default:
        throw new Error('Type d\'export inconnu');
    }
  }
};

module.exports = exportsService;