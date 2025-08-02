"""API route modules."""

from .motor import router as motor_router
from .status import router as status_router
from .config import router as config_router
from .websocket import router as websocket_router

__all__ = ["motor_router", "status_router", "config_router", "websocket_router"]