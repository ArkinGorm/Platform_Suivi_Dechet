const express = require('express');
const router = express.Router();
const exportsController = require('./exports.controller');
const { authMiddleware, roleMiddleware } = require('../../common/middlewares/auth.middleware');

// Routes accessibles à la municipalité et aux admins uniquement
router.get(
  '/csv',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  exportsController.exportCSV
);

router.get(
  '/pdf',
  authMiddleware,
  roleMiddleware(['admin', 'municipalite']),
  exportsController.exportPDF
);

module.exports = router;