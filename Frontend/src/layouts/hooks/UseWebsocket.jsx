
// frontend/src/layouts/hooks/UseWebsocket.jsx
import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Simple WebSocket hook.
 * - url: websocket URL (ws:// or wss://)
 * - options: { autoReconnect: boolean, reconnectInterval: ms }
 *
 * Returns: { isConnected, lastMessage, messages, send, close }
 */
export default function UseWebsocket(url, options = {}) {
  const { autoReconnect = false, reconnectInterval = 3000 } = options;
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);

  const connect = useCallback(() => {
    if (!url) return;

    // Avoid creating multiple sockets
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    try {
      wsRef.current = new WebSocket(url);
    } catch (e) {
      console.error('WebSocket create error:', e);
      return;
    }

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    wsRef.current.onmessage = (evt) => {
      const raw = evt.data;
      let parsed = raw;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        // keep raw string if not JSON
      }
      setLastMessage(parsed);
      setMessages(prev => [...prev, parsed]);
    };

    wsRef.current.onclose = (evt) => {
      console.log('WebSocket closed', evt.code, evt.reason);
      setIsConnected(false);
      wsRef.current = null;

      if (autoReconnect) {
        reconnectTimer.current = setTimeout(() => {
          connect();
        }, reconnectInterval);
      }
    };

    wsRef.current.onerror = (err) => {
      console.error('WebSocket error', err);
    };
  }, [url, autoReconnect, reconnectInterval]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  const send = useCallback((data) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket is not open. ReadyState:', wsRef.current?.readyState);
      return false;
    }

    let payload = data;
    if (typeof data === 'object') payload = JSON.stringify(data);

    wsRef.current.send(payload);
    return true;
  }, []);

  const close = useCallback(() => {
    if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  return { isConnected, lastMessage, messages, send, close };
}