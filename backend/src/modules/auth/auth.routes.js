const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { authMiddleware } = require('../../common/middlewares/auth.middleware');

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);

// Route protégée
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;