import json
import logging
from typing import List, Dict, Any, Set
from fastapi import WebSocket

logger = logging.getLogger(__name__)

class WebSocketManager:
    def __init__(self):
        # List of all active WebSocket connections
        self.active_connections: List[WebSocket] = []
        # Subscriptions by topic (e.g. "telemetry", "drone_VTOL-001", "alerts")
        self.subscriptions: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"Client connected. Total active connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        for topic, subs in list(self.subscriptions.items()):
            if websocket in subs:
                subs.remove(websocket)
        logger.info(f"Client disconnected. Remaining connections: {len(self.active_connections)}")

    async def subscribe(self, websocket: WebSocket, topic: str):
        if topic not in self.subscriptions:
            self.subscriptions[topic] = set()
        self.subscriptions[topic].add(websocket)

    async def unsubscribe(self, websocket: WebSocket, topic: str):
        if topic in self.subscriptions and websocket in self.subscriptions[topic]:
            self.subscriptions[topic].remove(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        """Broadcast JSON message to all connected clients."""
        if not self.active_connections:
            return
        
        json_str = json.dumps(message)
        dead_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_text(json_str)
            except Exception as e:
                logger.warning(f"Error sending message to client: {e}")
                dead_connections.append(connection)
        
        for dead in dead_connections:
            self.disconnect(dead)

    async def broadcast_to_topic(self, topic: str, message: Dict[str, Any]):
        """Broadcast message only to clients subscribed to a specific topic."""
        subs = self.subscriptions.get(topic, set())
        if not subs:
            return
        
        json_str = json.dumps(message)
        dead_connections = []
        for connection in subs:
            try:
                await connection.send_text(json_str)
            except Exception as e:
                logger.warning(f"Error sending to topic subscriber: {e}")
                dead_connections.append(connection)
                
        for dead in dead_connections:
            self.disconnect(dead)

# Global singleton
ws_manager = WebSocketManager()
