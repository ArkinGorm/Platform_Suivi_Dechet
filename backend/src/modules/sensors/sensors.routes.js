const express = require('express');
const router = express.Router();
const sensorsController = require('./sensors.controller');

// Route pour recevoir les données d'un capteur
router.post('/data', sensorsController.receiveData);

// Route pour obtenir la dernière lecture d'un capteur
router.get('/:capteur_id/last', sensorsController.getLastData);

// Route pour obtenir l'historique d'un capteur
router.get('/:capteur_id/history', sensorsController.getHistory);

module.exports = router;