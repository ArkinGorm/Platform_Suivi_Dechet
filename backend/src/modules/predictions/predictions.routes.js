const express = require('express');
const router = express.Router();
const predictionsController = require('./predictions.controller');
const { authMiddleware, roleMiddleware } = require('../../common/middlewares/auth.middleware');

// Routes accessibles à la municipalité et aux admins
router.get(
  '/bac/:bacId',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  predictionsController.predictBac
);

router.get(
  '/quartier/:quartierId',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  predictionsController.predictQuartier
);

router.get(
  '/ville',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  predictionsController.predictVille
);

router.get(
  '/risque/bacs',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  predictionsController.getBacsARisque
);

module.exports = router;