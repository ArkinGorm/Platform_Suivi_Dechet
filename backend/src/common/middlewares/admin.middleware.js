const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Accès interdit. Réservé aux administrateurs.' 
    });
  }
  next();
};

module.exports = adminMiddleware;