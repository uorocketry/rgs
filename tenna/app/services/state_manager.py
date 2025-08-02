"""Simplified state management system using focused state containers."""

import logging
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

from app.services.state_containers import (
    SimpleStateManager, MotorState, GPSState, ErrorState, GPSPosition
)
from app.models.motor import ControllerMode, MotorPosition


logger = logging.getLogger(__name__)


class StateManager:
    """Simplified state manager using focused state containers."""
    
    def __init__(self):
        """Initialize the simplified state manager."""
        self._state_manager = SimpleStateManager()
        logger.info("StateManager initialized with simplified architecture")
    
    # Delegate methods to the simplified state manager
    
    # Mode management
    
    async def get_mode(self) -> ControllerMode:
        """Get current controller mode."""
        motor_state = await self._state_manager.get_motor_state()
        return motor_state.mode
    
    async def set_mode(self, mode: ControllerMode) -> None:
        """Set controller mode."""
        await self._state_manager.update_mode(mode)
    
    async def set_mode_from_string(self, mode: str) -> bool:
        """Set mode from string value.
        
        Args:
            mode: Mode string (simulation, hardware, offline)
            
        Returns:
            True if mode was set successfully, False otherwise
        """
        try:
            controller_mode = ControllerMode(mode.lower())
            await self.set_mode(controller_mode)
            return True
        except ValueError:
            logger.warning(f"Invalid mode: {mode}")
            return False
    
    # Position management
    
    async def get_current_position(self) -> Optional[MotorPosition]:
        """Get current motor position."""
        motor_state = await self._state_manager.get_motor_state()
        return motor_state.current_position
    
    async def set_current_position(self, position: Optional[MotorPosition]) -> None:
        """Set current motor position."""
        await self._state_manager.update_current_position(position)
    
    async def update_position(self, pitch_rad: float, yaw_rad: float) -> None:
        """Update current position from radians.
        
        Args:
            pitch_rad: Pitch position in radians
            yaw_rad: Yaw position in radians
        """
        from datetime import datetime
        position = MotorPosition(
            pitch_rad=pitch_rad,
            yaw_rad=yaw_rad,
            timestamp=datetime.now()
        )
        await self.set_current_position(position)
    
    async def get_current_position_dict(self) -> Dict[str, float]:
        """Get current position as dictionary (for backward compatibility).
        
        Returns:
            Dictionary with pitch and yaw in radians
        """
        return await self._state_manager.get_current_position_dict()
    
    # Target position management
    
    async def get_target_position(self) -> Optional[MotorPosition]:
        """Get target motor position."""
        motor_state = await self._state_manager.get_motor_state()
        return motor_state.target_position
    
    async def set_target_position(self, position: Optional[MotorPosition]) -> None:
        """Set target motor position."""
        await self._state_manager.update_target_position(position)
    
    async def set_target(self, pitch_rad: float, yaw_rad: float) -> None:
        """Set target position from radians.
        
        Args:
            pitch_rad: Target pitch position in radians
            yaw_rad: Target yaw position in radians
        """
        from datetime import datetime
        position = MotorPosition(
            pitch_rad=pitch_rad,
            yaw_rad=yaw_rad,
            timestamp=datetime.now()
        )
        await self.set_target_position(position)
    
    # Manual target management (for backward compatibility)
    
    async def get_manual_target_rad(self) -> Dict[str, float]:
        """Get manual target in radians (for backward compatibility)."""
        motor_state = await self._state_manager.get_motor_state()
        return motor_state.manual_target_rad.copy()
    
    async def set_manual_target_rad(self, target: Dict[str, float]) -> None:
        """Set manual target in radians."""
        pitch_rad = target.get("pitch", 0.0)
        yaw_rad = target.get("yaw", 0.0)
        await self._state_manager.update_manual_target(pitch_rad, yaw_rad)
    
    # GPS position management
    
    async def get_antenna_position_gps(self) -> Optional[GPSPosition]:
        """Get antenna GPS position."""
        gps_state = await self._state_manager.get_gps_state()
        return gps_state.antenna_position
    
    async def set_antenna_position_gps(self, lat: float, lon: float, alt: float) -> None:
        """Set antenna GPS position from coordinates.
        
        Args:
            lat: Latitude
            lon: Longitude
            alt: Altitude
        """
        await self._state_manager.update_antenna_position(lat, lon, alt)
    
    async def get_antenna_position_dict(self) -> Dict[str, float]:
        """Get antenna position as dictionary (for backward compatibility)."""
        return await self._state_manager.get_antenna_position_dict()
    
    async def get_rocket_position_gps(self) -> Optional[GPSPosition]:
        """Get rocket GPS position."""
        gps_state = await self._state_manager.get_gps_state()
        return gps_state.rocket_position
    
    async def set_rocket_position_gps(self, lat: float, lon: float, alt: float) -> None:
        """Set rocket GPS position from coordinates.
        
        Args:
            lat: Latitude
            lon: Longitude
            alt: Altitude
        """
        await self._state_manager.update_rocket_position(lat, lon, alt)
    
    async def get_rocket_position_dict(self) -> Dict[str, float]:
        """Get rocket position as dictionary (for backward compatibility)."""
        return await self._state_manager.get_rocket_position_dict()
    
    # Error management
    
    async def get_errors(self) -> List[str]:
        """Get current errors."""
        error_state = await self._state_manager.get_error_state()
        return error_state.errors
    
    async def add_error(self, error: str) -> None:
        """Add an error.
        
        Args:
            error: Error message to add
        """
        await self._state_manager.add_error(error)
    
    async def clear_errors(self) -> None:
        """Clear all errors."""
        await self._state_manager.clear_errors()
    
    async def remove_error(self, error: str) -> bool:
        """Remove a specific error.
        
        Args:
            error: Error message to remove
            
        Returns:
            True if error was removed, False if not found
        """
        return await self._state_manager.remove_error(error)
    
    async def has_errors(self) -> bool:
        """Check if there are any current errors."""
        return await self._state_manager.has_errors()
    
    async def get_error_history(self) -> List[Tuple[str, Any]]:
        """Get error history."""
        error_state = await self._state_manager.get_error_state()
        return error_state.history
    
    # Simplified logging (removed complex log management)
    
    # State introspection and debugging
    
    async def get_state_snapshot(self) -> Dict[str, Any]:
        """Get a complete snapshot of current state.
        
        Returns:
            Dictionary containing all state information
        """
        return await self._state_manager.get_state_snapshot()


# Global state manager instance (simplified)
state_manager = StateManager()

# Export GPSPosition for backward compatibility
__all__ = ['StateManager', 'state_manager', 'GPSPosition']