type EventCallback = (data: any) => void;

export class SocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private reconnectTimer: any = null;
  private isConnecting: boolean = false;
  public isConnected: boolean = false;

  constructor(url?: string) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname || 'localhost';
    this.url = url || `${protocol}//${host}:8000/ws/live`;
  }

  public connect() {
    if (this.ws || this.isConnecting) return;
    this.isConnecting = true;

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.isConnecting = false;
        console.log('⚡ Connected to FLUXX Live Telemetry WebSocket Stream');
        this.emit('connectionChange', { status: 'CONNECTED' });
        this.emit('status', true);
      };

      this.ws.onmessage = (event) => {
        try {
          const packet = JSON.parse(event.data);
          const eventType = packet.event || 'message';
          this.emit(eventType, packet);
          if (packet.event === 'telemetry') this.emit('telemetry', packet.data || packet);
          if (packet.event === 'heatmap_batch') this.emit('heatmap_batch', packet.data || packet);
          if (packet.event === 'alert') this.emit('alert', packet.data || packet);
          this.emit('*', packet);
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.isConnecting = false;
        this.ws = null;
        console.warn('WebSocket stream disconnected. Reconnecting in 2.5s...');
        this.emit('connectionChange', { status: 'DISCONNECTED' });
        this.emit('status', false);
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        console.warn('WebSocket error:', err);
        this.ws?.close();
      };
    } catch (e) {
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, 2500);
  }

  public on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  public onStatusChange(callback: (status: boolean) => void) {
    return this.on('status', (s: any) => callback(Boolean(s)));
  }

  public onTelemetry(callback: (data: any) => void) {
    return this.on('telemetry', callback);
  }

  public onHeatmapBatch(callback: (data: any) => void) {
    return this.on('heatmap_batch', callback);
  }

  public onAlert(callback: (data: any) => void) {
    return this.on('alert', callback);
  }

  public off(event: string, callback: EventCallback) {
    const subs = this.listeners.get(event);
    if (subs) {
      subs.delete(callback);
    }
  }

  private emit(event: string, data: any) {
    const subs = this.listeners.get(event);
    if (subs) {
      subs.forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in WebSocket listener for ${event}:`, err);
        }
      });
    }
  }

  public send(payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  public disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const socketService = new SocketClient();
export const socket = socketService;
