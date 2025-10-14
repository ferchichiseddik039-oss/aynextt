import React, { useEffect, useState } from 'react';
import { useOrders } from '../contexts/OrdersContext';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';

const OrdersDebug = () => {
  const { orders, loading, error } = useOrders();
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [socketInfo, setSocketInfo] = useState({});

  useEffect(() => {
    if (socket) {
      setSocketInfo({
        id: socket.id,
        connected: socket.connected,
        disconnected: socket.disconnected
      });

      // Écouter TOUS les événements possibles
      const logEvent = (eventName) => (data) => {
        console.log(`🔔 Événement reçu: ${eventName}`, data);
        setEvents(prev => [{
          time: new Date().toLocaleTimeString(),
          event: eventName,
          data: JSON.stringify(data, null, 2)
        }, ...prev.slice(0, 9)]); // Garder les 10 derniers
      };

      socket.on('connect', () => logEvent('connect')());
      socket.on('disconnect', () => logEvent('disconnect')());
      socket.on('order-status-updated', logEvent('order-status-updated'));
      socket.on('new-order', logEvent('new-order'));
      socket.on('admin-order-updated', logEvent('admin-order-updated'));
      socket.on('admin-new-order', logEvent('admin-new-order'));

      return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('order-status-updated');
        socket.off('new-order');
        socket.off('admin-order-updated');
        socket.off('admin-new-order');
      };
    }
  }, [socket]);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '12px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>🐛 Debug WebSocket - Commandes</h1>

      {/* État de l'utilisateur */}
      <div style={{ background: '#f0f0f0', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>👤 Utilisateur</h2>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>

      {/* État WebSocket */}
      <div style={{ background: '#f0f0f0', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>
          🔌 WebSocket {isConnected ? '✅ Connecté' : '❌ Déconnecté'}
        </h2>
        <pre>{JSON.stringify(socketInfo, null, 2)}</pre>
      </div>

      {/* État des commandes */}
      <div style={{ background: '#f0f0f0', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>
          📦 Commandes ({orders?.length || 0})
        </h2>
        {loading && <p>⏳ Chargement...</p>}
        {error && <p style={{ color: 'red' }}>❌ {error}</p>}
        <pre style={{ maxHeight: '300px', overflow: 'auto' }}>
          {JSON.stringify(orders?.map(o => ({
            id: o._id,
            statut: o.statut,
            total: o.total
          })), null, 2)}
        </pre>
      </div>

      {/* Événements WebSocket */}
      <div style={{ background: '#f0f0f0', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>
          📡 Événements WebSocket reçus ({events.length})
        </h2>
        {events.length === 0 ? (
          <p>Aucun événement reçu. Changez le statut d'une commande dans l'admin.</p>
        ) : (
          events.map((event, index) => (
            <div key={index} style={{ 
              background: 'white', 
              padding: '10px', 
              marginBottom: '10px',
              borderLeft: '3px solid green'
            }}>
              <strong>{event.time} - {event.event}</strong>
              <pre style={{ marginTop: '5px', fontSize: '11px' }}>{event.data}</pre>
            </div>
          ))
        )}
      </div>

      {/* Test manuel */}
      <div style={{ background: '#ffe0e0', padding: '15px', borderRadius: '5px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>🧪 Test Manuel</h2>
        <p>Pour tester :</p>
        <ol>
          <li>Ouvrez l'admin dans un autre onglet</li>
          <li>Changez le statut d'une commande</li>
          <li>Observez si un événement apparaît ci-dessus</li>
          <li>Vérifiez si le statut de la commande change</li>
        </ol>
        <button
          onClick={() => {
            console.log('🔍 État actuel:', { orders, socket: socketInfo, isConnected });
            alert('Vérifiez la console navigateur (F12)');
          }}
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          📋 Logger l'état dans la console
        </button>
      </div>
    </div>
  );
};

export default OrdersDebug;

