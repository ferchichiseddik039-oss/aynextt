import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../config/axios';
import { useSocket } from './SocketContext';
import { toast } from 'react-toastify';
import emailService from '../services/emailService';

const OrdersContext = createContext();

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { socket, isConnected } = useSocket();

  // Fonction pour récupérer les commandes de l'utilisateur
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('🔑 Pas de token d\'authentification');
        setOrders([]);
        setLoading(false);
        setError('Veuillez vous connecter pour voir vos commandes');
        return;
      }

      // SOLUTION ROBUSTE: Utiliser uniquement fetch avec timeout court
      console.log('📤 Récupération des commandes avec fetch...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes max
      
      try {
        const apiUrl = window.location.hostname.includes('github.io')
          ? 'https://aynextt.onrender.com/api'
          : 'http://localhost:5001/api';
        const response = await fetch(`${apiUrl}/orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log(`📊 Réponse serveur: ${response.status}`);
        
        if (response.status === 401) {
          console.log('🔑 Token expiré ou invalide');
          localStorage.removeItem('token');
          setOrders([]);
          setLoading(false);
          setError('Session expirée - Veuillez vous reconnecter');
          return;
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📋 Données reçues:', data);
        
        if (data.success && data.orders) {
          console.log(`✅ ${data.orders.length} commande(s) récupérée(s)`);
          setOrders(data.orders);
        } else {
          console.log('❌ Format de réponse incorrect');
          setOrders([]);
        }
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          throw new Error('Timeout: Le serveur met trop de temps à répondre');
        }
        throw fetchError;
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des commandes:', error);
      
      let errorMessage = 'Erreur lors du chargement des commandes';
      
      if (error.code === 'ECONNABORTED' || error.message.includes('Timeout')) {
        errorMessage = 'Timeout: Le serveur met trop de temps à répondre';
      } else if (error.response?.status === 404) {
        errorMessage = 'Route non trouvée';
      } else if (error.response?.status === 401) {
        errorMessage = 'Non autorisé - Veuillez vous reconnecter';
      } else if (error.response?.status === 408) {
        errorMessage = 'Timeout serveur: La requête prend trop de temps';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Erreur serveur - Veuillez réessayer plus tard';
      } else if (!error.response) {
        errorMessage = 'Impossible de contacter le serveur';
      }
      
      setError(errorMessage);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour ajouter une nouvelle commande
  const addOrder = (newOrder) => {
    setOrders(prevOrders => {
      // S'assurer que prevOrders est un tableau
      const ordersArray = Array.isArray(prevOrders) ? prevOrders : [];
      return [newOrder, ...ordersArray];
    });
  };

  // Fonction pour mettre à jour le statut d'une commande
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders => {
      // S'assurer que prevOrders est un tableau
      const ordersArray = Array.isArray(prevOrders) ? prevOrders : [];
      return ordersArray.map(order => 
        order._id === orderId 
          ? { ...order, statut: newStatus }
          : order
      );
    });
  };

  // Fonction pour obtenir le nombre de commandes
  const getOrdersCount = () => {
    return orders.length;
  };

  // Fonction pour obtenir les commandes par statut
  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.statut === status);
  };

  // Charger les commandes au montage du composant
  useEffect(() => {
    console.log('🔄 OrdersContext - Chargement initial des commandes');
    fetchOrders();
  }, []); // Retiré fetchOrders des dépendances

  // Écouter les événements WebSocket pour les mises à jour en temps réel
  useEffect(() => {
    if (!socket || !isConnected) {
      console.log('🔌 WebSocket non connecté dans OrdersContext');
      return;
    }

    console.log('✅ WebSocket connecté - Configuration des écouteurs pour les commandes');

    // Écouter les mises à jour de statut de commande
    const handleOrderStatusUpdate = async (data) => {
      console.log('📦 Mise à jour de commande reçue via WebSocket:', data);
      console.log('📦 Type de data.orderId:', typeof data.orderId, data.orderId);
      
      // Envoyer l'email de statut via EmailJS
      if (data && data.orderId && data.newStatus && data.order) {
        try {
          console.log('📧 [OrdersContext] Envoi email de statut via EmailJS:', data.newStatus);
          
          // Créer un objet utilisateur pour EmailJS
          const user = {
            email: data.order.utilisateur?.email || data.order.userEmail,
            prenom: data.order.utilisateur?.prenom || data.order.userName?.split(' ')[0],
            nom: data.order.utilisateur?.nom || data.order.userName?.split(' ').slice(1).join(' ')
          };

          // Créer un objet commande pour EmailJS
          const order = {
            numeroCommande: data.order.numeroCommande || data.orderNumber,
            total: data.order.total || data.orderTotal,
            dateCreation: data.order.dateCreation || data.orderDate
          };

          // Envoyer l'email via EmailJS
          const result = await emailService.sendOrderStatusEmail(user, order, data.newStatus);
          
          if (result.success) {
            console.log('✅ [OrdersContext] Email de statut envoyé avec succès via EmailJS');
          } else {
            console.error('❌ [OrdersContext] Erreur envoi email de statut:', result.error);
          }
        } catch (error) {
          console.error('❌ [OrdersContext] Erreur lors de l\'envoi de l\'email de statut:', error);
        }
      }
      
      if (data && data.orderId && data.newStatus) {
        // Convertir les IDs en string pour une comparaison fiable
        const eventOrderId = String(data.orderId);
        let updated = false;
        
        // Mettre à jour le statut de la commande dans l'état local
        setOrders(prevOrders => {
          console.log('📋 Commandes actuelles:', prevOrders?.length || 0);
          
          const ordersArray = Array.isArray(prevOrders) ? prevOrders : [];
          const newOrders = ordersArray.map(order => {
            const orderIdStr = String(order._id);
            console.log(`🔍 Comparaison: ${orderIdStr} === ${eventOrderId} ?`, orderIdStr === eventOrderId);
            
            if (orderIdStr === eventOrderId) {
              console.log(`✅ MATCH! Mise à jour du statut: ${order.statut} → ${data.newStatus}`);
              updated = true;
              return {
                ...order,
                statut: data.newStatus
              };
            }
            return order;
          });
          
          if (!updated) {
            console.warn(`⚠️ Aucune commande trouvée avec l'ID ${eventOrderId}`);
            console.log('📋 IDs disponibles:', ordersArray.map(o => String(o._id)));
          }
          
          return newOrders;
        });

        // Afficher une notification à l'utilisateur
        const statusLabels = {
          'en_attente': 'En attente',
          'confirmee': 'Confirmée',
          'en_preparation': 'En préparation',
          'expediee': 'Expédiée',
          'livree': 'Livrée',
          'annulee': 'Annulée'
        };
        
        const statusLabel = statusLabels[data.newStatus] || data.newStatus;
        const orderId = String(data.orderId);
        toast.info(`📦 Commande #${orderId.slice(-8)} : ${statusLabel}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      } else {
        console.warn('⚠️ Données WebSocket incomplètes:', data);
      }
    };

    // Écouter l'événement de nouvelle commande (pour les admins ou pour synchroniser)
    const handleNewOrder = (data) => {
      console.log('🆕 Nouvelle commande reçue via WebSocket:', data);
      
      if (data && data.order) {
        const newOrderId = String(data.order._id);
        
        // Ajouter la nouvelle commande si elle n'existe pas déjà
        setOrders(prevOrders => {
          const ordersArray = Array.isArray(prevOrders) ? prevOrders : [];
          const exists = ordersArray.some(order => String(order._id) === newOrderId);
          
          if (!exists) {
            console.log('✅ Ajout de la nouvelle commande à la liste:', newOrderId);
            return [data.order, ...ordersArray];
          } else {
            console.log('⚠️ La commande existe déjà:', newOrderId);
          }
          
          return ordersArray;
        });
      } else {
        console.warn('⚠️ Données de nouvelle commande incomplètes:', data);
      }
    };

    // S'abonner aux événements
    socket.on('order-status-updated', handleOrderStatusUpdate);
    socket.on('new-order', handleNewOrder);

    console.log('📡 Écouteurs WebSocket configurés pour les commandes');

    // Nettoyer les écouteurs lors du démontage
    return () => {
      console.log('🧹 Nettoyage des écouteurs WebSocket des commandes');
      socket.off('order-status-updated', handleOrderStatusUpdate);
      socket.off('new-order', handleNewOrder);
    };
  }, [socket, isConnected]);

  const value = {
    orders,
    loading,
    error,
    fetchOrders,
    addOrder,
    updateOrderStatus,
    getOrdersCount,
    getOrdersByStatus
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};

export default OrdersContext;
