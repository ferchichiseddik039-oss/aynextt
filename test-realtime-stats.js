const { io } = require('socket.io-client');

console.log('🧪 Test des statistiques en temps réel...\n');

// Se connecter au serveur WebSocket
const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling']
});

let initialStats = null;
let productCount = 0;

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
    
    if (!initialStats) {
      initialStats = data;
      productCount = data.totalProducts;
      console.log('🎯 Statistiques initiales enregistrées');
    } else {
      if (data.totalProducts !== productCount) {
        console.log(`🔄 CHANGEMENT DÉTECTÉ: Produits ${productCount} → ${data.totalProducts}`);
        productCount = data.totalProducts;
      }
    }
  });
  
  // Écouter les événements de produits
  socket.on('product-added', (data) => {
    console.log('\n➕ Nouveau produit ajouté:', data.product.nom);
    console.log('   Par:', data.addedBy);
    console.log('   ⏰ Heure:', new Date().toLocaleTimeString());
  });
  
  socket.on('product-updated', (data) => {
    console.log('\n🔄 Produit mis à jour:', data.product.nom);
    console.log('   Par:', data.updatedBy);
    console.log('   ⏰ Heure:', new Date().toLocaleTimeString());
  });
  
  socket.on('product-deleted', (data) => {
    console.log('\n❌ Produit supprimé:', data.productName);
    console.log('   Par:', data.deletedBy);
    console.log('   ⏰ Heure:', new Date().toLocaleTimeString());
  });
  
  console.log('\n🎯 En attente des mises à jour en temps réel...');
  console.log('   Instructions de test:');
  console.log('   1. Ouvrez http://localhost:3000/admin');
  console.log('   2. Allez dans l\'onglet "Produits"');
  console.log('   3. Ajoutez, modifiez ou supprimez un produit');
  console.log('   4. Observez les changements en temps réel ici');
  console.log('   5. Retournez au tableau de bord pour voir les statistiques');
  
  // Timeout pour vérifier si on reçoit les statistiques initiales
  setTimeout(() => {
    if (!initialStats) {
      console.log('\n⚠️  ATTENTION: Aucune statistique initiale reçue');
      console.log('   Vérifiez que:');
      console.log('   - Le serveur est démarré');
      console.log('   - Vous êtes connecté en tant qu\'admin');
      console.log('   - La fonction emitStatsUpdate fonctionne');
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
