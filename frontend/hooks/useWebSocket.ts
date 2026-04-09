import { useEffect, useState, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { getSockJsUrl } from '@/lib/runtimeConfig';

export const useWebSocket = (userId: string) => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [status, setStatus] = useState<'CONNECTING' | 'CONNECTED' | 'DISCONNECTED'>('DISCONNECTED');

  useEffect(() => {
    if (!userId || typeof window === 'undefined') return;

    const client = new Client({
      webSocketFactory: () => new SockJS(getSockJsUrl()),
      debug: (str) => console.log('STOMP: ' + str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      console.log('Connected: ' + frame);
      setStatus('CONNECTED');

      // Subscribe to public messages
      client.subscribe('/topic/public', (message: IMessage) => {
        const msg = JSON.parse(message.body);
        setMessages((prev) => [...prev, msg]);
      });

      // Subscribe to private messages
      client.subscribe(`/user/${userId}/queue/messages`, (message: IMessage) => {
        const msg = JSON.parse(message.body);
        setMessages((prev) => [...prev, msg]);
      });

      // Subscribe to incoming calls
      client.subscribe(`/user/${userId}/queue/calls`, (message: IMessage) => {
        const signal = JSON.parse(message.body);
        // Identify signal type (INVITE, BYE, etc)
        if (signal.content.includes('OFFER') || signal.type === 'CALL_SIGNAL') {
           setIncomingCall(signal);
        }
      });

      // Subscribe to reading status
      client.subscribe(`/user/${userId}/queue/read`, (message: IMessage) => {
        const receipt = JSON.parse(message.body);
        setMessages((prev) => 
          prev.map(m => (m.senderId === userId && m.receiverId === receipt.senderId) ? { ...m, isRead: true } : m)
        );
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      setStatus('DISCONNECTED');
    };

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
      setStatus('DISCONNECTED');
    };
  }, [userId]);

  const sendMessage = useCallback((receiverId: string, content: string, type: string = 'CHAT') => {
    if (stompClient && stompClient.connected) {
      const message = {
        senderId: userId,
        receiverId,
        content,
        type,
        timestamp: new Date().toISOString()
      };
      stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(message)
      });
      // Also add to local state if it's a direct message (since we don't subscribe to our own /user queue)
      setMessages((prev) => [...prev, message]);
    }
  }, [stompClient, userId]);

  const sendSignal = useCallback((receiverId: string, signalData: any) => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: '/app/call.signal',
        body: JSON.stringify({
          senderId: userId,
          receiverId,
          content: typeof signalData === 'string' ? signalData : JSON.stringify(signalData),
          type: 'CALL_SIGNAL'
        })
      });
    }
  }, [stompClient, userId]);

  const sendReadReceipt = useCallback((senderId: string) => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: '/app/chat.readReceipt',
        body: JSON.stringify({ senderId: userId, receiverId: senderId })
      });
    }
  }, [stompClient, userId]);

  return { sendMessage, sendSignal, sendReadReceipt, messages, setMessages, incomingCall, setIncomingCall, status };
};
