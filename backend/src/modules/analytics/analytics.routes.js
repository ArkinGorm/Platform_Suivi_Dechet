const express = require('express');
const router = express.Router();
const analyticsController = require('./analytics.controller');
const { authMiddleware, roleMiddleware } = require('../../common/middlewares/auth.middleware');

// Routes accessibles à la municipalité et aux admins
router.get(
  '/dashboard',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  analyticsController.getDashboardKPI
);

router.get(
  '/remplissage/evolution',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  analyticsController.getRemplissageEvolution
);

router.get(
  '/quartiers/classement',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  analyticsController.getQuartiersRanking
);

router.get(
  '/signalements/activite',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  analyticsController.getSignalementsActivity
);

router.get(
  '/alertes/recentes',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  analyticsController.getRecentAlerts
);

module.exports = router;