const express = require('express');
const router = express.Router();
const binsController = require('./bins.controller');
const { authMiddleware, roleMiddleware } = require('../../common/middlewares/auth.middleware');

// Routes publiques (lecture seule pour les citoyens)
router.get('/', binsController.getAllBacs);
router.get('/:id', binsController.getBacById);

// Routes protégées pour la municipalité (à ajouter plus tard)
// router.post('/', authMiddleware, roleMiddleware(['admin', 'municipalite']), binsController.createBac);

module.exports = router;