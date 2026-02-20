const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');
const { authMiddleware } = require('../../common/middlewares/auth.middleware');
const adminMiddleware = require('../../common/middlewares/admin.middleware');

// Toutes les routes sont protégées par auth + admin
router.get('/', authMiddleware, adminMiddleware, usersController.getAllUsers);
router.get('/stats', authMiddleware, adminMiddleware, usersController.getUserStats);
router.get('/:id', authMiddleware, adminMiddleware, usersController.getUserById);
router.put('/:id/role', authMiddleware, adminMiddleware, usersController.updateUserRole);
router.delete('/:id', authMiddleware, adminMiddleware, usersController.deleteUser);

module.exports = router;