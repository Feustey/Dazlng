import { io, Socket } from 'socket.io-client/build/esm';

class WebSocketService {
  private socket: Socket | null = null;

  connect(): void {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "" ?? '';
    if (!this.socket) {
      this.socket = io(wsUrl, {
        auth: {
          token: localStorage.getItem('mcp_token')
        },
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
      });

      this.socket.on('connect', () => {
        console.log('WebSocket connecté');
      });

      this.socket.on('disconnect', () => {
        console.log('WebSocket déconnecté');
      });
    }
  }

  subscribe(event: string, callback: (data: unknown) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const wsService = new WebSocketService(); 