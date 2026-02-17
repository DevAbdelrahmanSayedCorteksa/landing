import { io, Socket } from "socket.io-client";
import { getToken } from "./AuthLocalService";

class WebSocketService {
  private static instance: WebSocketService;
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = getToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://corteksa.cloud/api/";
    // Convert HTTP(S) URL to WebSocket URL
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || apiUrl.replace(/^https?:\/\//, "wss://").replace(/\/api\/$/, "");

    this.socket = io(`${wsUrl}/ai/template`, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventHandlers();
    return this.socket;
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      this.reconnectAttempts = 0;
      console.log("[WebSocket] Connected");
    });

    this.socket.on("disconnect", (reason) => {
      console.log("[WebSocket] Disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      this.reconnectAttempts++;
      console.error("[WebSocket] Connection error:", error);

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("[WebSocket] Max reconnection attempts reached");
        this.socket?.disconnect();
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
      console.log("[WebSocket] Manually disconnected");
    }
  }

  emit(event: string, payload: any): void {
    if (!this.socket || !this.socket.connected) {
      console.error("[WebSocket] Cannot emit - socket not connected");
      return;
    }

    console.log(`[WebSocket] Emitting ${event}:`, payload);
    this.socket.emit(event, payload);
  }

  on(event: string, handler: (...args: any[]) => void): void {
    if (!this.socket) {
      console.error("[WebSocket] Cannot subscribe - socket not initialized");
      return;
    }

    this.socket.on(event, handler);
  }

  off(event: string, handler?: (...args: any[]) => void): void {
    if (!this.socket) {
      return;
    }

    if (handler) {
      this.socket.off(event, handler);
    } else {
      this.socket.off(event);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const wsService = WebSocketService.getInstance();
