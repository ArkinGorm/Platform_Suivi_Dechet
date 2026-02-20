const express = require('express');
const router = express.Router();
const reportsController = require('./reports.controller');
const { authMiddleware } = require('../../common/middlewares/auth.middleware');

// Routes protégées (utilisateur connecté)
router.post('/', authMiddleware, reportsController.createReport);
router.get('/mes-signalements', authMiddleware, reportsController.getMyReports);

// Routes publiques ou réservées à la municipalité (à sécuriser plus tard)
router.get('/', reportsController.getAllReports);
router.get('/:id', reportsController.getReportById);
router.put('/:id/statut', reportsController.updateReportStatus);

module.exports = router;