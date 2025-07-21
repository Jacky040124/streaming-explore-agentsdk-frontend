import { useEffect, useRef, useState } from 'react';

interface SSEOptions {
  onMessage: (data: any) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

interface SSEHookReturn {
  isConnected: boolean;
  close: () => void;
}

export function useSSE(url: string | null, options: SSEOptions): SSEHookReturn {
  const eventSourceRef = useRef<EventSource | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!url) return;

    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('SSE connection opened');
      setIsConnected(true);
      options.onOpen?.();
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        options.onMessage(data);
        
        // Close connection if we receive a complete event
        if (data.type === 'complete') {
          eventSource.close();
          setIsConnected(false);
          options.onClose?.();
        }
      } catch (error) {
        console.error('Failed to parse SSE data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      setIsConnected(false);
      options.onError?.(error);
      
      // Close the connection on error to prevent auto-reconnect
      eventSource.close();
    };

    // Cleanup function
    return () => {
      eventSource.close();
      setIsConnected(false);
      eventSourceRef.current = null;
    };
  }, [url]); // Only re-run if URL changes

  const close = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      setIsConnected(false);
      eventSourceRef.current = null;
    }
  };

  return { isConnected, close };
}