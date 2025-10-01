const { io } = require('socket.io-client');

// Test de connexion WebSocket pour les statistiques en temps réel
console.log('🧪 Test des statistiques WebSocket en temps réel...\n');

// Se connecter au serveur WebSocket
const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling']
});

// Écouter la connexion
socket.on('connect', () => {
  console.log('✅ Connecté au serveur WebSocket');
  console.log('📡 ID de connexion:', socket.id);
  
  // Rejoindre la room admin
  socket.emit('join-admin');
  console.log('👑 Rejoint la room admin');
  
  // Écouter les événements de statistiques
  socket.on('stats-updated', (data) => {
    console.log('\n📊 Statistiques mises à jour en temps réel:');
    console.log('   👥 Utilisateurs:', data.totalUsers);
    console.log('   📦 Produits:', data.totalProducts);
    console.log('   🛒 Commandes:', data.totalOrders);
    console.log('   💰 Chiffre d\'affaires:', data.chiffreAffaires + '€');
    console.log('   🕐 Heure:', new Date().toLocaleTimeString());
  });
  
  // Écouter les événements de produits
  socket.on('product-added', (data) => {
    console.log('\n➕ Nouveau produit ajouté:', data.product.nom);
    console.log('   Par:', data.addedBy);
  });
  
  socket.on('product-updated', (data) => {
    console.log('\n🔄 Produit mis à jour:', data.product.nom);
    console.log('   Par:', data.updatedBy);
  });
  
  socket.on('product-deleted', (data) => {
    console.log('\n❌ Produit supprimé:', data.productName);
    console.log('   Par:', data.deletedBy);
  });
  
  console.log('\n🎯 En attente des mises à jour en temps réel...');
  console.log('   (Ouvrez l\'interface admin pour voir les changements)');
});

// Écouter les erreurs de connexion
socket.on('connect_error', (error) => {
  console.error('❌ Erreur de connexion WebSocket:', error.message);
  console.log('   Vérifiez que le serveur est démarré sur le port 5000');
});

// Écouter la déconnexion
socket.on('disconnect', (reason) => {
  console.log('\n🔌 Déconnecté du serveur WebSocket:', reason);
});

// Gestion de l'arrêt du script
process.on('SIGINT', () => {
  console.log('\n👋 Fermeture du test WebSocket...');
  socket.disconnect();
  process.exit(0);
});

console.log('🚀 Démarrage du test...');
console.log('   (Appuyez sur Ctrl+C pour arrêter)');
