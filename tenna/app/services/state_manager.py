"""Enhanced state management system with thread-safe access and event handling."""

import asyncio
import logging
import threading
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Callable, Dict, List, Optional, Set, Tuple
from collections import defaultdict

from app.models.motor import ControllerMode, MotorPosition


logger = logging.getLogger(__name__)


class StateChangeEvent(Enum):
    """Types of state change events."""
    MODE_CHANGED = "mode_changed"
    POSITION_UPDATED = "position_updated"
    TARGET_UPDATED = "target_updated"
    GPS_POSITION_UPDATED = "gps_position_updated"
    ERROR_OCCURRED = "error_occurred"
    ERROR_CLEARED = "error_cleared"
    LOG_ADDED = "log_added"


@dataclass
class GPSPosition:
    """GPS position data structure."""
    lat: float
    lon: float
    alt: float
    timestamp: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary representation."""
        return {
            "lat": self.lat,
            "lon": self.lon,
            "alt": self.alt,
            "timestamp": self.timestamp.isoformat()
        }


@dataclass
class StateChangeNotification:
    """Notification for state changes."""
    event_type: StateChangeEvent
    old_value: Any
    new_value: Any
    timestamp: datetime = field(default_factory=datetime.now)
    metadata: Dict[str, Any] = field(default_factory=dict)


# Type alias for event handlers
EventHandler = Callable[[StateChangeNotification], None]


class StateManager:
    """Enhanced thread-safe state management system with event handling."""
    
    def __init__(self):
        """Initialize the state manager."""
        # Thread safety
        self._lock = threading.RLock()  # Reentrant lock for nested calls
        self._async_lock = asyncio.Lock()
        
        # Core state variables
        self._mode: ControllerMode = ControllerMode.SIMULATION
        self._current_position: Optional[MotorPosition] = None
        self._target_position: Optional[MotorPosition] = None
        
        # GPS positions
        self._antenna_position_gps: Optional[GPSPosition] = GPSPosition(
            lat=45.420109, lon=-75.680510, alt=60
        )
        self._rocket_position_gps: Optional[GPSPosition] = GPSPosition(
            lat=45.421413, lon=-75.680510, alt=205
        )
        
        # Manual target (for manual control mode)
        self._manual_target_rad: Dict[str, float] = {"pitch": 0.0, "yaw": 0.0}
        
        # Error tracking
        self._errors: List[str] = []
        self._error_history: List[Tuple[str, datetime]] = []
        
        # Logging
        self._logs: List[str] = []
        self._max_logs: int = 1000  # Maximum number of logs to keep
        
        # Event handling
        self._event_handlers: Dict[StateChangeEvent, Set[EventHandler]] = defaultdict(set)
        self._global_handlers: Set[EventHandler] = set()
        
        # State change history
        self._change_history: List[StateChangeNotification] = []
        self._max_history: int = 100
        
        logger.info("StateManager initialized")
    
    # Context managers for thread safety
    
    def __enter__(self):
        """Enter synchronous context manager."""
        self._lock.acquire()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Exit synchronous context manager."""
        self._lock.release()
    
    async def __aenter__(self):
        """Enter asynchronous context manager."""
        await self._async_lock.acquire()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Exit asynchronous context manager."""
        self._async_lock.release()
    
    # Event handling methods
    
    def subscribe(self, event_type: StateChangeEvent, handler: EventHandler) -> None:
        """Subscribe to specific state change events.
        
        Args:
            event_type: Type of event to subscribe to
            handler: Callback function to handle the event
        """
        with self._lock:
            self._event_handlers[event_type].add(handler)
            logger.debug(f"Handler subscribed to {event_type.value} events")
    
    def subscribe_all(self, handler: EventHandler) -> None:
        """Subscribe to all state change events.
        
        Args:
            handler: Callback function to handle all events
        """
        with self._lock:
            self._global_handlers.add(handler)
            logger.debug("Handler subscribed to all events")
    
    def unsubscribe(self, event_type: StateChangeEvent, handler: EventHandler) -> None:
        """Unsubscribe from specific state change events.
        
        Args:
            event_type: Type of event to unsubscribe from
            handler: Callback function to remove
        """
        with self._lock:
            self._event_handlers[event_type].discard(handler)
            logger.debug(f"Handler unsubscribed from {event_type.value} events")
    
    def unsubscribe_all(self, handler: EventHandler) -> None:
        """Unsubscribe from all state change events.
        
        Args:
            handler: Callback function to remove
        """
        with self._lock:
            self._global_handlers.discard(handler)
            for handlers in self._event_handlers.values():
                handlers.discard(handler)
            logger.debug("Handler unsubscribed from all events")
    
    def _notify_handlers(self, notification: StateChangeNotification) -> None:
        """Notify all relevant event handlers.
        
        Args:
            notification: State change notification to send
        """
        # Note: This method assumes the lock is already held
        
        # Add to change history
        self._change_history.append(notification)
        if len(self._change_history) > self._max_history:
            self._change_history.pop(0)
        
        # Notify specific event handlers
        handlers_to_notify = set()
        handlers_to_notify.update(self._event_handlers[notification.event_type])
        handlers_to_notify.update(self._global_handlers)
        
        # Call handlers (release lock temporarily to avoid deadlocks)
        if handlers_to_notify:
            self._lock.release()
            try:
                for handler in handlers_to_notify:
                    try:
                        handler(notification)
                    except Exception as e:
                        logger.error(f"Error in event handler: {e}")
            finally:
                self._lock.acquire()
    
    # Mode management
    
    @property
    def mode(self) -> ControllerMode:
        """Get current controller mode."""
        with self._lock:
            return self._mode
    
    @mode.setter
    def mode(self, new_mode: ControllerMode) -> None:
        """Set controller mode with event notification."""
        with self._lock:
            if self._mode != new_mode:
                old_mode = self._mode
                self._mode = new_mode
                
                notification = StateChangeNotification(
                    event_type=StateChangeEvent.MODE_CHANGED,
                    old_value=old_mode,
                    new_value=new_mode
                )
                self._notify_handlers(notification)
                
                logger.info(f"Mode changed from {old_mode.value} to {new_mode.value}")
    
    def set_mode(self, mode: str) -> bool:
        """Set mode from string value.
        
        Args:
            mode: Mode string (simulation, hardware, offline)
            
        Returns:
            True if mode was set successfully, False otherwise
        """
        try:
            controller_mode = ControllerMode(mode.lower())
            self.mode = controller_mode
            return True
        except ValueError:
            logger.warning(f"Invalid mode: {mode}")
            return False
    
    # Position management
    
    @property
    def current_position(self) -> Optional[MotorPosition]:
        """Get current motor position."""
        with self._lock:
            return self._current_position
    
    @current_position.setter
    def current_position(self, position: Optional[MotorPosition]) -> None:
        """Set current motor position with event notification."""
        with self._lock:
            old_position = self._current_position
            self._current_position = position
            
            notification = StateChangeNotification(
                event_type=StateChangeEvent.POSITION_UPDATED,
                old_value=old_position,
                new_value=position
            )
            self._notify_handlers(notification)
    
    def update_position(self, pitch_rad: float, yaw_rad: float) -> None:
        """Update current position from radians.
        
        Args:
            pitch_rad: Pitch position in radians
            yaw_rad: Yaw position in radians
        """
        position = MotorPosition(
            pitch_rad=pitch_rad,
            yaw_rad=yaw_rad,
            timestamp=datetime.now()
        )
        self.current_position = position
    
    def get_current_position_dict(self) -> Dict[str, float]:
        """Get current position as dictionary (for backward compatibility).
        
        Returns:
            Dictionary with pitch and yaw in radians
        """
        with self._lock:
            if self._current_position:
                return {
                    "pitch": self._current_position.pitch_rad,
                    "yaw": self._current_position.yaw_rad
                }
            return {"pitch": 0.0, "yaw": 0.0}
    
    # Target position management
    
    @property
    def target_position(self) -> Optional[MotorPosition]:
        """Get target motor position."""
        with self._lock:
            return self._target_position
    
    @target_position.setter
    def target_position(self, position: Optional[MotorPosition]) -> None:
        """Set target motor position with event notification."""
        with self._lock:
            old_position = self._target_position
            self._target_position = position
            
            notification = StateChangeNotification(
                event_type=StateChangeEvent.TARGET_UPDATED,
                old_value=old_position,
                new_value=position
            )
            self._notify_handlers(notification)
    
    def set_target(self, pitch_rad: float, yaw_rad: float) -> None:
        """Set target position from radians.
        
        Args:
            pitch_rad: Target pitch position in radians
            yaw_rad: Target yaw position in radians
        """
        position = MotorPosition(
            pitch_rad=pitch_rad,
            yaw_rad=yaw_rad,
            timestamp=datetime.now()
        )
        self.target_position = position
    
    # Manual target management (for backward compatibility)
    
    @property
    def manual_target_rad(self) -> Dict[str, float]:
        """Get manual target in radians (for backward compatibility)."""
        with self._lock:
            return self._manual_target_rad.copy()
    
    @manual_target_rad.setter
    def manual_target_rad(self, target: Dict[str, float]) -> None:
        """Set manual target in radians."""
        with self._lock:
            old_target = self._manual_target_rad.copy()
            self._manual_target_rad = target.copy()
            
            # Also update the target position
            self.set_target(target.get("pitch", 0.0), target.get("yaw", 0.0))
            
            notification = StateChangeNotification(
                event_type=StateChangeEvent.TARGET_UPDATED,
                old_value=old_target,
                new_value=target,
                metadata={"source": "manual"}
            )
            self._notify_handlers(notification)
    
    # GPS position management
    
    @property
    def antenna_position_gps(self) -> Optional[GPSPosition]:
        """Get antenna GPS position."""
        with self._lock:
            return self._antenna_position_gps
    
    @antenna_position_gps.setter
    def antenna_position_gps(self, position: Optional[GPSPosition]) -> None:
        """Set antenna GPS position with event notification."""
        with self._lock:
            old_position = self._antenna_position_gps
            self._antenna_position_gps = position
            
            notification = StateChangeNotification(
                event_type=StateChangeEvent.GPS_POSITION_UPDATED,
                old_value=old_position,
                new_value=position,
                metadata={"type": "antenna"}
            )
            self._notify_handlers(notification)
    
    def set_antenna_position_gps(self, lat: float, lon: float, alt: float) -> None:
        """Set antenna GPS position from coordinates.
        
        Args:
            lat: Latitude
            lon: Longitude
            alt: Altitude
        """
        position = GPSPosition(lat=lat, lon=lon, alt=alt)
        self.antenna_position_gps = position
    
    def get_antenna_position_dict(self) -> Dict[str, float]:
        """Get antenna position as dictionary (for backward compatibility)."""
        with self._lock:
            if self._antenna_position_gps:
                return {
                    "lat": self._antenna_position_gps.lat,
                    "lon": self._antenna_position_gps.lon,
                    "alt": self._antenna_position_gps.alt
                }
            return {"lat": 0.0, "lon": 0.0, "alt": 0.0}
    
    @property
    def rocket_position_gps(self) -> Optional[GPSPosition]:
        """Get rocket GPS position."""
        with self._lock:
            return self._rocket_position_gps
    
    @rocket_position_gps.setter
    def rocket_position_gps(self, position: Optional[GPSPosition]) -> None:
        """Set rocket GPS position with event notification."""
        with self._lock:
            old_position = self._rocket_position_gps
            self._rocket_position_gps = position
            
            notification = StateChangeNotification(
                event_type=StateChangeEvent.GPS_POSITION_UPDATED,
                old_value=old_position,
                new_value=position,
                metadata={"type": "rocket"}
            )
            self._notify_handlers(notification)
    
    def set_rocket_position_gps(self, lat: float, lon: float, alt: float) -> None:
        """Set rocket GPS position from coordinates.
        
        Args:
            lat: Latitude
            lon: Longitude
            alt: Altitude
        """
        position = GPSPosition(lat=lat, lon=lon, alt=alt)
        self.rocket_position_gps = position
    
    def get_rocket_position_dict(self) -> Dict[str, float]:
        """Get rocket position as dictionary (for backward compatibility)."""
        with self._lock:
            if self._rocket_position_gps:
                return {
                    "lat": self._rocket_position_gps.lat,
                    "lon": self._rocket_position_gps.lon,
                    "alt": self._rocket_position_gps.alt
                }
            return {"lat": 0.0, "lon": 0.0, "alt": 0.0}
    
    # Error management
    
    @property
    def errors(self) -> List[str]:
        """Get current errors."""
        with self._lock:
            return self._errors.copy()
    
    def add_error(self, error: str) -> None:
        """Add an error with event notification.
        
        Args:
            error: Error message to add
        """
        with self._lock:
            if error not in self._errors:
                self._errors.append(error)
                self._error_history.append((error, datetime.now()))
                
                notification = StateChangeNotification(
                    event_type=StateChangeEvent.ERROR_OCCURRED,
                    old_value=None,
                    new_value=error
                )
                self._notify_handlers(notification)
                
                logger.error(f"Error added to state: {error}")
    
    def clear_errors(self) -> None:
        """Clear all errors with event notification."""
        with self._lock:
            if self._errors:
                old_errors = self._errors.copy()
                self._errors.clear()
                
                notification = StateChangeNotification(
                    event_type=StateChangeEvent.ERROR_CLEARED,
                    old_value=old_errors,
                    new_value=[]
                )
                self._notify_handlers(notification)
                
                logger.info("All errors cleared from state")
    
    def remove_error(self, error: str) -> bool:
        """Remove a specific error.
        
        Args:
            error: Error message to remove
            
        Returns:
            True if error was removed, False if not found
        """
        with self._lock:
            if error in self._errors:
                self._errors.remove(error)
                
                notification = StateChangeNotification(
                    event_type=StateChangeEvent.ERROR_CLEARED,
                    old_value=error,
                    new_value=None
                )
                self._notify_handlers(notification)
                
                logger.info(f"Error removed from state: {error}")
                return True
            return False
    
    def has_errors(self) -> bool:
        """Check if there are any current errors."""
        with self._lock:
            return len(self._errors) > 0
    
    def get_error_history(self) -> List[Tuple[str, datetime]]:
        """Get error history."""
        with self._lock:
            return self._error_history.copy()
    
    # Logging management
    
    @property
    def logs(self) -> List[str]:
        """Get current logs."""
        with self._lock:
            return self._logs.copy()
    
    def add_log(self, message: str) -> None:
        """Add a log message with event notification.
        
        Args:
            message: Log message to add
        """
        with self._lock:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            log_entry = f"[{timestamp}] {message}"
            
            self._logs.append(log_entry)
            
            # Trim logs if too many
            if len(self._logs) > self._max_logs:
                self._logs.pop(0)
            
            notification = StateChangeNotification(
                event_type=StateChangeEvent.LOG_ADDED,
                old_value=None,
                new_value=log_entry
            )
            self._notify_handlers(notification)
    
    def clear_logs(self) -> None:
        """Clear all logs."""
        with self._lock:
            self._logs.clear()
            logger.info("All logs cleared from state")
    
    def get_recent_logs(self, count: int = 50) -> List[str]:
        """Get recent log entries.
        
        Args:
            count: Number of recent logs to return
            
        Returns:
            List of recent log entries
        """
        with self._lock:
            return self._logs[-count:] if self._logs else []
    
    # State introspection and debugging
    
    def get_state_snapshot(self) -> Dict[str, Any]:
        """Get a complete snapshot of current state.
        
        Returns:
            Dictionary containing all state information
        """
        with self._lock:
            return {
                "mode": self._mode.value,
                "current_position": self._current_position.to_dict() if self._current_position else None,
                "target_position": self._target_position.to_dict() if self._target_position else None,
                "manual_target_rad": self._manual_target_rad.copy(),
                "antenna_position_gps": self._antenna_position_gps.to_dict() if self._antenna_position_gps else None,
                "rocket_position_gps": self._rocket_position_gps.to_dict() if self._rocket_position_gps else None,
                "errors": self._errors.copy(),
                "error_count": len(self._errors),
                "log_count": len(self._logs),
                "event_handler_count": sum(len(handlers) for handlers in self._event_handlers.values()),
                "global_handler_count": len(self._global_handlers),
                "change_history_count": len(self._change_history)
            }
    
    def get_change_history(self, count: int = 10) -> List[Dict[str, Any]]:
        """Get recent state change history.
        
        Args:
            count: Number of recent changes to return
            
        Returns:
            List of recent state changes
        """
        with self._lock:
            recent_changes = self._change_history[-count:] if self._change_history else []
            return [
                {
                    "event_type": change.event_type.value,
                    "old_value": str(change.old_value),
                    "new_value": str(change.new_value),
                    "timestamp": change.timestamp.isoformat(),
                    "metadata": change.metadata
                }
                for change in recent_changes
            ]
    
    # Cleanup and maintenance
    
    def cleanup(self) -> None:
        """Perform cleanup operations."""
        with self._lock:
            # Clear old change history
            if len(self._change_history) > self._max_history:
                self._change_history = self._change_history[-self._max_history:]
            
            # Clear old logs
            if len(self._logs) > self._max_logs:
                self._logs = self._logs[-self._max_logs:]
            
            # Clear old error history (keep last 100)
            if len(self._error_history) > 100:
                self._error_history = self._error_history[-100:]
            
            logger.debug("State manager cleanup completed")


# Global state manager instance
state_manager = StateManager()