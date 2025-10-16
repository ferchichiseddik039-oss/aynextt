import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import emailService from '../services/emailService';

const EmailNotificationHandler = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  
  console.log('📧 [EmailNotificationHandler] Composant initialisé', { socket: !!socket, user: !!user });

  useEffect(() => {
    if (!socket) {
      console.log('📧 [EmailNotificationHandler] Pas de socket disponible');
      return;
    }

    console.log('📧 [EmailNotificationHandler] Socket disponible, configuration des écouteurs');

    // Écouter les changements de statut de commande
    const handleOrderStatusChanged = async (data) => {
      console.log('📧 [Frontend] Réception notification changement de statut:', data);
      
      try {
        // Créer un objet utilisateur pour EmailJS
        const user = {
          email: data.userEmail,
          prenom: data.userName.split(' ')[0],
          nom: data.userName.split(' ').slice(1).join(' ')
        };

        // Créer un objet commande pour EmailJS
        const order = {
          numeroCommande: data.orderNumber,
          total: data.orderTotal,
          dateCreation: data.orderDate
        };

        // Envoyer l'email via EmailJS
        const result = await emailService.sendOrderStatusEmail(user, order, data.newStatus);
        
        if (result.success) {
          console.log('✅ [Frontend] Email de statut envoyé avec succès via EmailJS');
        } else {
          console.error('❌ [Frontend] Erreur envoi email:', result.error);
        }
      } catch (error) {
        console.error('❌ [Frontend] Erreur lors de l\'envoi de l\'email:', error);
      }
    };

    // S'abonner à l'événement
    socket.on('order-status-changed', handleOrderStatusChanged);

    // Nettoyer l'écouteur
    return () => {
      socket.off('order-status-changed', handleOrderStatusChanged);
    };
  }, [socket]);

  // Envoyer un email de bienvenue quand l'utilisateur se connecte
  useEffect(() => {
    if (user && user.email) {
      // Délai pour s'assurer que l'utilisateur est bien connecté
      const timer = setTimeout(async () => {
        try {
          console.log('📧 [Frontend] Envoi email de bienvenue pour nouvel utilisateur:', user.email);
          const result = await emailService.sendWelcomeEmail(user);
          
          if (result.success) {
            console.log('✅ [Frontend] Email de bienvenue envoyé avec succès via EmailJS');
          } else {
            console.error('❌ [Frontend] Erreur envoi email de bienvenue:', result.error);
          }
        } catch (error) {
          console.error('❌ [Frontend] Erreur lors de l\'envoi de l\'email de bienvenue:', error);
        }
      }, 2000); // Attendre 2 secondes après la connexion

      return () => clearTimeout(timer);
    }
  }, [user]);

  // Ce composant ne rend rien, il gère juste les emails
  return null;
};

export default EmailNotificationHandler;
