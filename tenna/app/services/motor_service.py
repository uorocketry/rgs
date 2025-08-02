"""Motor control service layer that orchestrates controller operations."""

import asyncio
import logging
from typing import Optional, Tuple, Dict, Any

from app.controllers.base import AbstractMotorController
from app.controllers.odrive_controller import ODriveController
from app.controllers.simulation_controller import SimulationController
from app.core.config import AppConfig
from app.core.exceptions import (
    ServiceError, HardwareError, ConfigurationError, 
    MotorControlError, CommunicationError
)
from app.models.motor import (
    ControllerMode, ControllerStatus, DualAxisConfig, 
    MotorCommand, MotorPosition
)


logger = logging.getLogger(__name__)


class MotorService:
    """Motor control service that orchestrates controller operations."""
    
    def __init__(self, config: AppConfig, axis_config: Optional[DualAxisConfig] = None):
        """Initialize motor service.
        
        Args:
            config: Application configuration
            axis_config: Motor axis configuration
        """
        self.config = config
        self.axis_config = axis_config or DualAxisConfig()
        
        # Controller management
        self._current_controller: Optional[AbstractMotorController] = None
        self._hardware_controller: Optional[ODriveController] = None
        self._simulation_controller: Optional[SimulationController] = None
        self._current_mode: ControllerMode = ControllerMode.OFFLINE
        self._desired_mode: ControllerMode = ControllerMode.SIMULATION
        
        # Service state
        self._is_initialized = False
        self._lock = asyncio.Lock()
        
        logger.info("Motor service initialized")
    
    async def initialize(self) -> bool:
        """Initialize the motor service with automatic hardware detection.
        
        Returns:
            True if initialization successful, False otherwise
            
        Raises:
            ServiceError: If initialization fails critically
        """
        try:
            async with self._lock:
                if self._is_initialized:
                    logger.warning("Motor service already initialized")
                    return True
                
                logger.info("Initializing motor service...")
                
                # Parse desired mode from configuration
                try:
                    self._desired_mode = ControllerMode(self.config.default_mode.lower())
                except ValueError:
                    logger.warning(f"Invalid default mode '{self.config.default_mode}', using simulation")
                    self._desired_mode = ControllerMode.SIMULATION
                
                # Initialize controllers based on desired mode and hardware availability
                success = await self._initialize_controllers()
                
                if success:
                    self._is_initialized = True
                    logger.info(f"Motor service initialized successfully in {self._current_mode.value} mode")
                    return True
                else:
                    raise ServiceError("Failed to initialize any motor controller")
                    
        except Exception as e:
            error_msg = f"Motor service initialization failed: {e}"
            logger.error(error_msg)
            raise ServiceError(error_msg) from e
    
    async def _initialize_controllers(self) -> bool:
        """Initialize controllers with automatic hardware detection and fallback.
        
        Returns:
            True if at least one controller was initialized successfully
        """
        # Always create simulation controller as fallback
        await self._create_simulation_controller()
        
        # Try to detect and initialize hardware if desired
        if self._desired_mode == ControllerMode.HARDWARE:
            hardware_available = await self._detect_and_initialize_hardware()
            
            if hardware_available:
                self._current_controller = self._hardware_controller
                self._current_mode = ControllerMode.HARDWARE
                logger.info("Using hardware controller (ODrive)")
                return True
            else:
                logger.warning("Hardware not available, falling back to simulation")
                self._current_controller = self._simulation_controller
                self._current_mode = ControllerMode.SIMULATION
                return True
        else:
            # Use simulation mode
            self._current_controller = self._simulation_controller
            self._current_mode = ControllerMode.SIMULATION
            logger.info("Using simulation controller")
            return True
    
    async def _detect_and_initialize_hardware(self) -> bool:
        """Detect and initialize ODrive hardware.
        
        Returns:
            True if hardware was successfully initialized
        """
        try:
            logger.info("Detecting ODrive hardware...")
            
            # Create ODrive controller
            self._hardware_controller = ODriveController(
                controller_id="odrive_hardware",
                axis_config=self.axis_config
            )
            
            # Try to detect hardware first (quick check)
            if hasattr(self._hardware_controller, 'detect_hardware'):
                hardware_detected = await self._hardware_controller.detect_hardware()
                if not hardware_detected:
                    logger.info("No ODrive hardware detected")
                    return False
            
            # Initialize the hardware controller
            success = await self._hardware_controller.initialize()
            
            if success:
                logger.info("ODrive hardware initialized successfully")
                return True
            else:
                logger.warning("ODrive hardware initialization failed")
                return False
                
        except HardwareError as e:
            logger.warning(f"Hardware initialization failed: {e}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error during hardware initialization: {e}")
            return False
    
    async def _create_simulation_controller(self) -> None:
        """Create and initialize simulation controller."""
        try:
            logger.info("Initializing simulation controller...")
            
            self._simulation_controller = SimulationController(
                controller_id="pybullet_simulation",
                axis_config=self.axis_config,
                simulation_config=self.config.simulation_config
            )
            
            success = await self._simulation_controller.initialize()
            
            if not success:
                raise ServiceError("Failed to initialize simulation controller")
                
            logger.info("Simulation controller initialized successfully")
            
        except Exception as e:
            error_msg = f"Failed to create simulation controller: {e}"
            logger.error(error_msg)
            raise ServiceError(error_msg) from e
    
    async def switch_mode(self, target_mode: ControllerMode) -> bool:
        """Switch between simulation and hardware modes.
        
        Args:
            target_mode: Target controller mode
            
        Returns:
            True if mode switch successful, False otherwise
            
        Raises:
            ServiceError: If mode switch fails
        """
        try:
            async with self._lock:
                if not self._is_initialized:
                    raise ServiceError("Motor service not initialized")
                
                if self._current_mode == target_mode:
                    logger.info(f"Already in {target_mode.value} mode")
                    return True
                
                logger.info(f"Switching from {self._current_mode.value} to {target_mode.value} mode")
                
                # Handle switch to hardware mode
                if target_mode == ControllerMode.HARDWARE:
                    if not self._hardware_controller:
                        # Try to initialize hardware
                        hardware_available = await self._detect_and_initialize_hardware()
                        if not hardware_available:
                            logger.warning("Hardware not available for mode switch")
                            return False
                    
                    # Check if hardware controller is ready
                    if not await self._hardware_controller.is_ready():
                        logger.warning("Hardware controller not ready")
                        return False
                    
                    self._current_controller = self._hardware_controller
                    self._current_mode = ControllerMode.HARDWARE
                    
                # Handle switch to simulation mode
                elif target_mode == ControllerMode.SIMULATION:
                    if not self._simulation_controller:
                        await self._create_simulation_controller()
                    
                    # Check if simulation controller is ready
                    if not await self._simulation_controller.is_ready():
                        logger.warning("Simulation controller not ready")
                        return False
                    
                    self._current_controller = self._simulation_controller
                    self._current_mode = ControllerMode.SIMULATION
                
                else:
                    raise ServiceError(f"Unsupported target mode: {target_mode}")
                
                logger.info(f"Successfully switched to {target_mode.value} mode")
                return True
                
        except Exception as e:
            error_msg = f"Mode switch failed: {e}"
            logger.error(error_msg)
            raise ServiceError(error_msg) from e
    
    async def send_position_command(self, command: MotorCommand) -> bool:
        """Send position command to current controller.
        
        Args:
            command: Motor position command
            
        Returns:
            True if command was accepted, False otherwise
            
        Raises:
            ServiceError: If service is not ready
            MotorControlError: If command fails
        """
        try:
            if not self._is_initialized or not self._current_controller:
                raise ServiceError("Motor service not initialized or no active controller")
            
            if not await self._current_controller.is_ready():
                raise ServiceError(f"Controller ({self._current_mode.value}) not ready for commands")
            
            logger.debug(f"Sending position command: {command.to_degrees()}")
            
            success = await self._current_controller.send_command(command)
            
            if success:
                logger.debug("Position command sent successfully")
            else:
                logger.warning("Position command was rejected by controller")
            
            return success
            
        except (ServiceError, MotorControlError):
            # Re-raise service and motor control errors as-is
            raise
        except Exception as e:
            error_msg = f"Failed to send position command: {e}"
            logger.error(error_msg)
            raise ServiceError(error_msg) from e
    
    async def get_current_position(self) -> Tuple[float, float]:
        """Get current motor position.
        
        Returns:
            Tuple of (pitch_rad, yaw_rad) current positions
            
        Raises:
            ServiceError: If service is not ready
            CommunicationError: If unable to read position
        """
        try:
            if not self._is_initialized or not self._current_controller:
                raise ServiceError("Motor service not initialized or no active controller")
            
            return await self._current_controller.get_position()
            
        except (ServiceError, CommunicationError):
            # Re-raise service and communication errors as-is
            raise
        except Exception as e:
            error_msg = f"Failed to get current position: {e}"
            logger.error(error_msg)
            raise ServiceError(error_msg) from e
    
    async def get_status(self) -> ControllerStatus:
        """Get comprehensive controller status.
        
        Returns:
            ControllerStatus object with current state
            
        Raises:
            ServiceError: If service is not ready
            CommunicationError: If unable to read status
        """
        try:
            if not self._is_initialized or not self._current_controller:
                raise ServiceError("Motor service not initialized or no active controller")
            
            return await self._current_controller.get_status()
            
        except (ServiceError, CommunicationError):
            # Re-raise service and communication errors as-is
            raise
        except Exception as e:
            error_msg = f"Failed to get status: {e}"
            logger.error(error_msg)
            raise ServiceError(error_msg) from e
    
    async def get_service_info(self) -> Dict[str, Any]:
        """Get service information and status.
        
        Returns:
            Dictionary with service information
        """
        try:
            info = {
                "is_initialized": self._is_initialized,
                "current_mode": self._current_mode.value if self._current_mode else None,
                "desired_mode": self._desired_mode.value if self._desired_mode else None,
                "hardware_available": self._hardware_controller is not None,
                "simulation_available": self._simulation_controller is not None,
                "active_controller": self._current_controller.controller_id if self._current_controller else None
            }
            
            # Add controller status if available
            if self._current_controller:
                try:
                    controller_status = await self._current_controller.get_status()
                    info["controller_status"] = controller_status.to_dict()
                except Exception as e:
                    info["controller_status_error"] = str(e)
            
            return info
            
        except Exception as e:
            logger.error(f"Failed to get service info: {e}")
            return {
                "error": str(e),
                "is_initialized": False
            }
    
    async def shutdown(self) -> None:
        """Shutdown the motor service gracefully.
        
        Raises:
            ServiceError: If shutdown fails
        """
        try:
            async with self._lock:
                logger.info("Shutting down motor service...")
                
                # Shutdown hardware controller
                if self._hardware_controller:
                    try:
                        await self._hardware_controller.shutdown()
                        logger.info("Hardware controller shutdown complete")
                    except Exception as e:
                        logger.warning(f"Error shutting down hardware controller: {e}")
                
                # Shutdown simulation controller
                if self._simulation_controller:
                    try:
                        await self._simulation_controller.shutdown()
                        logger.info("Simulation controller shutdown complete")
                    except Exception as e:
                        logger.warning(f"Error shutting down simulation controller: {e}")
                
                # Reset state
                self._current_controller = None
                self._hardware_controller = None
                self._simulation_controller = None
                self._current_mode = ControllerMode.OFFLINE
                self._is_initialized = False
                
                logger.info("Motor service shutdown complete")
                
        except Exception as e:
            error_msg = f"Error during motor service shutdown: {e}"
            logger.error(error_msg)
            raise ServiceError(error_msg) from e
    
    # Properties for external access
    
    @property
    def current_mode(self) -> ControllerMode:
        """Get current controller mode."""
        return self._current_mode
    
    @property
    def is_initialized(self) -> bool:
        """Check if service is initialized."""
        return self._is_initialized
    
    @property
    def is_hardware_available(self) -> bool:
        """Check if hardware controller is available."""
        return self._hardware_controller is not None
    
    @property
    def is_simulation_available(self) -> bool:
        """Check if simulation controller is available."""
        return self._simulation_controller is not None
    
    async def is_ready(self) -> bool:
        """Check if service is ready for commands.
        
        Returns:
            True if ready, False otherwise
        """
        if not self._is_initialized or not self._current_controller:
            return False
        
        try:
            return await self._current_controller.is_ready()
        except Exception:
            return False

# Motor service instances are now managed through dependency injection
# No global singleton pattern