const { io } = require('socket.io-client');

console.log('🧪 Test final du système WebSocket pour les statistiques...\n');

// Se connecter au serveur WebSocket
const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling']
});

let statsReceived = false;

socket.on('connect', () => {
  console.log('✅ Connecté au serveur WebSocket');
  console.log('📡 ID de connexion:', socket.id);
  
  // Rejoindre la room admin
  socket.emit('join-admin');
  console.log('👑 Rejoint la room admin');
  
  // Écouter les événements de statistiques
  socket.on('stats-updated', (data) => {
    console.log('\n📊 Statistiques reçues via WebSocket:');
    console.log('   👥 Utilisateurs:', data.totalUsers);
    console.log('   📦 Produits:', data.totalProducts);
    console.log('   🛒 Commandes:', data.totalOrders);
    console.log('   💰 Chiffre d\'affaires:', data.chiffreAffaires + '€');
    console.log('   🕐 Heure:', new Date().toLocaleTimeString());
    
    statsReceived = true;
    
    // Vérifier si c'est le bon nombre de produits
    if (data.totalProducts === 4) {
      console.log('✅ SUCCÈS: Le nombre de produits est correct (4)');
    } else {
      console.log(`❌ PROBLÈME: Le nombre de produits devrait être 4, mais affiché: ${data.totalProducts}`);
    }
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
  
  console.log('\n🎯 En attente des statistiques...');
  console.log('   (Les statistiques devraient être émises automatiquement)');
  
  // Timeout pour vérifier si on reçoit les statistiques
  setTimeout(() => {
    if (!statsReceived) {
      console.log('\n⚠️  ATTENTION: Aucune statistique reçue dans les 5 secondes');
      console.log('   Vérifiez que:');
      console.log('   - Le serveur est démarré');
      console.log('   - La fonction emitStatsUpdate est définie');
      console.log('   - La base de données est accessible');
    }
  }, 5000);
});

socket.on('connect_error', (error) => {
  console.error('❌ Erreur de connexion WebSocket:', error.message);
  console.log('   Vérifiez que le serveur est démarré sur le port 5000');
  console.log('   Commande: npm run dev');
});

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
