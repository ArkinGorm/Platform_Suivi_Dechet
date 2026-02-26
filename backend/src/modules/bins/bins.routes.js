const express = require('express');
const router = express.Router();
const binsController = require('./bins.controller');
const { authMiddleware, roleMiddleware } = require('../../common/middlewares/auth.middleware');

// ============================================
// 1. ROUTES SPÉCIFIQUES (sans paramètre)
// ============================================

// Récupérer les bacs du citoyen connecté
router.get('/mes-bacs', authMiddleware, binsController.getMesBacs);

// Récupérer les bacs publics
router.get('/publics', authMiddleware, binsController.getPublicBacs);

// ============================================
// 2. ROUTES DE CRÉATION (POST) - AVANT /:id
// ============================================

// Ajouter un nouveau bac (admin ou municipalité uniquement)
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  binsController.createBac
);

// ============================================
// 3. ROUTES PUBLIQUES (liste)
// ============================================

// Récupérer tous les bacs (public)
router.get('/', binsController.getAllBacs);

// ============================================
// 4. ROUTE AVEC PARAMÈTRE (DOIT ÊTRE EN DERNIER)
// ============================================

// Récupérer un bac par son ID
router.get('/:id', binsController.getBacById);

module.exports = router;