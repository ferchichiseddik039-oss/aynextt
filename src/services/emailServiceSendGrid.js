// Service email alternatif avec SendGrid (plus fiable sur Render)
const sgMail = require('@sendgrid/mail');

class EmailServiceSendGrid {
  constructor() {
    this.initialized = false;
  }

  initializeTransporter() {
    if (this.initialized) {
      return true;
    }

    // Vérifier que les variables d'environnement sont disponibles
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('⚠️ Service email SendGrid non configuré. SENDGRID_API_KEY manquant.');
      return false;
    }

    // Configuration SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.initialized = true;
    console.log('✅ Service email SendGrid initialisé avec succès');
    return true;
  }

  async sendWelcomeEmail(user) {
    try {
      console.log('📧 [SendGrid] Tentative d\'envoi email de bienvenue à:', user.email);
      
      if (!this.initializeTransporter()) {
        return { success: false, error: 'Service email SendGrid non configuré' };
      }

      const msg = {
        to: user.email,
        from: process.env.EMAIL_USER || 'noreply@aynext.com',
        subject: '🎉 Bienvenue chez AYNEXT !',
        html: this.generateWelcomeEmailHTML(user),
        text: this.generateWelcomeEmailText(user)
      };

      await sgMail.send(msg);
      console.log('✅ [SendGrid] Email de bienvenue envoyé avec succès à:', user.email);
      return { success: true };
    } catch (error) {
      console.error('❌ [SendGrid] Erreur lors de l\'envoi de l\'email de bienvenue:', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendOrderStatusEmail(user, order, newStatus) {
    try {
      console.log('📧 [SendGrid] Tentative d\'envoi email de statut à:', user.email, 'Statut:', newStatus);
      
      if (!this.initializeTransporter()) {
        return { success: false, error: 'Service email SendGrid non configuré' };
      }

      const statusInfo = this.getStatusInfo(newStatus);
      
      const msg = {
        to: user.email,
        from: process.env.EMAIL_USER || 'noreply@aynext.com',
        subject: `${statusInfo.emoji} ${statusInfo.subject} - Commande #${order.numeroCommande}`,
        html: this.generateOrderStatusEmailHTML(user, order, newStatus),
        text: this.generateOrderStatusEmailText(user, order, newStatus)
      };

      await sgMail.send(msg);
      console.log('✅ [SendGrid] Email de statut envoyé avec succès à:', user.email);
      return { success: true };
    } catch (error) {
      console.error('❌ [SendGrid] Erreur lors de l\'envoi de l\'email de statut:', error.message);
      return { success: false, error: error.message };
    }
  }

  generateWelcomeEmailHTML(user) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Bienvenue chez AYNEXT</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #e74c3c;">🎉 Bienvenue chez AYNEXT !</h1>
            <p>Bonjour ${user.prenom} ${user.nom},</p>
            <p>Merci de vous être inscrit(e) sur notre boutique en ligne !</p>
            <p>Découvrez nos dernières collections de vêtements tendance.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://ferchichiseddik039-oss.github.io/aynextt" 
                   style="background-color: #e74c3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                    Voir nos produits
                </a>
            </div>
            <p>L'équipe AYNEXT</p>
        </div>
    </body>
    </html>
    `;
  }

  generateWelcomeEmailText(user) {
    return `
    Bienvenue chez AYNEXT !
    
    Bonjour ${user.prenom} ${user.nom},
    
    Merci de vous être inscrit(e) sur notre boutique en ligne !
    Découvrez nos dernières collections de vêtements tendance.
    
    Visitez notre site : https://ferchichiseddik039-oss.github.io/aynextt
    
    L'équipe AYNEXT
    `;
  }

  getStatusInfo(status) {
    const statusMap = {
      'en_attente': { emoji: '⏳', subject: 'Commande en attente' },
      'confirmee': { emoji: '✅', subject: 'Commande confirmée' },
      'en_preparation': { emoji: '📦', subject: 'Commande en préparation' },
      'expediee': { emoji: '🚚', subject: 'Commande expédiée' },
      'livree': { emoji: '🎉', subject: 'Commande livrée' },
      'annulee': { emoji: '❌', subject: 'Commande annulée' }
    };
    return statusMap[status] || { emoji: '📋', subject: 'Mise à jour de commande' };
  }

  generateOrderStatusEmailHTML(user, order, status) {
    const statusInfo = this.getStatusInfo(status);
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Mise à jour de votre commande</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #e74c3c;">${statusInfo.emoji} ${statusInfo.subject}</h1>
            <p>Bonjour ${user.prenom} ${user.nom},</p>
            <p>Votre commande #${order.numeroCommande} a été mise à jour.</p>
            <p><strong>Nouveau statut :</strong> ${statusInfo.subject}</p>
            <p>Merci pour votre confiance !</p>
            <p>L'équipe AYNEXT</p>
        </div>
    </body>
    </html>
    `;
  }

  generateOrderStatusEmailText(user, order, status) {
    const statusInfo = this.getStatusInfo(status);
    return `
    ${statusInfo.emoji} ${statusInfo.subject}
    
    Bonjour ${user.prenom} ${user.nom},
    
    Votre commande #${order.numeroCommande} a été mise à jour.
    Nouveau statut : ${statusInfo.subject}
    
    Merci pour votre confiance !
    L'équipe AYNEXT
    `;
  }
}

module.exports = new EmailServiceSendGrid();
