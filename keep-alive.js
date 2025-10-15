// Script pour maintenir le service Render actif
const https = require('https');

const pingService = () => {
  const options = {
    hostname: 'aynextt.onrender.com',
    port: 443,
    path: '/api/health',
    method: 'GET',
    timeout: 10000
  };

  const req = https.request(options, (res) => {
    console.log(`✅ Ping réussi - Status: ${res.statusCode} - ${new Date().toISOString()}`);
  });

  req.on('error', (err) => {
    console.error(`❌ Erreur ping: ${err.message} - ${new Date().toISOString()}`);
  });

  req.on('timeout', () => {
    console.error(`⏰ Timeout ping - ${new Date().toISOString()}`);
    req.destroy();
  });

  req.end();
};

// Ping toutes les 5 minutes
console.log('🚀 Démarrage du keep-alive pour aynextt.onrender.com');
pingService(); // Ping immédiat
setInterval(pingService, 5 * 60 * 1000); // Ping toutes les 5 minutes
