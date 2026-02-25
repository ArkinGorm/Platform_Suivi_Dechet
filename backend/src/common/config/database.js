const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false  // Important pour Neon
  }
});

pool.connect((err, client, release) => {
  if (err) {
    console.error(' Erreur de connexion à PostgreSQL:', err.message);
  } else {
    console.log(' Connecté à PostgreSQL');
    release();
  }
});

module.exports = pool;