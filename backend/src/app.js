const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import des routes
const authRoutes = require('./modules/auth/auth.routes');
const binsRoutes = require('./modules/bins/bins.routes');

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bins', binsRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Smart Bins opérationnelle',
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

module.exports = app;