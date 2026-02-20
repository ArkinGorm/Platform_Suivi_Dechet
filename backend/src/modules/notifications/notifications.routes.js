const express = require('express');
const router = express.Router();
const notificationsController = require('./notifications.controller');
const { authMiddleware } = require('../../common/middlewares/auth.middleware');

// Toutes les routes sont protégées (utilisateur connecté)
router.get('/', authMiddleware, notificationsController.getMyNotifications);
router.put('/:id/read', authMiddleware, notificationsController.markAsRead);
router.put('/read-all', authMiddleware, notificationsController.markAllAsRead);
router.delete('/:id', authMiddleware, notificationsController.deleteNotification);

module.exports = router;