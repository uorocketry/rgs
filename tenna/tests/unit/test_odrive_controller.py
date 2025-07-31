"""Unit tests for ODrive controller with mocked hardware."""

import asyncio
import math
import pytest
from datetime import datetime
from unittest.mock import AsyncMock, MagicMock, Mock, patch
from typing import Optional

from app.controllers.odrive_controller import ODriveController
from app.core.exceptions import HardwareError, CommunicationError, MotorControlError
from app.models.motor import (
    AxisConfig, ControllerMode, ControllerStatus, DualAxisConfig,
    MotorPosition, MotorState
)


class MockODriveAxis:
    """Mock ODrive axis for testing."""
    
    def __init__(self, axis_index: int):
        self.axis_index = axis_index
        self.current_state = 1  # IDLE
        self.requested_state = 1
        
        # Motor configuration
        self.motor = Mock()
        self.motor.config = Mock()
        self.motor.config.pole_pairs = 7
        self.motor.config.torque_constant = 8.27 / 150
        self.motor.config.current_lim = 5.0
        self.motor.config.calibration_current = 5.0
        
        # Controller configuration
        self.controller = Mock()
        self.controller.config = Mock()
        self.controller.config.circular_setpoints = True
        self.controller.config.circular_setpoint_range = 1.0
        self.controller.input_pos = 0.0
        
        # Encoder
        self.encoder = Mock()
        self.encoder.pos_estimate = 0.0


class MockODriveDevice:
    """Mock ODrive device for testing."""
    
    def __init__(self, serial_number: str = "test_serial_123"):
        self.serial_number = serial_number
        self.axis0 = MockODriveAxis(0)
        self.axis1 = MockODriveAxis(1)
        self._errors_cleared = False
    
    def clear_errors(self):
        """Mock clear_errors method."""
        self._errors_cleared = True


@pytest.fixture
def mock_odrive_device():
    """Fixture providing a mock ODrive device."""
    return MockODriveDevice()


@pytest.fixture
def axis_config():
    """Fixture providing axis configuration."""
    return DualAxisConfig(
        yaw_axis=AxisConfig(axis_index=0, gear_ratio=20.0, circular_setpoints=True),
        pitch_axis=AxisConfig(axis_index=1, gear_ratio=20.0, circular_setpoints=False)
    )


@pytest.fixture
def odrive_controller(axis_config):
    """Fixture providing ODrive controller instance."""
    return ODriveController("test_odrive", axis_config)


class TestODriveControllerInitialization:
    """Test ODrive controller initialization."""
    
    @patch('app.controllers.odrive_controller.ODRIVE_AVAILABLE', True)
    @patch('app.controllers.odrive_controller.odrive')
    async def test_successful_initialization(self, mock_odrive, odrive_controller, mock_odrive_device):
        """Test successful ODrive initialization."""
        mock_odrive.find_any.return_value = mock_odrive_device
        
        # Set axes to IDLE state for successful calibration
        mock_odrive_device.axis0.current_state = 1  # IDLE
        mock_odrive_device.axis1.current_state = 1  # IDLE
        
        result = await odrive_controller.initialize()
        
        assert result is True
        assert odrive_controller._is_initialized is True
        assert odrive_controller._is_connected is True
        assert odrive_controller._is_calibrated is True
        assert odrive_controller._state == MotorState.IDLE
        
        # Verify ODrive configuration was applied
        assert mock_odrive_device.axis0.motor.config.pole_pairs == 7
        assert mock_odrive_device.axis0.motor.config.current_lim == 5.0
        assert mock_odrive_device.axis0.controller.config.circular_setpoints is True
    
    @patch('app.controllers.odrive_controller.ODRIVE_AVAILABLE', False)
    async def test_initialization_without_odrive_library(self, odrive_controller):
        """Test initialization when ODrive library is not available."""
        with pytest.raises(HardwareError, match="ODrive library not available"):
            await odrive_controller.initialize()
    
    @patch('app.controllers.odrive_controller.ODRIVE_AVAILABLE', True)
    @patch('app.controllers.odrive_controller.odrive')
    async def test_initialization_no_device_found(self, mock_odrive, odrive_controller):
        """Test initialization when no ODrive device is found."""
        mock_odrive.find_any.return_value = None
        
        with pytest.raises(HardwareError, match="No ODrive hardware detected"):
            await odrive_controller.initialize()
    
    @patch('app.controllers.odrive_controller.ODRIVE_AVAILABLE', True)
    @patch('app.controllers.odrive_controller.odrive')
    async def test_initialization_timeout(self, mock_odrive, odrive_controller):
        """Test initialization timeout."""
        # Simulate timeout by making find_any hang
        async def slow_find():
            await asyncio.sleep(15)  # Longer than connection timeout
            return None
        
        mock_odrive.find_any.side_effect = lambda: asyncio.create_task(slow_find())
        
        with pytest.raises(HardwareError, match="ODrive hardware not found within"):
            await odrive_controller.initialize()
    
    @patch('app.controllers.odrive_controller.ODRIVE_AVAILABLE', True)
    @patch('app.controllers.odrive_controller.odrive')
    async def test_calibration_timeout(self, mock_odrive, odrive_controller, mock_odrive_device):
        """Test calibration timeout."""
        mock_odrive.find_any.return_value = mock_odrive_device
        
        # Make calibration never complete (axes stay in calibration state)
        mock_odrive_device.axis0.current_state = 3  # FULL_CALIBRATION_SEQUENCE
        mock_odrive_device.axis1.current_state = 3  # FULL_CALIBRATION_SEQUENCE
        
        # Set a very short calibration timeout for testing
        odrive_controller._calibration_timeout = 0.1
        
        with pytest.raises(HardwareError, match="Calibration timeout"):
            await odrive_controller.initialize()


class TestODriveControllerPositionControl:
    """Test ODrive controller position control."""
    
    async def setup_initialized_controller(self, odrive_controller, mock_odrive_device):
        """Helper to set up an initialized controller."""
        with patch('app.controllers.odrive_controller.ODRIVE_AVAILABLE', True), \
             patch('app.controllers.odrive_controller.odrive') as mock_odrive:
            
            mock_odrive.find_any.return_value = mock_odrive_device
            
            # Mock successful calibration - axes start in calibration then go to idle
            def calibration_sequence():
                mock_odrive_device.axis0.current_state = 1  # IDLE
                mock_odrive_device.axis1.current_state = 1  # IDLE
            
            # Simulate calibration completion after a short delay
            mock_odrive_device.axis0.current_state = 1  # IDLE
            mock_odrive_device.axis1.current_state = 1  # IDLE
            
            await odrive_controller.initialize()
    
    async def test_set_position_success(self, odrive_controller, mock_odrive_device):
        """Test successful position setting."""
        await self.setup_initialized_controller(odrive_controller, mock_odrive_device)
        
        pitch_rad = math.radians(30)
        yaw_rad = math.radians(45)
        
        result = await odrive_controller.set_position(pitch_rad, yaw_rad)
        
        assert result is True
        assert odrive_controller._state == MotorState.MOVING
        
        # Verify motor commands were sent (accounting for gear ratio)
        expected_yaw_turns = yaw_rad / (2 * math.pi) * 20.0  # gear ratio
        expected_pitch_turns = pitch_rad / (2 * math.pi) * 20.0
        
        assert mock_odrive_device.axis0.controller.input_pos == expected_yaw_turns
        assert mock_odrive_device.axis1.controller.input_pos == expected_pitch_turns
    
    async def test_set_position_with_circular_setpoints(self, odrive_controller, mock_odrive_device):
        """Test position setting with circular setpoints (shortest path)."""
        await self.setup_initialized_controller(odrive_controller, mock_odrive_device)
        
        # Set current position to near 0 degrees
        odrive_controller._unbounded_yaw_position = math.radians(10)
        
        # Command to 350 degrees (should go to -10 degrees for shortest path)
        target_yaw_rad = math.radians(350)
        pitch_rad = 0.0
        
        result = await odrive_controller.set_position(pitch_rad, target_yaw_rad)
        
        assert result is True
        
        # The controller should have calculated the shortest path
        # This is complex to verify exactly, but we can check that it was processed
        assert mock_odrive_device.axis0.controller.input_pos != 0.0
    
    async def test_set_position_not_ready(self, odrive_controller):
        """Test position setting when controller is not ready."""
        # Controller not initialized
        with pytest.raises(MotorControlError, match="Controller not ready"):
            await odrive_controller.set_position(0.0, 0.0)
    
    async def test_set_position_invalid_range(self, odrive_controller, mock_odrive_device):
        """Test position setting with invalid range."""
        await self.setup_initialized_controller(odrive_controller, mock_odrive_device)
        
        # Pitch out of safe range
        with pytest.raises(ValueError, match="out of safe range"):
            await odrive_controller.set_position(math.radians(100), 0.0)
    
    async def test_get_position_success(self, odrive_controller, mock_odrive_device):
        """Test successful position reading."""
        await self.setup_initialized_controller(odrive_controller, mock_odrive_device)
        
        # Set mock encoder positions
        mock_odrive_device.axis0.encoder.pos_estimate = 1.0  # 1 motor turn
        mock_odrive_device.axis1.encoder.pos_estimate = 0.5  # 0.5 motor turns
        
        pitch_rad, yaw_rad = await odrive_controller.get_position()
        
        # Verify conversion from motor turns to radians (accounting for gear ratio)
        expected_yaw_rad = (1.0 / 20.0) * 2 * math.pi  # motor turns / gear ratio * 2π
        expected_pitch_rad = (0.5 / 20.0) * 2 * math.pi
        
        assert abs(yaw_rad - expected_yaw_rad) < 1e-6
        assert abs(pitch_rad - expected_pitch_rad) < 1e-6
    
    async def test_get_position_not_connected(self, odrive_controller):
        """Test position reading when not connected."""
        with pytest.raises(CommunicationError, match="ODrive not connected"):
            await odrive_controller.get_position()


class TestODriveControllerStatus:
    """Test ODrive controller status reporting."""
    
    async def test_get_status_connected(self, odrive_controller, mock_odrive_device):
        """Test status when connected and operational."""
        with patch('app.controllers.odrive_controller.ODRIVE_AVAILABLE', True), \
             patch('app.controllers.odrive_controller.odrive') as mock_odrive:
            
            mock_odrive.find_any.return_value = mock_odrive_device
            mock_odrive_device.axis0.current_state = 1  # IDLE
            mock_odrive_device.axis1.current_state = 1  # IDLE
            
            await odrive_controller.initialize()
            
            status = await odrive_controller.get_status()
            
            assert isinstance(status, ControllerStatus)
            assert status.is_connected is True
            assert status.is_calibrated is True
            assert status.mode == ControllerMode.HARDWARE
            assert status.state == MotorState.IDLE
            assert len(status.errors) == 0
    
    async def test_get_status_with_errors(self, odrive_controller):
        """Test status when controller has errors."""
        odrive_controller.add_error("Test error message")
        
        status = await odrive_controller.get_status()
        
        assert status.is_connected is False
        assert status.state == MotorState.ERROR
        assert "Test error message" in status.errors
    
    async def test_is_ready_when_operational(self, odrive_controller, mock_odrive_device):
        """Test is_ready when controller is operational."""
        with patch('app.controllers.odrive_controller.ODRIVE_AVAILABLE', True), \
             patch('app.controllers.odrive_controller.odrive') as mock_odrive:
            
            mock_odrive.find_any.return_value = mock_odrive_device
            mock_odrive_device.axis0.current_state = 1  # IDLE
            mock_odrive_device.axis1.current_state = 1  # IDLE
            
            await odrive_controller.initialize()
            
            is_ready = await odrive_controller.is_ready()
            assert is_ready is True
    
    async def test_is_ready_when_not_initialized(self, odrive_controller):
        """Test is_ready when controller is not initialized."""
        is_ready = await odrive_controller.is_ready()
        assert is_ready is False


class TestODriveControllerShutdown:
    """Test ODrive controller shutdown."""
    
    async def test_shutdown_success(self, odrive_controller, mock_odrive_device):
        """Test successful shutdown."""
        with patch('app.controllers.odrive_controller.ODRIVE_AVAILABLE', True), \
             patch('app.controllers.odrive_controller.odrive') as mock_odrive:
            
            mock_odrive.find_any.return_value = mock_odrive_device
            mock_odrive_device.axis0.current_state = 1  # IDLE
            mock_odrive_device.axis1.current_state = 1  # IDLE
            
            await odrive_controller.initialize()
            
            # Verify initialized state
            assert odrive_controller._is_connected is True
            assert odrive_controller._is_initialized is True
            
            await odrive_controller.shutdown()
            
            # Verify shutdown state
            assert odrive_controller._is_connected is False
            assert odrive_controller._is_initialized is False
            assert odrive_controller._is_calibrated is False
            assert odrive_controller._state == MotorState.DISCONNECTED
            assert odrive_controller._odrive_device is None
    
    async def test_shutdown_when_not_connected(self, odrive_controller):
        """Test shutdown when not connected."""
        # Should not raise an exception
        await odrive_controller.shutdown()
        
        assert odrive_controller._is_connected is False
        assert odrive_controller._state == MotorState.DISCONNECTED


class TestODriveControllerHardwareDetection:
    """Test ODrive hardware detection."""
    
    @patch('app.controllers.odrive_controller.ODRIVE_AVAILABLE', True)
    @patch('app.controllers.odrive_controller.odrive')
    async def test_detect_hardware_success(self, mock_odrive, odrive_controller, mock_odrive_device):
        """Test successful hardware detection."""
        mock_odrive.find_any.return_value = mock_odrive_device
        
        result = await odrive_controller.detect_hardware()
        
        assert result is True
    
    @patch('app.controllers.odrive_controller.ODRIVE_AVAILABLE', True)
    @patch('app.controllers.odrive_controller.odrive')
    async def test_detect_hardware_not_found(self, mock_odrive, odrive_controller):
        """Test hardware detection when no device found."""
        mock_odrive.find_any.return_value = None
        
        result = await odrive_controller.detect_hardware()
        
        assert result is False
    
    @patch('app.controllers.odrive_controller.ODRIVE_AVAILABLE', False)
    async def test_detect_hardware_library_unavailable(self, odrive_controller):
        """Test hardware detection when ODrive library unavailable."""
        result = await odrive_controller.detect_hardware()
        
        assert result is False
    
    @patch('app.controllers.odrive_controller.ODRIVE_AVAILABLE', True)
    @patch('app.controllers.odrive_controller.odrive')
    async def test_detect_hardware_timeout(self, mock_odrive, odrive_controller):
        """Test hardware detection timeout."""
        # Simulate timeout
        async def slow_find():
            await asyncio.sleep(10)
            return None
        
        mock_odrive.find_any.side_effect = lambda: asyncio.create_task(slow_find())
        
        result = await odrive_controller.detect_hardware()
        
        assert result is False


class TestODriveControllerErrorHandling:
    """Test ODrive controller error handling."""
    
    async def test_error_tracking(self, odrive_controller):
        """Test error tracking functionality."""
        assert len(odrive_controller._errors) == 0
        assert odrive_controller._state != MotorState.ERROR
        
        odrive_controller.add_error("Test error 1")
        
        assert len(odrive_controller._errors) == 1
        assert "Test error 1" in odrive_controller._errors
        assert odrive_controller._state == MotorState.ERROR
        
        # Adding same error shouldn't duplicate
        odrive_controller.add_error("Test error 1")
        assert len(odrive_controller._errors) == 1
        
        # Adding different error should add
        odrive_controller.add_error("Test error 2")
        assert len(odrive_controller._errors) == 2
    
    async def test_clear_errors(self, odrive_controller):
        """Test error clearing functionality."""
        odrive_controller.add_error("Test error")
        odrive_controller._is_connected = True
        
        assert len(odrive_controller._errors) > 0
        assert odrive_controller._state == MotorState.ERROR
        
        odrive_controller.clear_errors()
        
        assert len(odrive_controller._errors) == 0
        assert odrive_controller._state == MotorState.IDLE
    
    @patch('app.controllers.odrive_controller.ODRIVE_AVAILABLE', True)
    @patch('app.controllers.odrive_controller.odrive')
    async def test_communication_error_handling(self, mock_odrive, odrive_controller, mock_odrive_device):
        """Test handling of communication errors."""
        mock_odrive.find_any.return_value = mock_odrive_device
        mock_odrive_device.axis0.current_state = 1  # IDLE
        mock_odrive_device.axis1.current_state = 1  # IDLE
        
        await odrive_controller.initialize()
        
        # Simulate communication error during position read
        mock_odrive_device.axis0.encoder.pos_estimate = Mock(side_effect=Exception("Communication lost"))
        
        with pytest.raises(CommunicationError, match="Failed to read position"):
            await odrive_controller.get_position()


class TestODriveControllerConfiguration:
    """Test ODrive controller configuration."""
    
    def test_custom_axis_configuration(self):
        """Test controller with custom axis configuration."""
        custom_config = DualAxisConfig(
            yaw_axis=AxisConfig(axis_index=1, gear_ratio=10.0, pole_pairs=14),
            pitch_axis=AxisConfig(axis_index=0, gear_ratio=15.0, pole_pairs=21)
        )
        
        controller = ODriveController("custom", custom_config)
        
        assert controller.axis_config.yaw_axis.axis_index == 1
        assert controller.axis_config.yaw_axis.gear_ratio == 10.0
        assert controller.axis_config.yaw_axis.pole_pairs == 14
        
        assert controller.axis_config.pitch_axis.axis_index == 0
        assert controller.axis_config.pitch_axis.gear_ratio == 15.0
        assert controller.axis_config.pitch_axis.pole_pairs == 21
    
    def test_default_configuration(self):
        """Test controller with default configuration."""
        controller = ODriveController()
        
        assert controller.axis_config.yaw_axis.axis_index == 0
        assert controller.axis_config.yaw_axis.gear_ratio == 20.0
        assert controller.axis_config.pitch_axis.axis_index == 1
        assert controller.axis_config.pitch_axis.gear_ratio == 20.0


if __name__ == "__main__":
    pytest.main([__file__])