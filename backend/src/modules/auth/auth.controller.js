const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../common/config/database');

const authController = {
  // Inscription
  async register(req, res) {
    try {
      const { email, password, nom, role = 'citoyen' } = req.body;
      
      // Vérifier si l'utilisateur existe déjà
      const userExists = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );
      
      if (userExists.rows.length > 0) {
        return res.status(400).json({ error: 'Email déjà utilisé' });
      }
      
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Créer l'utilisateur
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, nom, role) 
         VALUES ($1, $2, $3, $4) RETURNING id, email, nom, role, created_at`,
        [email, hashedPassword, nom, role]
      );
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erreur register:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // Connexion
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Récupérer l'utilisateur
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      
      const user = result.rows[0];
      
      if (!user) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }
      
      // Vérifier le mot de passe
      const validPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!validPassword) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }
      
      // Créer le token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Ne pas renvoyer le mot de passe hashé
      delete user.password_hash;
      
      res.json({
        token,
        user
      });
    } catch (error) {
      console.error('Erreur login:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // Profil (route protégée)
  async getProfile(req, res) {
    try {
      const result = await pool.query(
        'SELECT id, email, nom, role, quartier_id, created_at FROM users WHERE id = $1',
        [req.user.id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erreur profile:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

module.exports = authController;