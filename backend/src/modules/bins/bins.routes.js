const express = require('express');
const router = express.Router();
const binsController = require('./bins.controller');
const { authMiddleware, roleMiddleware } = require('../../common/middlewares/auth.middleware');

// 1. Routes pour les bacs privés / publics (spécifiques, sans paramètre)
router.get('/mes-bacs', authMiddleware, binsController.getMesBacs);
router.get('/publics', authMiddleware, binsController.getPublicBacs);

// 2. Routes publiques (lecture seule pour les citoyens) - Racine et Paramètre
router.get('/', binsController.getAllBacs);
router.get('/:id', binsController.getBacById);

// Routes protégées pour la municipalité (à ajouter plus tard)
// router.post('/', authMiddleware, roleMiddleware(['admin', 'municipalite']), binsController.createBac);

module.exports = router;