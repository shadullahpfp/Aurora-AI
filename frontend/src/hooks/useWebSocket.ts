"use client";

import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/lib/store';

interface UseWebSocketProps {
    url: string;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: any) => void;
}

export const useWebSocket = ({ url, onConnect, onDisconnect, onError }: UseWebSocketProps) => {
    const wsRef = useRef<WebSocket | null>(null);
    const { addMessage, setStatus, enqueueAudio, setEmotion } = useStore();

    // Reconnection logic
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const onConnectRef = useRef(onConnect);
    const onDisconnectRef = useRef(onDisconnect);
    const onErrorRef = useRef(onError);

    useEffect(() => {
        onConnectRef.current = onConnect;
        onDisconnectRef.current = onDisconnect;
        onErrorRef.current = onError;
    }, [onConnect, onDisconnect, onError]);

    const connect = useCallback(() => {
        if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
            return;
        }

        console.log(`[WebSocket] Connecting to ${url}...`);

        try {
            const ws = new WebSocket(url);

            ws.onopen = () => {
                console.log('[WebSocket] Connected');
                useStore.getState().setStatus('idle');
                if (onConnectRef.current) onConnectRef.current();

                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    switch (data.type) {
                        case 'agent_state':
                            useStore.getState().setStatus(data.state);
                            break;

                        case 'text_stream':
                            // Handle partial streaming text (simplified here as full messages for now)
                            useStore.getState().addMessage({ role: 'agent', content: data.content });
                            break;

                        case 'audio_stream':
                            // Enqueue audio chunks and viseme metadata payload
                            useStore.getState().enqueueAudio({
                                audioBase64: data.audio,
                                visemes: data.visemes || []
                            });
                            break;

                        case 'emotion':
                            if (data.expression) {
                                useStore.getState().setEmotion(data.expression);
                            }
                            break;

                        case 'error':
                            console.error("[WebSocket Backend Error]", data.message);
                            if (onErrorRef.current) onErrorRef.current(data.message);
                            break;
                    }
                } catch (e) {
                    console.warn("[WebSocket] Failed to parse message", e);
                }
            };

            ws.onerror = (error) => {
                console.warn('[WebSocket] Error occurred connecting to backend.', error);
                if (onErrorRef.current) onErrorRef.current(error);
            };

            ws.onclose = (event) => {
                console.log(`[WebSocket] Disconnected code: ${event.code}`);
                useStore.getState().setStatus('disconnected');
                if (onDisconnectRef.current) onDisconnectRef.current();

                // Exponential backoff or simple reconnect
                if (!event.wasClean) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        console.log('[WebSocket] Attempting to reconnect...');
                        connect();
                    }, 3000);
                }
            };

            wsRef.current = ws;

        } catch (error) {
            console.error("[WebSocket] Connection setup failed", error);
        }
    }, [url]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        if (wsRef.current) {
            wsRef.current.close(1000, "Component unmounted");
            wsRef.current = null;
        }
    }, []);

    const sendTextMessage = useCallback((content: string) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            useStore.getState().addMessage({ role: 'user', content });
            wsRef.current.send(JSON.stringify({
                type: 'text',
                content: content
            }));
        } else {
            console.warn("[WebSocket] Not connected, cannot send message.");
        }
    }, []);

    // Voice transmission logic to be implemented 
    // const sendAudioBuffer = useCallback((audioPayload: string) => { ... }, []);

    // Effect to mount/unmount connection
    useEffect(() => {
        connect();
        return () => disconnect();
    }, [connect, disconnect]);

    return {
        sendTextMessage,
        readyState: wsRef.current?.readyState || WebSocket.CLOSED
    };
};
