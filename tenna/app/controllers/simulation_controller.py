"""PyBullet-based motor simulation controller."""

import asyncio
import logging
import math
import os
from datetime import datetime
from typing import Optional, Tuple

import pybullet as p
import pybullet_data

from app.controllers.base import BaseMotorController
from app.core.config import SimulationConfig
from app.core.exceptions import MotorControlError, CommunicationError
from app.models.motor import ControllerMode, ControllerStatus, DualAxisConfig, MotorState
from app.utils.helpers import calculate_unbounded_target


logger = logging.getLogger(__name__)


class SimulationController(BaseMotorController):
    """PyBullet-based motor simulation controller."""
    
    def __init__(self, controller_id: str = "simulation", 
                 axis_config: Optional[DualAxisConfig] = None,
                 simulation_config: Optional[SimulationConfig] = None,
                 urdf_path: str = "static/turret.urdf"):
        """Initialize simulation controller.
        
        Args:
            controller_id: Unique identifier for this controller
            axis_config: Configuration for dual-axis setup
            simulation_config: Physics simulation parameters
            urdf_path: Path to URDF file for turret model
        """
        super().__init__(controller_id, ControllerMode.SIMULATION, axis_config)
        
        # Simulation configuration
        self.simulation_config = simulation_config or SimulationConfig()
        self.urdf_path = urdf_path
        
        # PyBullet state
        self._physics_client = None
        self._turret_id = None
        self._plane_id = None
        self._joint_indices = {}
        self._simulation_running = False
        self._simulation_task = None
        
        # Physics parameters
        self._max_torque = self.simulation_config.max_torque
        self._max_velocity = self.simulation_config.max_velocity
        self._physics_timestep = self.simulation_config.physics_timestep
        
        logger.info(f"Initialized simulation controller {controller_id}")
    
    async def initialize(self) -> bool:
        """Initialize the PyBullet simulation environment.
        
        Returns:
            True if initialization successful, False otherwise
            
        Raises:
            MotorControlError: If initialization fails critically
        """
        try:
            async with self._lock:
                if self._is_initialized:
                    logger.warning("Simulation controller already initialized")
                    return True
                
                # Connect to PyBullet
                self._physics_client = p.connect(p.DIRECT)
                if self._physics_client < 0:
                    raise MotorControlError("Failed to connect to PyBullet physics engine")
                
                # Set up physics environment
                p.setAdditionalSearchPath(pybullet_data.getDataPath())
                p.setGravity(0, 0, -9.8)
                p.setTimeStep(self._physics_timestep)
                
                # Load ground plane
                self._plane_id = p.loadURDF("plane.urdf")
                
                # Load turret URDF
                if not os.path.exists(self.urdf_path):
                    raise MotorControlError(f"URDF file not found: {self.urdf_path}")
                
                self._turret_id = p.loadURDF(self.urdf_path, [0, 0, 0])
                if self._turret_id < 0:
                    raise MotorControlError(f"Failed to load URDF: {self.urdf_path}")
                
                # Map joint names to indices
                self._joint_indices = {}
                num_joints = p.getNumJoints(self._turret_id)
                for i in range(num_joints):
                    joint_info = p.getJointInfo(self._turret_id, i)
                    joint_name = joint_info[1].decode('UTF-8')
                    self._joint_indices[joint_name] = i
                
                # Verify required joints exist
                required_joints = ['yaw_joint', 'pitch_joint']
                for joint_name in required_joints:
                    if joint_name not in self._joint_indices:
                        raise MotorControlError(f"Required joint '{joint_name}' not found in URDF")
                
                # Initialize joint positions
                yaw_index = self._joint_indices['yaw_joint']
                pitch_index = self._joint_indices['pitch_joint']
                
                # Set initial positions to zero
                p.resetJointState(self._turret_id, yaw_index, 0.0)
                p.resetJointState(self._turret_id, pitch_index, 0.0)
                
                # Update internal state
                self._is_initialized = True
                self._is_connected = True
                self._is_calibrated = True  # Simulation doesn't need calibration
                self._state = MotorState.IDLE
                self._update_position(0.0, 0.0)
                
                # Start simulation loop
                await self._start_simulation_loop()
                
                logger.info("Simulation controller initialized successfully")
                return True
                
        except Exception as e:
            error_msg = f"Failed to initialize simulation controller: {e}"
            self.add_error(error_msg)
            raise MotorControlError(error_msg) from e
    
    async def set_position(self, pitch_rad: float, yaw_rad: float) -> bool:
        """Set target motor position.
        
        Args:
            pitch_rad: Target pitch position in radians
            yaw_rad: Target yaw position in radians
            
        Returns:
            True if command accepted, False otherwise
            
        Raises:
            MotorControlError: If command fails
        """
        try:
            # Check readiness without lock to avoid deadlock
            if not self._is_initialized or not self._is_connected:
                raise MotorControlError("Controller not ready for commands")
            
            # Validate position limits
            self._validate_position(pitch_rad, yaw_rad)
            
            # Get current yaw position for unbounded calculation
            current_yaw = p.getJointState(self._turret_id, self._joint_indices['yaw_joint'])[0]
            unbounded_yaw_target = calculate_unbounded_target(current_yaw, yaw_rad)
            
            # Set motor control commands
            p.setJointMotorControl2(
                bodyUniqueId=self._turret_id,
                jointIndex=self._joint_indices['yaw_joint'],
                controlMode=p.POSITION_CONTROL,
                targetPosition=unbounded_yaw_target,
                force=self._max_torque,
                maxVelocity=self._max_velocity
            )
            
            p.setJointMotorControl2(
                bodyUniqueId=self._turret_id,
                jointIndex=self._joint_indices['pitch_joint'],
                controlMode=p.POSITION_CONTROL,
                targetPosition=pitch_rad,
                force=self._max_torque,
                maxVelocity=self._max_velocity
            )
            
            # Update target position and state
            async with self._lock:
                self._set_target_position(pitch_rad, yaw_rad)
                self._state = MotorState.MOVING
            
            logger.debug(f"Set position command: pitch={math.degrees(pitch_rad):.2f}°, "
                       f"yaw={math.degrees(yaw_rad):.2f}°")
            return True
                
        except Exception as e:
            error_msg = f"Failed to set position: {e}"
            self.add_error(error_msg)
            raise MotorControlError(error_msg) from e
    
    async def get_position(self) -> Tuple[float, float]:
        """Get current motor position.
        
        Returns:
            Tuple of (pitch_rad, yaw_rad) current positions
            
        Raises:
            CommunicationError: If unable to read position
        """
        try:
            if not self._is_connected:
                raise CommunicationError("Simulation not connected")
            
            # Read joint states from PyBullet
            pitch_state = p.getJointState(self._turret_id, self._joint_indices['pitch_joint'])
            yaw_state = p.getJointState(self._turret_id, self._joint_indices['yaw_joint'])
            
            pitch_rad = pitch_state[0]
            yaw_rad = yaw_state[0]
            
            # Update internal position tracking
            self._update_position(pitch_rad, yaw_rad)
            
            return (pitch_rad, yaw_rad)
                
        except Exception as e:
            error_msg = f"Failed to read position: {e}"
            self.add_error(error_msg)
            raise CommunicationError(error_msg) from e
    
    async def get_status(self) -> ControllerStatus:
        """Get comprehensive controller status.
        
        Returns:
            ControllerStatus object with current state
            
        Raises:
            CommunicationError: If unable to read status
        """
        try:
            # Update current position
            if self._is_connected:
                await self.get_position()
            
            # Return status from base class
            return await super().get_status()
            
        except Exception as e:
            error_msg = f"Failed to get status: {e}"
            self.add_error(error_msg)
            raise CommunicationError(error_msg) from e
    
    async def shutdown(self) -> None:
        """Shutdown the simulation gracefully.
        
        Raises:
            MotorControlError: If shutdown fails
        """
        try:
            async with self._lock:
                logger.info("Shutting down simulation controller")
                
                # Stop simulation loop
                await self._stop_simulation_loop()
                
                # Disconnect from PyBullet
                if self._physics_client is not None:
                    p.disconnect(self._physics_client)
                    self._physics_client = None
                
                # Reset state
                self._is_initialized = False
                self._is_connected = False
                self._is_calibrated = False
                self._state = MotorState.DISCONNECTED
                self._turret_id = None
                self._plane_id = None
                self._joint_indices.clear()
                
                logger.info("Simulation controller shutdown complete")
                
        except Exception as e:
            error_msg = f"Failed to shutdown simulation: {e}"
            self.add_error(error_msg)
            raise MotorControlError(error_msg) from e
    
    async def _start_simulation_loop(self) -> None:
        """Start the physics simulation loop."""
        if self._simulation_running:
            return
        
        self._simulation_running = True
        self._simulation_task = asyncio.create_task(self._simulation_loop())
        logger.debug("Started simulation loop")
    
    async def _stop_simulation_loop(self) -> None:
        """Stop the physics simulation loop."""
        if not self._simulation_running:
            return
        
        self._simulation_running = False
        
        if self._simulation_task:
            self._simulation_task.cancel()
            try:
                await self._simulation_task
            except asyncio.CancelledError:
                pass
            self._simulation_task = None
        
        logger.debug("Stopped simulation loop")
    
    async def _simulation_loop(self) -> None:
        """Main physics simulation loop."""
        try:
            while self._simulation_running:
                # Step the physics simulation
                p.stepSimulation()
                
                # Check if we're close to target position (without async calls to avoid deadlock)
                if self._target_position and self._state == MotorState.MOVING:
                    try:
                        # Read positions directly without async wrapper
                        pitch_state = p.getJointState(self._turret_id, self._joint_indices['pitch_joint'])
                        yaw_state = p.getJointState(self._turret_id, self._joint_indices['yaw_joint'])
                        
                        current_pitch = pitch_state[0]
                        current_yaw = yaw_state[0]
                        
                        pitch_error = abs(current_pitch - self._target_position.pitch_rad)
                        yaw_error = abs(current_yaw - self._target_position.yaw_rad)
                        
                        # If close to target, switch to idle
                        if pitch_error < self._max_position_error and yaw_error < self._max_position_error:
                            async with self._lock:
                                self._state = MotorState.IDLE
                    except Exception as e:
                        logger.warning(f"Error checking position in simulation loop: {e}")
                
                # Sleep for physics timestep
                await asyncio.sleep(self._physics_timestep)
                
        except asyncio.CancelledError:
            logger.debug("Simulation loop cancelled")
            raise
        except Exception as e:
            error_msg = f"Simulation loop error: {e}"
            self.add_error(error_msg)
            logger.error(error_msg)
    
    def _validate_position(self, pitch_rad: float, yaw_rad: float) -> None:
        """Validate position values for simulation constraints.
        
        Args:
            pitch_rad: Pitch position in radians
            yaw_rad: Yaw position in radians
            
        Raises:
            ValueError: If positions are out of range
        """
        # Pitch is limited by URDF joint limits (0 to π/2)
        if not (0 <= pitch_rad <= math.pi/2):
            raise ValueError(f"Pitch position {pitch_rad} out of range [0, π/2]")
        
        # Yaw can be unbounded for continuous rotation
        if abs(yaw_rad) > 100:  # Reasonable sanity check
            raise ValueError(f"Yaw position {yaw_rad} seems unreasonable")
    
    def get_joint_info(self) -> dict:
        """Get information about simulation joints.
        
        Returns:
            Dictionary with joint information
        """
        if not self._is_connected:
            return {}
        
        joint_info = {}
        for name, index in self._joint_indices.items():
            info = p.getJointInfo(self._turret_id, index)
            joint_info[name] = {
                'index': index,
                'type': info[2],
                'lower_limit': info[8],
                'upper_limit': info[9],
                'max_force': info[10],
                'max_velocity': info[11]
            }
        
        return joint_info 