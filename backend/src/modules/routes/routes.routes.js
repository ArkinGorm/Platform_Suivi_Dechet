const express = require('express');
const router = express.Router();
const routesController = require('./routes.controller');
const { authMiddleware, roleMiddleware } = require('../../common/middlewares/auth.middleware');

// Routes accessibles à la municipalité et aux admins
router.get(
  '/optimize',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  routesController.optimizeRoute
);

router.get(
  '/priority-bacs',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  routesController.getPriorityBacs
);

router.post(
  '/save',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  routesController.saveRoute
);

router.get(
  '/history',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  routesController.getHistory
);

module.exports = router;