const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test de connexion
pool.connect((err, client, release) => {
  if (err) {
    console.error(' Erreur de connexion à la BDD:', err.stack);
  } else {
    console.log(' Connecté à PostgreSQL');
    release();
  }
});

module.exports = pool;