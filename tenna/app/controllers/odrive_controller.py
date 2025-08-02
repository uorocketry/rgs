"""ODrive motor controller implementation."""

import asyncio
import logging
import math
import time
from datetime import datetime
from typing import Optional, Tuple

try:
    import odrive
    from odrive.enums import AxisState, MotorType
    ODRIVE_AVAILABLE = True
except ImportError:
    ODRIVE_AVAILABLE = False
    # Mock classes for when ODrive is not available
    class AxisState:
        FULL_CALIBRATION_SEQUENCE = 3
        CLOSED_LOOP_CONTROL = 8
        IDLE = 1

from app.controllers.base import MotorController
from app.core.exceptions import HardwareError, CommunicationError, MotorControlError
from app.models.motor import (
    ControllerMode, ControllerStatus, DualAxisConfig, 
    MotorPosition, MotorState
)
from app.utils.helpers import calculate_unbounded_target
from app.utils.result import Result


logger = logging.getLogger(__name__)


class ODriveController(MotorController):
    """ODrive hardware motor controller implementation."""
    
    def __init__(self, controller_id: str = "odrive", 
                 axis_config: Optional[DualAxisConfig] = None):
        """Initialize ODrive controller.
        
        Args:
            controller_id: Unique identifier for this controller
            axis_config: Configuration for dual-axis setup
        """
        super().__init__(controller_id, ControllerMode.HARDWARE, axis_config)
        self._odrive_device: Optional[object] = None
        self._calibration_timeout = 30.0  # seconds
        self._connection_timeout = 10.0  # seconds
        self._position_update_interval = 0.1  # seconds
        self._last_position_update = 0.0
        self._max_position_error = 0.1  # radians
        self._command_timeout = 5.0  # seconds
        
        # Track unbounded positions for circular setpoints
        self._unbounded_yaw_position = 0.0
        self._unbounded_pitch_position = 0.0
        
        if not ODRIVE_AVAILABLE:
            self.add_error("ODrive library not available - install with 'pip install odrive'")
    
    async def initialize(self) -> Result[None]:
        """Initialize the ODrive controller.
        
        Returns:
            Result indicating success or failure with error message
        """
        if not ODRIVE_AVAILABLE:
            return Result.err("ODrive library not available - install with 'pip install odrive'")
        
        try:
            async with self._lock:
                self._is_initialized = False
                self._is_connected = False
                self._is_calibrated = False
                self.clear_errors()
                
                logger.info("Searching for ODrive hardware...")
                
                # Find ODrive device with timeout
                loop = asyncio.get_event_loop()
                try:
                    self._odrive_device = await asyncio.wait_for(
                        loop.run_in_executor(None, odrive.find_any),
                        timeout=self._connection_timeout
                    )
                except asyncio.TimeoutError:
                    return Result.err(f"ODrive hardware not found within {self._connection_timeout}s timeout")
                
                if self._odrive_device is None:
                    return Result.err("No ODrive hardware detected")
                
                # Verify device is responsive
                try:
                    serial_number = self._odrive_device.serial_number
                    logger.info(f"Connected to ODrive hardware (Serial: {serial_number})")
                except Exception as e:
                    return Result.err(f"ODrive hardware not responsive: {e}")
                
                # Clear any existing errors on the device
                try:
                    self._odrive_device.clear_errors()
                except Exception as e:
                    logger.warning(f"Could not clear ODrive errors: {e}")
                
                self._is_connected = True
                self._state = MotorState.IDLE
                
                # Configure motors with enhanced error handling
                config_result = await self._configure_motors()
                if config_result.is_err():
                    return config_result
                
                # Perform calibration with enhanced error handling
                calibration_result = await self._calibrate_motors()
                if calibration_result.is_err():
                    return calibration_result
                
                self._is_initialized = True
                self._is_calibrated = True
                
                logger.info("ODrive hardware initialization complete")
                return Result.ok(None)
                
        except Exception as e:
            error_msg = f"ODrive initialization failed: {e}"
            logger.error(error_msg)
            self.add_error(error_msg)
            return Result.err(error_msg)
    
    async def _configure_motors(self) -> Result[None]:
        """Configure motor parameters based on axis configuration."""
        if not self._odrive_device:
            return Result.err("ODrive device not connected")
        
        logger.info("Configuring ODrive motors...")
        
        # Configure yaw axis (typically axis0)
        yaw_config = self.axis_config.yaw_axis
        yaw_axis = getattr(self._odrive_device, f'axis{yaw_config.axis_index}')
        
        yaw_axis.motor.config.pole_pairs = yaw_config.pole_pairs
        yaw_axis.motor.config.torque_constant = yaw_config.torque_constant
        yaw_axis.motor.config.current_lim = yaw_config.current_limit
        yaw_axis.motor.config.calibration_current = yaw_config.calibration_current
        
        # Enable circular setpoints for continuous rotation
        if yaw_config.circular_setpoints:
            yaw_axis.controller.config.circular_setpoints = True
            yaw_axis.controller.config.circular_setpoint_range = 1.0  # 1 turn
        
        # Configure pitch axis if available (typically axis1)
        pitch_config = self.axis_config.pitch_axis
        if hasattr(self._odrive_device, f'axis{pitch_config.axis_index}'):
            pitch_axis = getattr(self._odrive_device, f'axis{pitch_config.axis_index}')
            
            pitch_axis.motor.config.pole_pairs = pitch_config.pole_pairs
            pitch_axis.motor.config.torque_constant = pitch_config.torque_constant
            pitch_axis.motor.config.current_lim = pitch_config.current_limit
            pitch_axis.motor.config.calibration_current = pitch_config.calibration_current
            
            # Pitch typically doesn't need circular setpoints
            if pitch_config.circular_setpoints:
                pitch_axis.controller.config.circular_setpoints = True
                pitch_axis.controller.config.circular_setpoint_range = 1.0
        
        logger.info("Motor configuration complete")
        return Result.ok(None)
    
    async def _calibrate_motors(self) -> Result[None]:
        """Perform motor calibration sequence."""
        if not self._odrive_device:
            return Result.err("ODrive device not connected")
        
        logger.info("Starting motor calibration...")
        self._state = MotorState.CALIBRATING
        
        try:
            # Start calibration for yaw axis
            yaw_axis = getattr(self._odrive_device, f'axis{self.axis_config.yaw_axis.axis_index}')
            yaw_axis.requested_state = AxisState.FULL_CALIBRATION_SEQUENCE
            
            # Start calibration for pitch axis if available
            pitch_axis = None
            if hasattr(self._odrive_device, f'axis{self.axis_config.pitch_axis.axis_index}'):
                pitch_axis = getattr(self._odrive_device, f'axis{self.axis_config.pitch_axis.axis_index}')
                pitch_axis.requested_state = AxisState.FULL_CALIBRATION_SEQUENCE
            
            # Wait for calibration to complete
            start_time = time.time()
            while time.time() - start_time < self._calibration_timeout:
                yaw_state = yaw_axis.current_state
                pitch_state = pitch_axis.current_state if pitch_axis else AxisState.IDLE
                
                if (yaw_state == AxisState.IDLE and 
                    (pitch_state == AxisState.IDLE or pitch_axis is None)):
                    break
                
                await asyncio.sleep(1.0)
            else:
                return Result.err(f"Calibration timeout after {self._calibration_timeout}s")
            
            # Enter closed loop control
            yaw_axis.requested_state = AxisState.CLOSED_LOOP_CONTROL
            if pitch_axis:
                pitch_axis.requested_state = AxisState.CLOSED_LOOP_CONTROL
            
            # Wait for closed loop control to be active
            await asyncio.sleep(1.0)
            
            self._state = MotorState.IDLE
            logger.info("Motor calibration complete")
            return Result.ok(None)
            
        except Exception as e:
            error_msg = f"Motor calibration failed: {e}"
            logger.error(error_msg)
            self.add_error(error_msg)
            return Result.err(error_msg)
    
    async def set_position(self, pitch_rad: float, yaw_rad: float) -> Result[None]:
        """Set target motor position.
        
        Args:
            pitch_rad: Target pitch position in radians
            yaw_rad: Target yaw position in radians
            
        Returns:
            Result indicating success or failure with error message
        """
        if not await self.is_ready():
            return Result.err("Controller not ready for commands")
        
        try:
            async with self._lock:
                validation_result = self._validate_position(pitch_rad, yaw_rad)
                if validation_result.is_err():
                    return validation_result
                
                # Convert radians to motor turns accounting for gear ratio
                yaw_config = self.axis_config.yaw_axis
                pitch_config = self.axis_config.pitch_axis
                
                # For circular setpoints, calculate unbounded target to minimize rotation
                if yaw_config.circular_setpoints:
                    current_yaw_turns = self._unbounded_yaw_position / (2 * math.pi)
                    target_yaw_turns = calculate_unbounded_target(
                        current_yaw_turns * 2 * math.pi, yaw_rad
                    ) / (2 * math.pi)
                    self._unbounded_yaw_position = target_yaw_turns * 2 * math.pi
                else:
                    target_yaw_turns = yaw_rad / (2 * math.pi)
                
                # Apply gear ratio
                yaw_motor_turns = target_yaw_turns * yaw_config.gear_ratio
                
                # Set yaw position
                yaw_axis = getattr(self._odrive_device, f'axis{yaw_config.axis_index}')
                yaw_axis.controller.input_pos = yaw_motor_turns
                
                # Set pitch position if axis is available
                if hasattr(self._odrive_device, f'axis{pitch_config.axis_index}'):
                    if pitch_config.circular_setpoints:
                        current_pitch_turns = self._unbounded_pitch_position / (2 * math.pi)
                        target_pitch_turns = calculate_unbounded_target(
                            current_pitch_turns * 2 * math.pi, pitch_rad
                        ) / (2 * math.pi)
                        self._unbounded_pitch_position = target_pitch_turns * 2 * math.pi
                    else:
                        target_pitch_turns = pitch_rad / (2 * math.pi)
                    
                    pitch_motor_turns = target_pitch_turns * pitch_config.gear_ratio
                    pitch_axis = getattr(self._odrive_device, f'axis{pitch_config.axis_index}')
                    pitch_axis.controller.input_pos = pitch_motor_turns
                
                # Update target position tracking
                self._set_target_position(pitch_rad, yaw_rad)
                self._state = MotorState.MOVING
                
                logger.debug(f"Position command sent: pitch={math.degrees(pitch_rad):.2f}°, "
                           f"yaw={math.degrees(yaw_rad):.2f}°")
                
                return Result.ok(None)
                
        except Exception as e:
            error_msg = f"Failed to set position: {e}"
            logger.error(error_msg)
            self.add_error(error_msg)
            return Result.err(error_msg)
    
    async def get_position(self) -> Result[Tuple[float, float]]:
        """Get current motor position.
        
        Returns:
            Result containing tuple of (pitch_rad, yaw_rad) or error message
        """
        if not self._is_connected:
            return Result.err("ODrive not connected")
        
        try:
            # Update position if enough time has passed
            current_time = time.time()
            if current_time - self._last_position_update > self._position_update_interval:
                await self._update_current_position()
                self._last_position_update = current_time
            
            return Result.ok((self._current_position.pitch_rad, self._current_position.yaw_rad))
            
        except Exception as e:
            error_msg = f"Failed to read position: {e}"
            logger.error(error_msg)
            return Result.err(error_msg)
    
    async def _update_current_position(self) -> None:
        """Update current position from ODrive encoders."""
        if not self._odrive_device:
            return
        
        try:
            # Read yaw position
            yaw_config = self.axis_config.yaw_axis
            yaw_axis = getattr(self._odrive_device, f'axis{yaw_config.axis_index}')
            yaw_motor_turns = yaw_axis.encoder.pos_estimate
            yaw_output_turns = yaw_motor_turns / yaw_config.gear_ratio
            yaw_rad = yaw_output_turns * 2 * math.pi
            
            # Read pitch position
            pitch_rad = 0.0
            pitch_config = self.axis_config.pitch_axis
            if hasattr(self._odrive_device, f'axis{pitch_config.axis_index}'):
                pitch_axis = getattr(self._odrive_device, f'axis{pitch_config.axis_index}')
                pitch_motor_turns = pitch_axis.encoder.pos_estimate
                pitch_output_turns = pitch_motor_turns / pitch_config.gear_ratio
                pitch_rad = pitch_output_turns * 2 * math.pi
            
            # Update internal position tracking
            self._update_position(pitch_rad, yaw_rad)
            
            # Update unbounded positions for circular setpoint tracking
            self._unbounded_yaw_position = yaw_rad
            self._unbounded_pitch_position = pitch_rad
            
        except Exception as e:
            logger.warning(f"Failed to update position: {e}")
    
    async def get_status(self) -> Result[ControllerStatus]:
        """Get comprehensive controller status.
        
        Returns:
            Result containing ControllerStatus object or error message
        """
        try:
            # Update position before returning status
            if self._is_connected:
                await self._update_current_position()
            
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
            error_msg = f"Failed to get status: {e}"
            logger.error(error_msg)
            return Result.err(error_msg)
    
    async def shutdown(self) -> Result[None]:
        """Shutdown the controller gracefully.
        
        Returns:
            Result indicating success or failure with error message
        """
        logger.info("Shutting down ODrive controller...")
        
        try:
            async with self._lock:
                if self._odrive_device and self._is_connected:
                    # Set motors to idle state
                    try:
                        yaw_axis = getattr(self._odrive_device, f'axis{self.axis_config.yaw_axis.axis_index}')
                        yaw_axis.requested_state = AxisState.IDLE
                        
                        if hasattr(self._odrive_device, f'axis{self.axis_config.pitch_axis.axis_index}'):
                            pitch_axis = getattr(self._odrive_device, f'axis{self.axis_config.pitch_axis.axis_index}')
                            pitch_axis.requested_state = AxisState.IDLE
                        
                        await asyncio.sleep(1.0)  # Allow time for state change
                        
                    except Exception as e:
                        logger.warning(f"Error setting motors to idle: {e}")
                
                self._odrive_device = None
                self._is_connected = False
                self._is_initialized = False
                self._is_calibrated = False
                self._state = MotorState.DISCONNECTED
                
                logger.info("ODrive controller shutdown complete")
                return Result.ok(None)
                
        except Exception as e:
            error_msg = f"Error during shutdown: {e}"
            logger.error(error_msg)
            return Result.err(error_msg)
    
    def _validate_position(self, pitch_rad: float, yaw_rad: float) -> Result[None]:
        """Validate position values for ODrive constraints.
        
        Args:
            pitch_rad: Pitch position in radians
            yaw_rad: Yaw position in radians
            
        Returns:
            Result indicating if validation passed or failed with error message
        """
        # Basic validation
        if not (-3.14159 <= pitch_rad <= 3.14159):
            return Result.err(f"Pitch position {pitch_rad} out of range [-π, π]")
        
        # Yaw can be unbounded for continuous rotation
        if abs(yaw_rad) > 100:  # Reasonable sanity check
            return Result.err(f"Yaw position {yaw_rad} seems unreasonable")
        
        # Additional ODrive-specific validation
        # Pitch is typically limited to prevent mechanical damage
        if not (-math.pi/2 <= pitch_rad <= math.pi/2):
            return Result.err(f"Pitch position {math.degrees(pitch_rad):.2f}° out of safe range [-90°, 90°]")
            
        return Result.ok(None)
    
    async def detect_hardware(self) -> bool:
        """Detect if ODrive hardware is available.
        
        Returns:
            True if ODrive hardware is detected, False otherwise
        """
        if not ODRIVE_AVAILABLE:
            return False
        
        try:
            # Quick detection without full initialization
            loop = asyncio.get_event_loop()
            device = await asyncio.wait_for(
                loop.run_in_executor(None, odrive.find_any),
                timeout=5.0  # Shorter timeout for detection
            )
            return device is not None
        except (asyncio.TimeoutError, Exception):
            return False
    
    # ODrive-specific methods 