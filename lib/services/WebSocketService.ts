import { io, Socket } from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";
import { getToken } from "./AuthLocalService";
import { AUTH_TOKEN, REFRESH_TOKEN } from "./LocalKeys";
import { API_REFRESH_TOKEN_ENDPOINT } from "./apis";

class WebSocketService {
  private static instance: WebSocketService;
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isRefreshing = false;

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

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://corteksa.cloud/api/";
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || apiUrl.replace(/^https?:\/\//, "wss://").replace(/\/api\/$/, "");

    this.socket = io(`${wsUrl}/ai/template`, {
      // Dynamic auth — reads fresh token on every connect/reconnect
      auth: (cb) => {
        cb({ token: getToken() });
      },
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

  /**
   * Refresh the access token and reconnect the WebSocket.
   * Called when server returns AUTH_INVALID on an active connection.
   */
  async refreshAndReconnect(): Promise<boolean> {
    if (this.isRefreshing) return false;
    this.isRefreshing = true;

    try {
      const refreshToken = Cookies.get(REFRESH_TOKEN);
      if (!refreshToken) return false;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://corteksa.cloud/api/";
      const response = await axios.post(
        `${apiUrl}${API_REFRESH_TOKEN_ENDPOINT}`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );

      const newAccessToken = response.data.data.token;
      const newRefreshToken = response.data.data.refresh_token;

      Cookies.set(AUTH_TOKEN, newAccessToken);
      Cookies.set(REFRESH_TOKEN, newRefreshToken);

      // Reconnect with the fresh token
      if (this.socket) {
        this.socket.disconnect();
        this.socket.connect();
      }

      return true;
    } catch {
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
    }
  }

  emit(event: string, payload: any): void {
    if (!this.socket || !this.socket.connected) {
      console.error("[WebSocket] Cannot emit - socket not connected");
      return;
    }

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
