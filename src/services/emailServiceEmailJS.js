const emailjs = require('@emailjs/browser');

class EmailServiceEmailJS {
  constructor() {
    this.serviceId = process.env.EMAILJS_SERVICE_ID;
    this.publicKey = process.env.EMAILJS_PUBLIC_KEY;
    this.initialized = false;
  }

  initialize() {
    if (!this.serviceId || !this.publicKey) {
      console.warn('⚠️ Service EmailJS non configuré. EMAILJS_SERVICE_ID ou EMAILJS_PUBLIC_KEY manquant.');
      return false;
    }

    if (!this.initialized) {
      emailjs.init(this.publicKey);
      this.initialized = true;
      console.log('✅ Service EmailJS initialisé avec succès');
    }

    return true;
  }

  async sendWelcomeEmail(user) {
    try {
      console.log('📧 [EmailJS] Tentative d\'envoi email de bienvenue à:', user.email);
      
      if (!this.initialize()) {
        return { success: false, error: 'Service EmailJS non configuré' };
      }

      const templateParams = {
        to_email: user.email,
        to_name: `${user.prenom} ${user.nom}`,
        from_name: 'AYNEXT Boutique',
        subject: '🎉 Bienvenue chez AYNEXT !',
        message: this.generateWelcomeMessage(user),
        html_message: this.generateWelcomeHTML(user)
      };

      const result = await emailjs.send(
        this.serviceId,
        'template_welcome', // Template ID pour l'email de bienvenue
        templateParams
      );

      console.log('✅ [EmailJS] Email de bienvenue envoyé avec succès à:', user.email);
      console.log('📧 [EmailJS] Email ID:', result.text);
      return { success: true, emailId: result.text, provider: 'EmailJS' };
    } catch (error) {
      console.error('❌ [EmailJS] Erreur lors de l\'envoi de l\'email de bienvenue:', error);
      return { success: false, error: error.message, provider: 'EmailJS' };
    }
  }

  async sendOrderStatusEmail(user, order, newStatus) {
    try {
      console.log('📧 [EmailJS] Tentative d\'envoi email de statut à:', user.email, 'Statut:', newStatus);
      
      if (!this.initialize()) {
        return { success: false, error: 'Service EmailJS non configuré' };
      }

      const statusInfo = this.getStatusInfo(newStatus);

      const templateParams = {
        to_email: user.email,
        to_name: `${user.prenom} ${user.nom}`,
        from_name: 'AYNEXT Boutique',
        subject: `${statusInfo.emoji} ${statusInfo.subject} - Commande #${order.numeroCommande}`,
        order_number: order.numeroCommande,
        order_status: statusInfo.subject,
        order_status_emoji: statusInfo.emoji,
        order_total: `${order.total}€`,
        order_date: new Date(order.dateCreation).toLocaleDateString('fr-FR'),
        message: this.generateOrderStatusMessage(user, order, newStatus, statusInfo),
        html_message: this.generateOrderStatusHTML(user, order, newStatus, statusInfo)
      };

      const result = await emailjs.send(
        this.serviceId,
        'template_order_status', // Template ID pour l'email de statut
        templateParams
      );

      console.log('✅ [EmailJS] Email de statut envoyé avec succès à:', user.email);
      console.log('📧 [EmailJS] Email ID:', result.text);
      return { success: true, emailId: result.text, provider: 'EmailJS' };
    } catch (error) {
      console.error('❌ [EmailJS] Erreur lors de l\'envoi de l\'email de statut:', error);
      return { success: false, error: error.message, provider: 'EmailJS' };
    }
  }

  getStatusInfo(newStatus) {
    const statusMap = {
      'en_attente': {
        emoji: '⏳',
        subject: 'Commande en attente'
      },
      'confirmee': {
        emoji: '✅',
        subject: 'Commande confirmée'
      },
      'en_preparation': {
        emoji: '👨‍🍳',
        subject: 'Commande en préparation'
      },
      'expediee': {
        emoji: '🚚',
        subject: 'Commande expédiée'
      },
      'livree': {
        emoji: '📦',
        subject: 'Commande livrée'
      },
      'annulee': {
        emoji: '❌',
        subject: 'Commande annulée'
      }
    };

    return statusMap[newStatus] || {
      emoji: '📋',
      subject: 'Statut de commande mis à jour'
    };
  }

  generateWelcomeMessage(user) {
    return `
Bonjour ${user.prenom} ${user.nom},

Bienvenue chez AYNEXT ! 🎉

Nous sommes ravis de vous compter parmi nos clients. Votre compte a été créé avec succès.

Vous pouvez maintenant :
• Parcourir notre collection de vêtements tendance
• Personnaliser vos hoodies
• Suivre vos commandes en temps réel
• Profiter de nos offres exclusives

Merci de votre confiance !

L'équipe AYNEXT
Boutique de vêtements tendance
    `;
  }

  generateWelcomeHTML(user) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin-bottom: 10px;">🎉 Bienvenue chez AYNEXT !</h1>
        <p style="color: #666; font-size: 18px;">Bonjour ${user.prenom} ${user.nom}</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Nous sommes ravis de vous compter parmi nos clients. Votre compte a été créé avec succès.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-bottom: 15px;">✨ Ce que vous pouvez faire maintenant :</h3>
          <ul style="color: #555; line-height: 1.8;">
            <li>🛍️ Parcourir notre collection de vêtements tendance</li>
            <li>🎨 Personnaliser vos hoodies</li>
            <li>📱 Suivre vos commandes en temps réel</li>
            <li>🎁 Profiter de nos offres exclusives</li>
          </ul>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #666; font-size: 14px;">
          Merci de votre confiance !<br>
          <strong>L'équipe AYNEXT</strong><br>
          Boutique de vêtements tendance
        </p>
      </div>
    </div>
    `;
  }

  generateOrderStatusMessage(user, order, newStatus, statusInfo) {
    return `
Bonjour ${user.prenom} ${user.nom},

${statusInfo.emoji} Votre commande #${order.numeroCommande} a été mise à jour !

Nouveau statut : ${statusInfo.subject}

Détails de la commande :
• Numéro : #${order.numeroCommande}
• Date : ${new Date(order.dateCreation).toLocaleDateString('fr-FR')}
• Total : ${order.total}€

Merci de votre confiance !

L'équipe AYNEXT
Boutique de vêtements tendance
    `;
  }

  generateOrderStatusHTML(user, order, newStatus, statusInfo) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin-bottom: 10px;">${statusInfo.emoji} ${statusInfo.subject}</h1>
        <p style="color: #666; font-size: 18px;">Bonjour ${user.prenom} ${user.nom}</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Votre commande #${order.numeroCommande} a été mise à jour !
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-bottom: 15px;">📋 Détails de la commande :</h3>
          <div style="color: #555; line-height: 1.8;">
            <p><strong>Numéro :</strong> #${order.numeroCommande}</p>
            <p><strong>Date :</strong> ${new Date(order.dateCreation).toLocaleDateString('fr-FR')}</p>
            <p><strong>Total :</strong> ${order.total}€</p>
            <p><strong>Statut :</strong> ${statusInfo.emoji} ${statusInfo.subject}</p>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #666; font-size: 14px;">
          Merci de votre confiance !<br>
          <strong>L'équipe AYNEXT</strong><br>
          Boutique de vêtements tendance
        </p>
      </div>
    </div>
    `;
  }
}

module.exports = new EmailServiceEmailJS();
