"""WebSocket service for real-time updates."""

import asyncio
import json
import logging
import math
from datetime import datetime
from typing import Dict, Set, Any, Optional
from contextlib import asynccontextmanager

import socketio
from fastapi import FastAPI

from app.services.state_manager import StateManager

logger = logging.getLogger(__name__)


class WebSocketService:
    """Service for managing WebSocket connections and real-time updates."""
    
    def __init__(self, state_manager: StateManager):
        self.state_manager = state_manager
        self.sio = socketio.AsyncServer(
            async_mode='asgi',
            cors_allowed_origins="*",  # Configure appropriately for production
            logger=logger,
            engineio_logger=logger
        )
        self.connected_clients: Set[str] = set()
        self._update_task: Optional[asyncio.Task] = None
        self._running = False
        
        # Register event handlers
        self._register_handlers()
    
    def _register_handlers(self):
        """Register WebSocket event handlers."""
        
        @self.sio.event
        async def connect(sid, environ, auth):
            """Handle client connection."""
            logger.info(f"Client connected: {sid}")
            self.connected_clients.add(sid)
            
            # Send initial state to the newly connected client
            await self._send_initial_state(sid)
            
            return True
        
        @self.sio.event
        async def disconnect(sid):
            """Handle client disconnection."""
            logger.info(f"Client disconnected: {sid}")
            self.connected_clients.discard(sid)
        
        @self.sio.event
        async def request_status(sid):
            """Handle status request from client."""
            try:
                status_data = await self._get_status_data()
                await self.sio.emit('status_update', status_data, room=sid)
            except Exception as e:
                logger.error(f"Error sending status to {sid}: {str(e)}")
                await self.sio.emit('error', {
                    'message': 'Failed to get status',
                    'error': str(e)
                }, room=sid)
        
        @self.sio.event
        async def request_logs(sid, data=None):
            """Handle log request from client."""
            try:
                limit = data.get('limit', 50) if data else 50
                logs_data = await self._get_logs_data(limit)
                await self.sio.emit('logs_update', logs_data, room=sid)
            except Exception as e:
                logger.error(f"Error sending logs to {sid}: {str(e)}")
                await self.sio.emit('error', {
                    'message': 'Failed to get logs',
                    'error': str(e)
                }, room=sid)
    
    async def _send_initial_state(self, sid: str):
        """Send initial state to a newly connected client."""
        try:
            # Send current position
            position_data = await self._get_position_data()
            await self.sio.emit('position_update', position_data, room=sid)
            
            # Send current status
            status_data = await self._get_status_data()
            await self.sio.emit('status_update', status_data, room=sid)
            
            # Send recent logs
            logs_data = await self._get_logs_data(10)
            await self.sio.emit('logs_update', logs_data, room=sid)
            
        except Exception as e:
            logger.error(f"Error sending initial state to {sid}: {str(e)}")
            await self.sio.emit('error', {
                'message': 'Failed to get initial state',
                'error': str(e)
            }, room=sid)
    
    async def _get_position_data(self) -> Dict[str, Any]:
        """Get current position data."""
        position_dict = await self.state_manager.get_current_position_dict()
        pitch_rad = position_dict.get("pitch", 0.0)
        yaw_rad = position_dict.get("yaw", 0.0)
        
        # Get target position if available
        target_data = None
        manual_target = await self.state_manager.get_manual_target_rad()
        if manual_target:
            target_pitch_rad = manual_target.get("pitch", 0.0)
            target_yaw_rad = manual_target.get("yaw", 0.0)
            target_data = {
                "pitch_rad": target_pitch_rad,
                "yaw_rad": target_yaw_rad,
                "pitch_deg": math.degrees(target_pitch_rad),
                "yaw_deg": math.degrees(target_yaw_rad)
            }
        
        return {
            "current": {
                "pitch_rad": pitch_rad,
                "yaw_rad": yaw_rad,
                "pitch_deg": math.degrees(pitch_rad),
                "yaw_deg": math.degrees(yaw_rad)
            },
            "target": target_data,
            "timestamp": datetime.now().isoformat()
        }
    
    async def _get_status_data(self) -> Dict[str, Any]:
        """Get current status data."""
        current_mode = await self.state_manager.get_mode()
        is_connected = current_mode.value in ["simulation", "hardware"]
        
        # Get error messages
        errors = await self.state_manager.get_errors()
        
        return {
            "is_connected": is_connected,
            "is_calibrated": True,  # Can be enhanced with actual calibration status
            "mode": current_mode.value,
            "state": "idle",  # Can be enhanced with actual state tracking
            "errors": errors,
            "timestamp": datetime.now().isoformat()
        }
    
    async def _get_logs_data(self, limit: int = 50) -> Dict[str, Any]:
        """Get recent logs data."""
        # Simplified logs - just return error information
        errors = await self.state_manager.get_errors()
        
        return {
            "logs": errors,
            "count": len(errors),
            "message": "Error logs" if errors else "No errors",
            "timestamp": datetime.now().isoformat()
        }
    
    async def start_updates(self):
        """Start the real-time update loop."""
        if self._running:
            logger.warning("WebSocket updates already running")
            return
        
        self._running = True
        self._update_task = asyncio.create_task(self._update_loop())
        logger.info("WebSocket real-time updates started")
    
    async def stop_updates(self):
        """Stop the real-time update loop."""
        self._running = False
        if self._update_task:
            self._update_task.cancel()
            try:
                await self._update_task
            except asyncio.CancelledError:
                pass
            self._update_task = None
        logger.info("WebSocket real-time updates stopped")
    
    async def _update_loop(self):
        """Main update loop for broadcasting real-time data."""
        last_position = None
        last_status = None
        
        try:
            while self._running:
                if not self.connected_clients:
                    # No clients connected, sleep longer
                    await asyncio.sleep(1.0)
                    continue
                
                try:
                    # Get current position data
                    current_position = await self._get_position_data()
                    
                    # Only broadcast if position changed significantly
                    if self._position_changed(last_position, current_position):
                        await self.sio.emit('position_update', current_position)
                        last_position = current_position
                    
                    # Get current status data (less frequently)
                    if asyncio.get_event_loop().time() % 5 < 0.1:  # Every ~5 seconds
                        current_status = await self._get_status_data()
                        if self._status_changed(last_status, current_status):
                            await self.sio.emit('status_update', current_status)
                            last_status = current_status
                    
                    # Update at 60 FPS for smooth visualization
                    await asyncio.sleep(1.0 / 60.0)
                    
                except Exception as e:
                    logger.error(f"Error in update loop: {str(e)}")
                    await asyncio.sleep(1.0)
                    
        except asyncio.CancelledError:
            logger.info("WebSocket update loop cancelled")
        except Exception as e:
            logger.error(f"Unexpected error in update loop: {str(e)}")
    
    def _position_changed(self, last: Optional[Dict], current: Dict) -> bool:
        """Check if position changed significantly."""
        if last is None:
            return True
        
        # Check if current position changed by more than 0.1 degrees
        threshold = 0.1
        last_current = last.get("current", {})
        current_current = current.get("current", {})
        
        pitch_diff = abs(current_current.get("pitch_deg", 0) - last_current.get("pitch_deg", 0))
        yaw_diff = abs(current_current.get("yaw_deg", 0) - last_current.get("yaw_deg", 0))
        
        return pitch_diff > threshold or yaw_diff > threshold
    
    def _status_changed(self, last: Optional[Dict], current: Dict) -> bool:
        """Check if status changed."""
        if last is None:
            return True
        
        # Check key status fields
        return (
            last.get("is_connected") != current.get("is_connected") or
            last.get("mode") != current.get("mode") or
            last.get("state") != current.get("state") or
            len(last.get("errors", [])) != len(current.get("errors", []))
        )
    
    async def broadcast_position_update(self, position_data: Dict[str, Any]):
        """Broadcast position update to all connected clients."""
        if self.connected_clients:
            await self.sio.emit('position_update', position_data)
    
    async def broadcast_status_update(self, status_data: Dict[str, Any]):
        """Broadcast status update to all connected clients."""
        if self.connected_clients:
            await self.sio.emit('status_update', status_data)
    
    async def broadcast_log_update(self, log_entry: str):
        """Broadcast new log entry to all connected clients."""
        if self.connected_clients:
            log_data = {
                "log": log_entry,
                "timestamp": datetime.now().isoformat()
            }
            await self.sio.emit('log_entry', log_data)
    
    def get_asgi_app(self):
        """Get the ASGI app for mounting."""
        return socketio.ASGIApp(self.sio)


# Global WebSocket service instance
_websocket_service: Optional[WebSocketService] = None


def get_websocket_service(state_manager: StateManager) -> WebSocketService:
    """Get or create the WebSocket service instance."""
    global _websocket_service
    if _websocket_service is None:
        _websocket_service = WebSocketService(state_manager)
    return _websocket_service


@asynccontextmanager
async def websocket_lifespan(app: FastAPI, state_manager: StateManager):
    """Context manager for WebSocket service lifecycle."""
    ws_service = get_websocket_service(state_manager)
    await ws_service.start_updates()
    try:
        yield ws_service
    finally:
        await ws_service.stop_updates()