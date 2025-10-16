import { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import emailService from '../services/emailService';

const EmailNotificationHandler = () => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

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

  // Ce composant ne rend rien, il gère juste les emails
  return null;
};

export default EmailNotificationHandler;
