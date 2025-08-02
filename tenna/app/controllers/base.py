"""Simplified motor controller interface."""

import asyncio
import logging
from abc import ABC, abstractmethod
from datetime import datetime
from typing import List, Optional, Tuple

from app.core.exceptions import MotorControlError, HardwareError, CommunicationError
from app.models.motor import (
    AxisConfig, ControllerMode, ControllerStatus, DualAxisConfig,
    MotorCommand, MotorPosition, MotorState
)
from app.utils.result import Result


logger = logging.getLogger(__name__)


class MotorController(ABC):
    """Simplified motor controller interface.
    
    This interface combines the functionality of AbstractMotorController and BaseMotorController
    into a single, simplified interface that uses consistent Result-based error handling.
    """
    
    def __init__(self, controller_id: str, mode: ControllerMode, 
                 axis_config: Optional[DualAxisConfig] = None):
        """Initialize the controller.
        
        Args:
            controller_id: Unique identifier for this controller
            mode: Operating mode (simulation, hardware, etc.)
            axis_config: Configuration for dual-axis setup
        """
        self.controller_id = controller_id
        self.mode = mode
        self.axis_config = axis_config or DualAxisConfig()
        self._is_initialized = False
        self._is_connected = False
        self._is_calibrated = False
        self._current_position = MotorPosition(0.0, 0.0, datetime.now())
        self._target_position: Optional[MotorPosition] = None
        self._errors: List[str] = []
        self._state = MotorState.DISCONNECTED
        self._lock = asyncio.Lock()
        self._max_position_error = 0.1  # radians
        self._command_timeout = 5.0  # seconds
    
    @abstractmethod
    async def initialize(self) -> Result[None]:
        """Initialize the motor controller.
        
        Returns:
            Result indicating success or failure with error message
        """
        pass
    
    @abstractmethod
    async def set_position(self, pitch_rad: float, yaw_rad: float) -> Result[None]:
        """Set target motor position.
        
        Args:
            pitch_rad: Target pitch position in radians
            yaw_rad: Target yaw position in radians
            
        Returns:
            Result indicating success or failure with error message
        """
        pass
    
    @abstractmethod
    async def get_position(self) -> Result[Tuple[float, float]]:
        """Get current motor position.
        
        Returns:
            Result containing tuple of (pitch_rad, yaw_rad) or error message
        """
        pass
    
    @abstractmethod
    async def shutdown(self) -> Result[None]:
        """Shutdown the controller gracefully.
        
        Returns:
            Result indicating success or failure with error message
        """
        pass
    
    # Common implementation methods
    
    async def get_status(self) -> Result[ControllerStatus]:
        """Get comprehensive controller status.
        
        Returns:
            Result containing ControllerStatus object or error message
        """
        try:
            async with self._lock:
                status = ControllerStatus(
                    is_connected=self._is_connected,
                    is_calibrated=self._is_calibrated,
                    current_position=self._current_position,
                    target_position=self._target_position,
                    errors=self._errors.copy(),
                    mode=self.mode,
                    state=self._state
                )
                return Result.ok(status)
        except Exception as e:
            return Result.err(f"Failed to get controller status: {str(e)}")
    
    async def send_command(self, command: MotorCommand) -> Result[None]:
        """Send a motor command.
        
        Args:
            command: MotorCommand to execute
            
        Returns:
            Result indicating success or failure with error message
        """
        return await self.set_position(command.target_pitch_rad, command.target_yaw_rad)
    
    async def is_ready(self) -> bool:
        """Check if controller is ready for commands.
        
        Returns:
            True if ready, False otherwise
        """
        async with self._lock:
            return (self._is_initialized and 
                   self._is_connected and 
                   self._state not in [MotorState.ERROR, MotorState.DISCONNECTED])
    
    async def wait_for_position(self, target_pitch_rad: float, target_yaw_rad: float, 
                              timeout: float = 10.0) -> Result[None]:
        """Wait for motor to reach target position.
        
        Args:
            target_pitch_rad: Target pitch position in radians
            target_yaw_rad: Target yaw position in radians
            timeout: Maximum time to wait in seconds
            
        Returns:
            Result indicating success or failure (timeout/error)
        """
        start_time = asyncio.get_event_loop().time()
        
        while (asyncio.get_event_loop().time() - start_time) < timeout:
            position_result = await self.get_position()
            if position_result.is_err():
                logger.warning(f"Error checking position: {position_result.error}")
                await asyncio.sleep(0.1)
                continue
                
            current_pitch, current_yaw = position_result.unwrap()
            pitch_error = abs(current_pitch - target_pitch_rad)
            yaw_error = abs(current_yaw - target_yaw_rad)
            
            if pitch_error < self._max_position_error and yaw_error < self._max_position_error:
                return Result.ok(None)
                
            await asyncio.sleep(0.1)
        
        return Result.err(f"Timeout waiting for position after {timeout} seconds")
    
    def add_error(self, error_message: str) -> None:
        """Add an error to the error list.
        
        Args:
            error_message: Description of the error
        """
        logger.error(f"Controller {self.controller_id}: {error_message}")
        if error_message not in self._errors:
            self._errors.append(error_message)
        self._state = MotorState.ERROR
    
    def clear_errors(self) -> None:
        """Clear all errors."""
        self._errors.clear()
        if self._is_connected:
            self._state = MotorState.IDLE
    
    def _update_position(self, pitch_rad: float, yaw_rad: float) -> None:
        """Update internal position tracking.
        
        Args:
            pitch_rad: Current pitch position in radians
            yaw_rad: Current yaw position in radians
        """
        self._current_position = MotorPosition(pitch_rad, yaw_rad, datetime.now())
    
    def _set_target_position(self, pitch_rad: float, yaw_rad: float) -> None:
        """Set internal target position tracking.
        
        Args:
            pitch_rad: Target pitch position in radians
            yaw_rad: Target yaw position in radians
        """
        self._target_position = MotorPosition(pitch_rad, yaw_rad, datetime.now())
    
    def _validate_position(self, pitch_rad: float, yaw_rad: float) -> Result[None]:
        """Validate position values are within acceptable ranges.
        
        Args:
            pitch_rad: Pitch position in radians
            yaw_rad: Yaw position in radians
            
        Returns:
            Result indicating if validation passed or failed with error message
        """
        # Basic validation - can be overridden by subclasses
        if not (-3.14159 <= pitch_rad <= 3.14159):
            return Result.err(f"Pitch position {pitch_rad} out of range [-π, π]")
        
        # Yaw can be unbounded for continuous rotation
        if abs(yaw_rad) > 100:  # Reasonable sanity check
            return Result.err(f"Yaw position {yaw_rad} seems unreasonable")
            
        return Result.ok(None)