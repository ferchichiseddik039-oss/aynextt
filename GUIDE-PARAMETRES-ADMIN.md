# Guide des Paramètres d'Administration

## Vue d'ensemble

Le système de paramètres d'administration permet de configurer dynamiquement tous les aspects de votre boutique en ligne. Les modifications apportées par l'administrateur sont immédiatement reflétées côté client.

## Accès aux Paramètres

1. Connectez-vous en tant qu'administrateur
2. Allez dans l'interface d'administration (`/admin`)
3. Cliquez sur l'onglet "Paramètres" dans la barre latérale

## Sections de Configuration

### 1. Informations Générales

**Configuration des informations de base de votre boutique**

- **Nom de la boutique** : Le nom affiché sur le site
- **Description** : Description de votre boutique
- **Email** : Adresse email de contact
- **Téléphone** : Numéro de téléphone
- **Adresse** : Adresse complète de la boutique
- **Devise** : Devise utilisée (TND, EUR, USD)
- **Langue** : Langue par défaut du site
- **Mode maintenance** : Activer/désactiver le mode maintenance

### 2. Livraison

**Gestion des frais de livraison et zones de livraison**

- **Frais de livraison** : Coût standard de la livraison
- **Seuil livraison gratuite** : Montant minimum pour la livraison gratuite
- **Délai de livraison** : Délai standard (ex: "3-5 jours ouvrables")
- **Livraison gratuite** : Activer/désactiver la livraison gratuite
- **Zones de livraison** : Configurer différentes zones avec leurs frais et délais

#### Exemple de configuration des zones :
- **Tunis Centre** : 5.9 TND - 2-3 jours
- **Grand Tunis** : 7.9 TND - 3-4 jours
- **Autres gouvernorats** : 12.9 TND - 5-7 jours

### 3. Paiement

**Configuration des méthodes de paiement acceptées**

- **Méthodes actives** : Sélectionner les méthodes de paiement disponibles
- **Informations détaillées** : Personnaliser le nom et la description de chaque méthode

#### Méthodes disponibles :
- **Carte bancaire** : Visa, Mastercard, American Express
- **PayPal** : Paiement sécurisé via PayPal
- **Virement bancaire** : Virement bancaire direct
- **Espèces à la livraison** : Paiement en espèces lors de la livraison

### 4. Notifications

**Gestion des emails et notifications automatiques**

#### Notifications par email :
- Commande confirmée
- Commande expédiée
- Commande livrée

#### Notifications SMS :
- Activer/désactiver les SMS
- Commande confirmée
- Commande expédiée

#### Notifications push :
- Activer/désactiver les notifications push
- Promotions
- Nouveautés

## Impact des Modifications

### Côté Client

Les modifications apportées aux paramètres sont immédiatement visibles :

1. **Méthodes de paiement** : Seules les méthodes activées par l'admin apparaissent lors du checkout
2. **Frais de livraison** : Les nouveaux frais sont appliqués automatiquement
3. **Seuil livraison gratuite** : Le seuil est mis à jour en temps réel
4. **Devise** : La devise affichée change selon la configuration
5. **Informations boutique** : Nom, description, contact mis à jour

### Exemples d'Utilisation

#### Scénario 1 : Modifier les frais de livraison
1. Aller dans Paramètres → Livraison
2. Changer "Frais de livraison" de 5.9 à 3.0 TND
3. Sauvegarder
4. **Résultat** : Les clients voient maintenant 3.0 TND au lieu de 5.9 TND

#### Scénario 2 : Désactiver une méthode de paiement
1. Aller dans Paramètres → Paiement
2. Décocher "PayPal" dans les méthodes actives
3. Sauvegarder
4. **Résultat** : PayPal n'apparaît plus dans les options de paiement

#### Scénario 3 : Activer le mode maintenance
1. Aller dans Paramètres → Informations générales
2. Cocher "Mode maintenance"
3. Ajouter un message personnalisé
4. Sauvegarder
5. **Résultat** : Le site affiche le message de maintenance

## Sauvegarde

- **Sauvegarde par section** : Chaque section peut être sauvegardée individuellement
- **Sauvegarde globale** : Tous les paramètres peuvent être sauvegardés en une fois
- **Réinitialisation** : Possibilité de revenir aux valeurs par défaut

## Sécurité

- Seuls les administrateurs peuvent modifier les paramètres
- Les modifications sont tracées (qui, quand, quoi)
- Validation des données côté serveur
- Sauvegarde automatique des versions précédentes

## API Endpoints

Les paramètres sont accessibles via l'API :

- `GET /api/settings` : Récupérer les paramètres (public pour les clients, complet pour les admins)
- `PUT /api/settings` : Mettre à jour tous les paramètres (admin seulement)
- `PUT /api/settings/livraison` : Mettre à jour les paramètres de livraison
- `PUT /api/settings/paiement` : Mettre à jour les paramètres de paiement
- `PUT /api/settings/notifications` : Mettre à jour les paramètres de notifications
- `PUT /api/settings/general` : Mettre à jour les paramètres généraux
- `POST /api/settings/reset` : Réinitialiser aux valeurs par défaut

## WebSocket

Les modifications sont propagées en temps réel via WebSocket :
- Les admins connectés reçoivent les notifications de mise à jour
- Mise à jour automatique de l'interface sans rechargement

## Dépannage

### Problèmes courants

1. **Les modifications ne s'appliquent pas**
   - Vérifier que vous êtes connecté en tant qu'admin
   - Rafraîchir la page côté client
   - Vérifier la console pour les erreurs

2. **Erreur de validation**
   - Vérifier que tous les champs requis sont remplis
   - Vérifier le format des données (email, téléphone, etc.)

3. **Paramètres non sauvegardés**
   - Vérifier la connexion à la base de données
   - Vérifier les permissions d'écriture

### Logs

Les modifications sont loggées dans la console du serveur avec :
- Timestamp de la modification
- Utilisateur qui a fait la modification
- Section modifiée
- Valeurs avant/après

## Support

Pour toute question ou problème :
1. Vérifier ce guide
2. Consulter les logs du serveur
3. Tester avec des valeurs par défaut
4. Contacter le support technique
