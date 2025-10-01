const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Route de test simple
app.get('/api/test', (req, res) => {
  res.json({ message: 'Serveur fonctionne correctement !' });
});

// Route racine
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenue sur l\'API de la boutique de vêtements',
    status: 'Serveur démarré avec succès',
    timestamp: new Date().toISOString()
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur de test démarré sur le port ${PORT}`);
  console.log(`🌐 Testez l'API: http://localhost:${PORT}/api/test`);
  console.log(`🏠 Page d'accueil: http://localhost:${PORT}/`);
});

module.exports = app;
