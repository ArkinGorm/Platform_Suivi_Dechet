// Middleware simple pour protéger la démo
const demoAuth = (req, res, next) => {
  const token = req.headers['x-demo-token'];
  
  // Le token secret que tu donneras à ton ami// Middleware simple pour protéger la démo
const demoAuth = (req, res, next) => {
  const token = req.headers['x-demo-token'];
  
  // Le token secret que tu donneras à ton ami
  const DEMO_TOKEN = process.env.DEMO_TOKEN || 'demo2026';
  
  if (token === DEMO_TOKEN) {
    next();
  } else {
    res.status(401).json({ error: 'Accès non autorisé - Token démo requis' });
  }
};

module.exports = demoAuth;
  const DEMO_TOKEN = process.env.DEMO_TOKEN || 'demo2026';
  
  if (token === DEMO_TOKEN) {
    next();
  } else {
    res.status(401).json({ error: 'Accès non autorisé - Token démo requis' });
  }
};

module.exports = demoAuth;