"""WebSocket API routes for real-time communication."""

import logging
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import get_state_manager, create_error_response
from app.services.state_manager import StateManager
from app.services.websocket_service import get_websocket_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/websocket", tags=["websocket"])


@router.get("/info")
async def websocket_info():
    """Get WebSocket connection information."""
    return {
        "websocket_url": "/ws",
        "events": {
            "client_to_server": [
                "connect",
                "disconnect", 
                "request_status",
                "request_logs"
            ],
            "server_to_client": [
                "position_update",
                "status_update",
                "logs_update",
                "log_entry",
                "error"
            ]
        },
        "connection_info": "Connect to /ws using Socket.IO client",
        "example_usage": {
            "javascript": "const socket = io('/ws'); socket.on('position_update', (data) => console.log(data));"
        }
    }


@router.get("/stats")
async def websocket_stats(
    state_manager: StateManager = Depends(get_state_manager)
):
    """Get WebSocket connection statistics."""
    try:
        ws_service = get_websocket_service(state_manager)
        
        return {
            "connected_clients": len(ws_service.connected_clients),
            "client_ids": list(ws_service.connected_clients),
            "update_loop_running": ws_service._running,
            "service_status": "active" if ws_service._running else "inactive"
        }
        
    except Exception as e:
        logger.error(f"Error getting WebSocket stats: {str(e)}")
        return create_error_response(e, 500, "WEBSOCKET_STATS_ERROR")


@router.post("/broadcast/position")
async def broadcast_position_update(
    position_data: Dict[str, Any],
    state_manager: StateManager = Depends(get_state_manager)
):
    """Manually broadcast a position update to all connected clients."""
    try:
        ws_service = get_websocket_service(state_manager)
        await ws_service.broadcast_position_update(position_data)
        
        return {
            "message": "Position update broadcasted",
            "clients_notified": len(ws_service.connected_clients),
            "data": position_data
        }
        
    except Exception as e:
        logger.error(f"Error broadcasting position update: {str(e)}")
        return create_error_response(e, 500, "BROADCAST_ERROR")


@router.post("/broadcast/status")
async def broadcast_status_update(
    status_data: Dict[str, Any],
    state_manager: StateManager = Depends(get_state_manager)
):
    """Manually broadcast a status update to all connected clients."""
    try:
        ws_service = get_websocket_service(state_manager)
        await ws_service.broadcast_status_update(status_data)
        
        return {
            "message": "Status update broadcasted",
            "clients_notified": len(ws_service.connected_clients),
            "data": status_data
        }
        
    except Exception as e:
        logger.error(f"Error broadcasting status update: {str(e)}")
        return create_error_response(e, 500, "BROADCAST_ERROR")


@router.post("/broadcast/log")
async def broadcast_log_entry(
    log_entry: str,
    state_manager: StateManager = Depends(get_state_manager)
):
    """Manually broadcast a log entry to all connected clients."""
    try:
        ws_service = get_websocket_service(state_manager)
        await ws_service.broadcast_log_update(log_entry)
        
        return {
            "message": "Log entry broadcasted",
            "clients_notified": len(ws_service.connected_clients),
            "log_entry": log_entry
        }
        
    except Exception as e:
        logger.error(f"Error broadcasting log entry: {str(e)}")
        return create_error_response(e, 500, "BROADCAST_ERROR")