"""Simplified state containers for motor control system."""

import asyncio
import logging
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

from app.models.motor import ControllerMode, MotorPosition


logger = logging.getLogger(__name__)


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
class MotorState:
    """Container for motor position and control state."""
    current_position: Optional[MotorPosition] = None
    target_position: Optional[MotorPosition] = None
    mode: ControllerMode = ControllerMode.SIMULATION
    manual_target_rad: Dict[str, float] = field(default_factory=lambda: {"pitch": 0.0, "yaw": 0.0})
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary representation."""
        return {
            "current_position": self.current_position.to_dict() if self.current_position else None,
            "target_position": self.target_position.to_dict() if self.target_position else None,
            "mode": self.mode.value,
            "manual_target_rad": self.manual_target_rad.copy()
        }


@dataclass
class GPSState:
    """Container for GPS position data."""
    antenna_position: Optional[GPSPosition] = field(
        default_factory=lambda: GPSPosition(lat=45.420109, lon=-75.680510, alt=60)
    )
    rocket_position: Optional[GPSPosition] = field(
        default_factory=lambda: GPSPosition(lat=45.421413, lon=-75.680510, alt=205)
    )
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary representation."""
        return {
            "antenna_position": self.antenna_position.to_dict() if self.antenna_position else None,
            "rocket_position": self.rocket_position.to_dict() if self.rocket_position else None
        }


@dataclass
class ErrorState:
    """Container for error tracking and history."""
    errors: List[str] = field(default_factory=list)
    history: List[Tuple[str, datetime]] = field(default_factory=list)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary representation."""
        return {
            "errors": self.errors.copy(),
            "error_count": len(self.errors),
            "history_count": len(self.history)
        }


class SimpleStateManager:
    """Simplified state manager with focused state containers and async locks."""
    
    def __init__(self):
        """Initialize the simplified state manager."""
        # Use only async locks for consistency
        self._motor_lock = asyncio.Lock()
        self._gps_lock = asyncio.Lock()
        self._error_lock = asyncio.Lock()
        
        # State containers
        self._motor_state = MotorState()
        self._gps_state = GPSState()
        self._error_state = ErrorState()
        
        logger.info("SimpleStateManager initialized")
    
    # Motor state management
    
    async def get_motor_state(self) -> MotorState:
        """Get a copy of the current motor state."""
        async with self._motor_lock:
            # Return a copy to prevent external modification
            return MotorState(
                current_position=self._motor_state.current_position,
                target_position=self._motor_state.target_position,
                mode=self._motor_state.mode,
                manual_target_rad=self._motor_state.manual_target_rad.copy()
            )
    
    async def update_current_position(self, position: Optional[MotorPosition]) -> None:
        """Update current motor position."""
        async with self._motor_lock:
            self._motor_state.current_position = position
            logger.debug(f"Current position updated: {position}")
    
    async def update_target_position(self, position: Optional[MotorPosition]) -> None:
        """Update target motor position."""
        async with self._motor_lock:
            self._motor_state.target_position = position
            logger.debug(f"Target position updated: {position}")
    
    async def update_mode(self, mode: ControllerMode) -> None:
        """Update controller mode."""
        async with self._motor_lock:
            if self._motor_state.mode != mode:
                old_mode = self._motor_state.mode
                self._motor_state.mode = mode
                logger.info(f"Mode changed from {old_mode.value} to {mode.value}")
    
    async def update_manual_target(self, pitch_rad: float, yaw_rad: float) -> None:
        """Update manual target position."""
        async with self._motor_lock:
            self._motor_state.manual_target_rad = {"pitch": pitch_rad, "yaw": yaw_rad}
            # Also update the target position
            target_position = MotorPosition(
                pitch_rad=pitch_rad,
                yaw_rad=yaw_rad,
                timestamp=datetime.now()
            )
            self._motor_state.target_position = target_position
            logger.debug(f"Manual target updated: pitch={pitch_rad}, yaw={yaw_rad}")
    
    # GPS state management
    
    async def get_gps_state(self) -> GPSState:
        """Get a copy of the current GPS state."""
        async with self._gps_lock:
            return GPSState(
                antenna_position=self._gps_state.antenna_position,
                rocket_position=self._gps_state.rocket_position
            )
    
    async def update_antenna_position(self, lat: float, lon: float, alt: float) -> None:
        """Update antenna GPS position."""
        async with self._gps_lock:
            self._gps_state.antenna_position = GPSPosition(lat=lat, lon=lon, alt=alt)
            logger.debug(f"Antenna position updated: {lat}, {lon}, {alt}")
    
    async def update_rocket_position(self, lat: float, lon: float, alt: float) -> None:
        """Update rocket GPS position."""
        async with self._gps_lock:
            self._gps_state.rocket_position = GPSPosition(lat=lat, lon=lon, alt=alt)
            logger.debug(f"Rocket position updated: {lat}, {lon}, {alt}")
    
    # Error state management
    
    async def get_error_state(self) -> ErrorState:
        """Get a copy of the current error state."""
        async with self._error_lock:
            return ErrorState(
                errors=self._error_state.errors.copy(),
                history=self._error_state.history.copy()
            )
    
    async def add_error(self, error: str) -> None:
        """Add an error to the error state."""
        async with self._error_lock:
            if error not in self._error_state.errors:
                self._error_state.errors.append(error)
                self._error_state.history.append((error, datetime.now()))
                logger.error(f"Error added: {error}")
    
    async def remove_error(self, error: str) -> bool:
        """Remove a specific error from the error state."""
        async with self._error_lock:
            if error in self._error_state.errors:
                self._error_state.errors.remove(error)
                logger.info(f"Error removed: {error}")
                return True
            return False
    
    async def clear_errors(self) -> None:
        """Clear all errors from the error state."""
        async with self._error_lock:
            if self._error_state.errors:
                self._error_state.errors.clear()
                logger.info("All errors cleared")
    
    async def has_errors(self) -> bool:
        """Check if there are any current errors."""
        async with self._error_lock:
            return len(self._error_state.errors) > 0
    
    # Convenience methods for backward compatibility (simplified)
    
    async def get_current_position_dict(self) -> Dict[str, float]:
        """Get current position as dictionary."""
        motor_state = await self.get_motor_state()
        if motor_state.current_position:
            return {
                "pitch": motor_state.current_position.pitch_rad,
                "yaw": motor_state.current_position.yaw_rad
            }
        return {"pitch": 0.0, "yaw": 0.0}
    
    async def get_antenna_position_dict(self) -> Dict[str, float]:
        """Get antenna position as dictionary."""
        gps_state = await self.get_gps_state()
        if gps_state.antenna_position:
            return {
                "lat": gps_state.antenna_position.lat,
                "lon": gps_state.antenna_position.lon,
                "alt": gps_state.antenna_position.alt
            }
        return {"lat": 0.0, "lon": 0.0, "alt": 0.0}
    
    async def get_rocket_position_dict(self) -> Dict[str, float]:
        """Get rocket position as dictionary."""
        gps_state = await self.get_gps_state()
        if gps_state.rocket_position:
            return {
                "lat": gps_state.rocket_position.lat,
                "lon": gps_state.rocket_position.lon,
                "alt": gps_state.rocket_position.alt
            }
        return {"lat": 0.0, "lon": 0.0, "alt": 0.0}
    
    async def get_state_snapshot(self) -> Dict[str, Any]:
        """Get a complete snapshot of all state."""
        motor_state = await self.get_motor_state()
        gps_state = await self.get_gps_state()
        error_state = await self.get_error_state()
        
        return {
            "motor": motor_state.to_dict(),
            "gps": gps_state.to_dict(),
            "errors": error_state.to_dict()
        }