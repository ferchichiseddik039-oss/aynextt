const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Obtenir le token depuis le header
  const token = req.header('x-auth-token');

  // Vérifier s'il n'y a pas de token
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2024');
    
    // Ajouter l'utilisateur à la requête
    // Le token contient les données dans req.user.user ou directement
    req.user = decoded.user || decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
};
