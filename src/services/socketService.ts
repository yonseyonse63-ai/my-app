import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    this.socket = io(window.location.origin);
    
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    return this.socket;
  }

  onInitialData(callback: (data: any) => void) {
    this.socket?.on('initial_data', callback);
  }

  onDataUpdate(callback: (data: any) => void) {
    this.socket?.on('data_update', callback);
  }

  deposit(amount: number) {
    this.socket?.emit('deposit', { amount });
  }

  withdraw(amount: number) {
    this.socket?.emit('withdraw', { amount });
  }

  createTransaction(data: any) {
    this.socket?.emit('create_transaction', data);
  }

  disconnect() {
    this.socket?.disconnect();
  }
}

export const socketService = new SocketService();
