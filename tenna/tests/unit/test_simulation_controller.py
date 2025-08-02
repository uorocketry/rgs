"""Unit tests for simulation controller."""

import asyncio
import math
import os
import pytest
from unittest.mock import Mock, patch, MagicMock

from app.controllers.simulation_controller import SimulationController
from app.core.config import SimulationConfig
from app.core.exceptions import MotorControlError, CommunicationError
from app.models.motor import ControllerMode, DualAxisConfig, MotorState


class TestSimulationController:
    """Test cases for SimulationController."""
    
    @pytest.fixture
    def simulation_config(self):
        """Create test simulation configuration."""
        return SimulationConfig(
            max_torque=5.76,
            max_velocity=603.19,
            physics_timestep=1.0/240.0
        )
    
    @pytest.fixture
    def axis_config(self):
        """Create test axis configuration."""
        return DualAxisConfig()
    
    @pytest.fixture
    def controller(self, axis_config, simulation_config):
        """Create test simulation controller."""
        return SimulationController(
            controller_id="test_sim",
            axis_config=axis_config,
            simulation_config=simulation_config,
            urdf_path="static/turret.urdf"
        )
    
    def test_init(self, controller, simulation_config):
        """Test controller initialization."""
        assert controller.controller_id == "test_sim"
        assert controller.mode == ControllerMode.SIMULATION
        assert controller.simulation_config == simulation_config
        assert controller.urdf_path == "static/turret.urdf"
        assert not controller._is_initialized
        assert not controller._is_connected
        assert controller._state == MotorState.DISCONNECTED
    
    @patch('pybullet.connect')
    @patch('pybullet.setAdditionalSearchPath')
    @patch('pybullet.setGravity')
    @patch('pybullet.setTimeStep')
    @patch('pybullet.loadURDF')
    @patch('pybullet.getNumJoints')
    @patch('pybullet.getJointInfo')
    @patch('pybullet.resetJointState')
    @patch('os.path.exists')
    async def test_initialize_success(self, mock_exists, mock_reset_joint, mock_joint_info,
                                    mock_num_joints, mock_load_urdf, mock_timestep,
                                    mock_gravity, mock_search_path, mock_connect, controller):
        """Test successful initialization."""
        # Mock PyBullet calls
        mock_connect.return_value = 1
        mock_exists.return_value = True
        mock_load_urdf.side_effect = [0, 1]  # plane_id, turret_id
        mock_num_joints.return_value = 2
        mock_joint_info.side_effect = [
            (0, b'yaw_joint', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, b'', (0, 0, 0), (0, 0, 0), (0, 0, 0), 0),
            (1, b'pitch_joint', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, b'', (0, 0, 0), (0, 0, 0), (0, 0, 0), 0)
        ]
        
        # Mock simulation loop
        with patch.object(controller, '_start_simulation_loop') as mock_start_loop:
            result = await controller.initialize()
        
        assert result is True
        assert controller._is_initialized
        assert controller._is_connected
        assert controller._is_calibrated
        assert controller._state == MotorState.IDLE
        assert controller._physics_client == 1
        assert controller._turret_id == 1
        assert 'yaw_joint' in controller._joint_indices
        assert 'pitch_joint' in controller._joint_indices
        mock_start_loop.assert_called_once()
    
    @patch('pybullet.connect')
    async def test_initialize_connection_failure(self, mock_connect, controller):
        """Test initialization failure due to connection error."""
        mock_connect.return_value = -1
        
        with pytest.raises(MotorControlError, match="Failed to connect to PyBullet"):
            await controller.initialize()
        
        assert not controller._is_initialized
        assert not controller._is_connected
    
    @patch('pybullet.connect')
    @patch('pybullet.setAdditionalSearchPath')
    @patch('pybullet.setGravity')
    @patch('pybullet.setTimeStep')
    @patch('pybullet.loadURDF')
    @patch('os.path.exists')
    async def test_initialize_urdf_not_found(self, mock_exists, mock_load_urdf, mock_timestep,
                                           mock_gravity, mock_search_path, mock_connect, controller):
        """Test initialization failure due to missing URDF."""
        mock_connect.return_value = 1
        mock_load_urdf.return_value = 0  # plane_id
        mock_exists.return_value = False
        
        with pytest.raises(MotorControlError, match="URDF file not found"):
            await controller.initialize()
    
    @patch('pybullet.connect')
    @patch('pybullet.setAdditionalSearchPath')
    @patch('pybullet.setGravity')
    @patch('pybullet.setTimeStep')
    @patch('pybullet.loadURDF')
    @patch('pybullet.getNumJoints')
    @patch('pybullet.getJointInfo')
    @patch('os.path.exists')
    async def test_initialize_missing_joint(self, mock_exists, mock_joint_info, mock_num_joints,
                                          mock_load_urdf, mock_timestep, mock_gravity,
                                          mock_search_path, mock_connect, controller):
        """Test initialization failure due to missing required joint."""
        mock_connect.return_value = 1
        mock_exists.return_value = True
        mock_load_urdf.side_effect = [0, 1]
        mock_num_joints.return_value = 1
        mock_joint_info.return_value = (0, b'wrong_joint', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, b'', (0, 0, 0), (0, 0, 0), (0, 0, 0), 0)
        
        with pytest.raises(MotorControlError, match="Required joint 'yaw_joint' not found"):
            await controller.initialize()
    
    async def test_set_position_not_ready(self, controller):
        """Test set_position when controller not ready."""
        with pytest.raises(MotorControlError, match="Controller not ready"):
            await controller.set_position(0.5, 1.0)
    
    @patch('pybullet.getJointState')
    @patch('pybullet.setJointMotorControl2')
    async def test_set_position_success(self, mock_motor_control, mock_joint_state, controller):
        """Test successful position setting."""
        # Set up controller as initialized
        controller._is_initialized = True
        controller._is_connected = True
        controller._state = MotorState.IDLE
        controller._joint_indices = {'yaw_joint': 0, 'pitch_joint': 1}
        controller._turret_id = 1
        
        # Mock current yaw position
        mock_joint_state.return_value = (0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
        
        result = await controller.set_position(0.5, 1.0)
        
        assert result is True
        assert controller._state == MotorState.MOVING
        assert controller._target_position is not None
        assert controller._target_position.pitch_rad == 0.5
        assert controller._target_position.yaw_rad == 1.0
        
        # Verify motor control calls
        assert mock_motor_control.call_count == 2
    
    async def test_set_position_invalid_pitch(self, controller):
        """Test set_position with invalid pitch value."""
        controller._is_initialized = True
        controller._is_connected = True
        controller._state = MotorState.IDLE
        
        with pytest.raises(MotorControlError, match="Pitch position .* out of range"):
            await controller.set_position(-0.5, 1.0)  # Negative pitch
    
    async def test_set_position_invalid_yaw(self, controller):
        """Test set_position with invalid yaw value."""
        controller._is_initialized = True
        controller._is_connected = True
        controller._state = MotorState.IDLE
        
        with pytest.raises(MotorControlError, match="Yaw position .* seems unreasonable"):
            await controller.set_position(0.5, 200.0)  # Excessive yaw
    
    async def test_get_position_not_connected(self, controller):
        """Test get_position when not connected."""
        with pytest.raises(CommunicationError, match="Simulation not connected"):
            await controller.get_position()
    
    @patch('pybullet.getJointState')
    async def test_get_position_success(self, mock_joint_state, controller):
        """Test successful position reading."""
        controller._is_connected = True
        controller._joint_indices = {'yaw_joint': 0, 'pitch_joint': 1}
        controller._turret_id = 1
        
        # Mock joint states
        mock_joint_state.side_effect = [
            (0.5, 0.0, 0.0, 0.0, 0.0, 0.0),  # pitch
            (1.0, 0.0, 0.0, 0.0, 0.0, 0.0)   # yaw
        ]
        
        pitch, yaw = await controller.get_position()
        
        assert pitch == 0.5
        assert yaw == 1.0
        assert controller._current_position.pitch_rad == 0.5
        assert controller._current_position.yaw_rad == 1.0
    
    async def test_get_status(self, controller):
        """Test status retrieval."""
        controller._is_connected = True
        controller._is_calibrated = True
        controller._state = MotorState.IDLE
        
        with patch.object(controller, 'get_position') as mock_get_pos:
            mock_get_pos.return_value = (0.5, 1.0)
            
            status = await controller.get_status()
            
            assert status.is_connected
            assert status.is_calibrated
            assert status.mode == ControllerMode.SIMULATION
            assert status.state == MotorState.IDLE
            assert status.current_position.pitch_rad == 0.5
            assert status.current_position.yaw_rad == 1.0
    
    @patch('pybullet.disconnect')
    async def test_shutdown(self, mock_disconnect, controller):
        """Test controller shutdown."""
        controller._is_initialized = True
        controller._is_connected = True
        controller._physics_client = 1
        controller._simulation_running = True
        
        with patch.object(controller, '_stop_simulation_loop') as mock_stop_loop:
            await controller.shutdown()
        
        assert not controller._is_initialized
        assert not controller._is_connected
        assert not controller._is_calibrated
        assert controller._state == MotorState.DISCONNECTED
        assert controller._physics_client is None
        mock_stop_loop.assert_called_once()
        mock_disconnect.assert_called_once_with(1)
    
    def test_validate_position_valid(self, controller):
        """Test position validation with valid values."""
        # Should not raise exception
        controller._validate_position(0.5, 1.0)
        controller._validate_position(0.0, 0.0)
        controller._validate_position(math.pi/2, -math.pi)
    
    def test_validate_position_invalid_pitch(self, controller):
        """Test position validation with invalid pitch."""
        with pytest.raises(ValueError, match="Pitch position .* out of range"):
            controller._validate_position(-0.1, 1.0)
        
        with pytest.raises(ValueError, match="Pitch position .* out of range"):
            controller._validate_position(math.pi, 1.0)
    
    def test_validate_position_invalid_yaw(self, controller):
        """Test position validation with invalid yaw."""
        with pytest.raises(ValueError, match="Yaw position .* seems unreasonable"):
            controller._validate_position(0.5, 150.0)
    
    def test_get_joint_info_not_connected(self, controller):
        """Test joint info when not connected."""
        result = controller.get_joint_info()
        assert result == {}
    
    @patch('pybullet.getJointInfo')
    def test_get_joint_info_connected(self, mock_joint_info, controller):
        """Test joint info when connected."""
        controller._is_connected = True
        controller._joint_indices = {'yaw_joint': 0, 'pitch_joint': 1}
        controller._turret_id = 1
        
        mock_joint_info.side_effect = [
            (0, b'yaw_joint', 1, 0, 0, 0, 0, 0, -math.pi, math.pi, 10.0, 5.0, b'', (0, 0, 0), (0, 0, 0), (0, 0, 0), 0),
            (1, b'pitch_joint', 1, 0, 0, 0, 0, 0, 0, math.pi/2, 10.0, 5.0, b'', (0, 0, 0), (0, 0, 0), (0, 0, 0), 0)
        ]
        
        result = controller.get_joint_info()
        
        assert 'yaw_joint' in result
        assert 'pitch_joint' in result
        assert result['yaw_joint']['index'] == 0
        assert result['pitch_joint']['index'] == 1
        assert result['yaw_joint']['lower_limit'] == -math.pi
        assert result['pitch_joint']['upper_limit'] == math.pi/2
    
    async def test_simulation_loop_position_reached(self, controller):
        """Test simulation loop behavior when target position is reached."""
        controller._simulation_running = True
        controller._state = MotorState.MOVING
        controller._target_position = Mock()
        controller._target_position.pitch_rad = 0.5
        controller._target_position.yaw_rad = 1.0
        controller._max_position_error = 0.1
        
        with patch('pybullet.stepSimulation'), \
             patch.object(controller, 'get_position', return_value=(0.5, 1.0)), \
             patch('asyncio.sleep') as mock_sleep:
            
            # Run one iteration
            controller._simulation_running = False  # Stop after one iteration
            await controller._simulation_loop()
            
            # Should switch to idle when close to target
            assert controller._state == MotorState.IDLE
    
    async def test_is_ready(self, controller):
        """Test is_ready method."""
        # Not ready when not initialized
        assert not await controller.is_ready()
        
        # Ready when properly initialized
        controller._is_initialized = True
        controller._is_connected = True
        controller._state = MotorState.IDLE
        assert await controller.is_ready()
        
        # Not ready when in error state
        controller._state = MotorState.ERROR
        assert not await controller.is_ready()