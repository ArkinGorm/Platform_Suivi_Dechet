const express = require('express');
const router = express.Router();
const collectesController = require('./collectes.controller');
const { authMiddleware, roleMiddleware } = require('../../common/middlewares/auth.middleware');

// Routes accessibles à la municipalité et aux admins
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  collectesController.createCollecte
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  collectesController.getAllCollectes
);

router.get(
  '/stats',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  collectesController.getCollectesStats
);

router.get(
  '/bac/:bac_id',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  collectesController.getCollectesByBac
);

router.get(
  '/bac/:bac_id/last',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  collectesController.getLastCollecte
);

module.exports = router;