"""Unit tests for motor service layer."""

import asyncio
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime

from app.services.motor_service import MotorService
from app.core.config import AppConfig, SimulationConfig, create_config_for_testing
from app.core.exceptions import ServiceError, HardwareError, CommunicationError
from app.models.motor import (
    ControllerMode, ControllerStatus, DualAxisConfig, 
    MotorCommand, MotorPosition, MotorState
)
from app.utils.result import Result


@pytest.fixture
def app_config():
    """Create test application configuration."""
    return create_config_for_testing()


@pytest.fixture
def axis_config():
    """Create test axis configuration."""
    return DualAxisConfig()


@pytest.fixture
def motor_service(app_config, axis_config):
    """Create motor service instance for testing."""
    return MotorService(app_config, axis_config)


@pytest.fixture
def mock_controller():
    """Create mock controller for testing."""
    controller = AsyncMock()
    controller.controller_id = "test_controller"
    controller.mode = ControllerMode.SIMULATION
    controller.initialize.return_value = Result.ok(None)
    controller.is_ready.return_value = True
    controller.send_command.return_value = Result.ok(None)
    controller.get_position.return_value = Result.ok((0.0, 0.0))
    controller.get_status.return_value = Result.ok(ControllerStatus(
        is_connected=True,
        is_calibrated=True,
        current_position=MotorPosition(0.0, 0.0, datetime.now()),
        target_position=None,
        errors=[],
        mode=ControllerMode.SIMULATION,
        state=MotorState.IDLE
    ))
    controller.shutdown.return_value = Result.ok(None)
    return controller


class TestMotorServiceInitialization:
    """Test motor service initialization."""
    
    def test_motor_service_creation(self, app_config, axis_config):
        """Test motor service can be created."""
        service = MotorService(app_config, axis_config)
        
        assert service.config == app_config
        assert service.axis_config == axis_config
        assert not service.is_initialized
        assert service.current_mode == ControllerMode.OFFLINE
    
    @patch('app.services.motor_service.SimulationController')
    async def test_initialize_simulation_mode(self, mock_sim_class, motor_service, mock_controller):
        """Test initialization in simulation mode."""
        # Setup mock
        mock_sim_class.return_value = mock_controller
        
        # Initialize service
        result = await motor_service.initialize()
        
        # Verify results
        assert result.success
        assert motor_service.is_initialized
        assert motor_service.current_mode == ControllerMode.SIMULATION
        assert motor_service.is_simulation_available
        
        # Verify controller was initialized
        mock_controller.initialize.assert_called_once()
    
    @patch('app.services.motor_service.ODriveController')
    @patch('app.services.motor_service.SimulationController')
    async def test_initialize_hardware_mode_success(self, mock_sim_class, mock_odrive_class, 
                                                   app_config, axis_config, mock_controller):
        """Test initialization in hardware mode with successful hardware detection."""
        # Setup configuration for hardware mode
        hardware_config = app_config.model_copy(update={"default_mode": "hardware"})
        service = MotorService(hardware_config, axis_config)
        
        # Setup mocks
        mock_hardware_controller = AsyncMock()
        mock_hardware_controller.controller_id = "odrive_hardware"
        mock_hardware_controller.mode = ControllerMode.HARDWARE
        mock_hardware_controller.initialize.return_value = Result.ok(None)
        mock_hardware_controller.detect_hardware.return_value = True
        mock_hardware_controller.is_ready.return_value = True
        
        mock_odrive_class.return_value = mock_hardware_controller
        mock_sim_class.return_value = mock_controller
        
        # Initialize service
        result = await service.initialize()
        
        # Verify results
        assert result.success
        assert service.is_initialized
        assert service.current_mode == ControllerMode.HARDWARE
        assert service.is_hardware_available
        assert service.is_simulation_available
        
        # Verify hardware controller was initialized
        mock_hardware_controller.initialize.assert_called_once()
    
    @patch('app.services.motor_service.ODriveController')
    @patch('app.services.motor_service.SimulationController')
    async def test_initialize_hardware_mode_fallback(self, mock_sim_class, mock_odrive_class,
                                                    app_config, axis_config, mock_controller):
        """Test initialization in hardware mode with fallback to simulation."""
        # Setup configuration for hardware mode
        hardware_config = app_config.model_copy(update={"default_mode": "hardware"})
        service = MotorService(hardware_config, axis_config)
        
        # Setup mocks - hardware fails, simulation succeeds
        mock_hardware_controller = AsyncMock()
        mock_hardware_controller.detect_hardware.return_value = False
        
        mock_odrive_class.return_value = mock_hardware_controller
        mock_sim_class.return_value = mock_controller
        
        # Initialize service
        result = await service.initialize()
        
        # Verify results - should fallback to simulation
        assert result.success
        assert service.is_initialized
        assert service.current_mode == ControllerMode.SIMULATION
        assert service.is_simulation_available
        
        # Verify simulation controller was initialized
        mock_controller.initialize.assert_called_once()
    
    @patch('app.services.motor_service.SimulationController')
    async def test_initialize_simulation_failure(self, mock_sim_class, motor_service):
        """Test initialization failure when simulation controller fails."""
        # Setup mock to fail
        mock_controller = AsyncMock()
        mock_controller.initialize.return_value = Result.err("Simulation initialization failed")
        mock_sim_class.return_value = mock_controller
        
        # Initialize service should return error
        result = await motor_service.initialize()
        assert not result.success
        assert "Simulation initialization failed" in result.error
        
        assert not motor_service.is_initialized
    
    async def test_double_initialization(self, motor_service):
        """Test that double initialization is handled gracefully."""
        with patch('app.services.motor_service.SimulationController') as mock_sim_class:
            mock_controller = AsyncMock()
            mock_controller.initialize.return_value = Result.ok(None)
            mock_sim_class.return_value = mock_controller
            
            # First initialization
            result1 = await motor_service.initialize()
            assert result1.success
            
            # Second initialization should return True without re-initializing
            result2 = await motor_service.initialize()
            assert result2.success
            
            # Controller should only be initialized once
            mock_controller.initialize.assert_called_once()


class TestMotorServiceModeSwitch:
    """Test motor service mode switching."""
    
    @patch('app.services.motor_service.SimulationController')
    async def test_switch_to_same_mode(self, mock_sim_class, motor_service, mock_controller):
        """Test switching to the same mode."""
        # Setup and initialize
        mock_sim_class.return_value = mock_controller
        await motor_service.initialize()
        
        # Switch to same mode
        result = await motor_service.switch_mode(ControllerMode.SIMULATION)
        
        assert result.success
        assert motor_service.current_mode == ControllerMode.SIMULATION
    
    @patch('app.services.motor_service.ODriveController')
    @patch('app.services.motor_service.SimulationController')
    async def test_switch_to_hardware_success(self, mock_sim_class, mock_odrive_class,
                                             motor_service, mock_controller):
        """Test successful switch from simulation to hardware."""
        # Setup and initialize in simulation mode
        mock_sim_class.return_value = mock_controller
        await motor_service.initialize()
        
        # Setup hardware controller mock
        mock_hardware_controller = AsyncMock()
        mock_hardware_controller.detect_hardware.return_value = True
        mock_hardware_controller.initialize.return_value = True
        mock_hardware_controller.is_ready.return_value = True
        mock_odrive_class.return_value = mock_hardware_controller
        
        # Switch to hardware mode
        result = await motor_service.switch_mode(ControllerMode.HARDWARE)
        
        assert result.success
        assert motor_service.current_mode == ControllerMode.HARDWARE
        assert motor_service.is_hardware_available
    
    @patch('app.services.motor_service.ODriveController')
    @patch('app.services.motor_service.SimulationController')
    async def test_switch_to_hardware_failure(self, mock_sim_class, mock_odrive_class,
                                             motor_service, mock_controller):
        """Test failed switch from simulation to hardware."""
        # Setup and initialize in simulation mode
        mock_sim_class.return_value = mock_controller
        await motor_service.initialize()
        
        # Setup hardware controller mock to fail
        mock_hardware_controller = AsyncMock()
        mock_hardware_controller.detect_hardware.return_value = False
        mock_odrive_class.return_value = mock_hardware_controller
        
        # Switch to hardware mode should fail
        result = await motor_service.switch_mode(ControllerMode.HARDWARE)
        
        assert not result.success
        assert motor_service.current_mode == ControllerMode.SIMULATION  # Should stay in simulation
    
    async def test_switch_mode_not_initialized(self, motor_service):
        """Test mode switch when service is not initialized."""
        with pytest.raises(ServiceError, match="Motor service not initialized"):
            await motor_service.switch_mode(ControllerMode.HARDWARE)


class TestMotorServiceCommands:
    """Test motor service command processing."""
    
    @patch('app.services.motor_service.SimulationController')
    async def test_send_position_command_success(self, mock_sim_class, motor_service, mock_controller):
        """Test successful position command."""
        # Setup and initialize
        mock_sim_class.return_value = mock_controller
        await motor_service.initialize()
        
        # Create command
        command = MotorCommand.from_degrees(45.0, 90.0)
        
        # Send command
        result = await motor_service.send_position_command(command)
        
        assert result.success
        mock_controller.send_command.assert_called_once_with(command)
    
    @patch('app.services.motor_service.SimulationController')
    async def test_send_position_command_controller_not_ready(self, mock_sim_class, motor_service, mock_controller):
        """Test position command when controller is not ready."""
        # Setup and initialize
        mock_controller.is_ready.return_value = False
        mock_sim_class.return_value = mock_controller
        await motor_service.initialize()
        
        # Create command
        command = MotorCommand.from_degrees(45.0, 90.0)
        
        # Send command should fail
        with pytest.raises(ServiceError, match="Controller .* not ready for commands"):
            await motor_service.send_position_command(command)
    
    async def test_send_position_command_not_initialized(self, motor_service):
        """Test position command when service is not initialized."""
        command = MotorCommand.from_degrees(45.0, 90.0)
        
        with pytest.raises(ServiceError, match="Motor service not initialized"):
            await motor_service.send_position_command(command)
    
    @patch('app.services.motor_service.SimulationController')
    async def test_get_current_position_success(self, mock_sim_class, motor_service, mock_controller):
        """Test successful position reading."""
        # Setup and initialize
        expected_position = (0.5, 1.0)
        mock_controller.get_position.return_value = expected_position
        mock_sim_class.return_value = mock_controller
        await motor_service.initialize()
        
        # Get position
        position = await motor_service.get_current_position()
        
        assert position == expected_position
        mock_controller.get_position.assert_called_once()
    
    async def test_get_current_position_not_initialized(self, motor_service):
        """Test position reading when service is not initialized."""
        with pytest.raises(ServiceError, match="Motor service not initialized"):
            await motor_service.get_current_position()
    
    @patch('app.services.motor_service.SimulationController')
    async def test_get_status_success(self, mock_sim_class, motor_service, mock_controller):
        """Test successful status reading."""
        # Setup and initialize
        expected_status = ControllerStatus(
            is_connected=True,
            is_calibrated=True,
            current_position=MotorPosition(0.0, 0.0, datetime.now()),
            target_position=None,
            errors=[],
            mode=ControllerMode.SIMULATION,
            state=MotorState.IDLE
        )
        mock_controller.get_status.return_value = expected_status
        mock_sim_class.return_value = mock_controller
        await motor_service.initialize()
        
        # Get status
        status = await motor_service.get_status()
        
        assert status == expected_status
        mock_controller.get_status.assert_called_once()
    
    async def test_get_status_not_initialized(self, motor_service):
        """Test status reading when service is not initialized."""
        with pytest.raises(ServiceError, match="Motor service not initialized"):
            await motor_service.get_status()


class TestMotorServiceInfo:
    """Test motor service information methods."""
    
    @patch('app.services.motor_service.SimulationController')
    async def test_get_service_info_initialized(self, mock_sim_class, motor_service, mock_controller):
        """Test service info when initialized."""
        # Setup and initialize
        mock_sim_class.return_value = mock_controller
        await motor_service.initialize()
        
        # Get service info
        info = await motor_service.get_service_info()
        
        assert info["is_initialized"] is True
        assert info["current_mode"] == "simulation"
        assert info["desired_mode"] == "simulation"
        assert info["simulation_available"] is True
        assert info["active_controller"] == "test_controller"
        assert "controller_status" in info
    
    async def test_get_service_info_not_initialized(self, motor_service):
        """Test service info when not initialized."""
        info = await motor_service.get_service_info()
        
        assert info["is_initialized"] is False
        assert info["current_mode"] == "offline"
        assert info["active_controller"] is None
    
    @patch('app.services.motor_service.SimulationController')
    async def test_is_ready_success(self, mock_sim_class, motor_service, mock_controller):
        """Test is_ready when service is ready."""
        # Setup and initialize
        mock_sim_class.return_value = mock_controller
        await motor_service.initialize()
        
        # Check readiness
        ready = await motor_service.is_ready()
        
        assert ready is True
        mock_controller.is_ready.assert_called_once()
    
    async def test_is_ready_not_initialized(self, motor_service):
        """Test is_ready when service is not initialized."""
        ready = await motor_service.is_ready()
        assert ready is False
    
    @patch('app.services.motor_service.SimulationController')
    async def test_is_ready_controller_not_ready(self, mock_sim_class, motor_service, mock_controller):
        """Test is_ready when controller is not ready."""
        # Setup and initialize
        mock_controller.is_ready.return_value = False
        mock_sim_class.return_value = mock_controller
        await motor_service.initialize()
        
        # Check readiness
        ready = await motor_service.is_ready()
        
        assert ready is False


class TestMotorServiceShutdown:
    """Test motor service shutdown."""
    
    @patch('app.services.motor_service.SimulationController')
    async def test_shutdown_success(self, mock_sim_class, motor_service, mock_controller):
        """Test successful shutdown."""
        # Setup and initialize
        mock_sim_class.return_value = mock_controller
        await motor_service.initialize()
        
        # Shutdown
        await motor_service.shutdown()
        
        # Verify state
        assert not motor_service.is_initialized
        assert motor_service.current_mode == ControllerMode.OFFLINE
        assert not motor_service.is_simulation_available
        assert not motor_service.is_hardware_available
        
        # Verify controller was shutdown
        mock_controller.shutdown.assert_called_once()
    
    @patch('app.services.motor_service.ODriveController')
    @patch('app.services.motor_service.SimulationController')
    async def test_shutdown_with_both_controllers(self, mock_sim_class, mock_odrive_class,
                                                 app_config, axis_config):
        """Test shutdown with both hardware and simulation controllers."""
        # Setup configuration for hardware mode
        hardware_config = app_config.model_copy(update={"default_mode": "hardware"})
        service = MotorService(hardware_config, axis_config)
        
        # Setup mocks
        mock_hardware_controller = AsyncMock()
        mock_hardware_controller.detect_hardware.return_value = True
        mock_hardware_controller.initialize.return_value = True
        mock_hardware_controller.shutdown = AsyncMock()
        
        mock_sim_controller = AsyncMock()
        mock_sim_controller.initialize.return_value = True
        mock_sim_controller.shutdown = AsyncMock()
        
        mock_odrive_class.return_value = mock_hardware_controller
        mock_sim_class.return_value = mock_sim_controller
        
        # Initialize and shutdown
        await service.initialize()
        await service.shutdown()
        
        # Verify both controllers were shutdown
        mock_hardware_controller.shutdown.assert_called_once()
        mock_sim_controller.shutdown.assert_called_once()
    
    @patch('app.services.motor_service.SimulationController')
    async def test_shutdown_with_controller_error(self, mock_sim_class, motor_service, mock_controller):
        """Test shutdown when controller shutdown fails."""
        # Setup and initialize
        mock_controller.shutdown.side_effect = Exception("Shutdown error")
        mock_sim_class.return_value = mock_controller
        await motor_service.initialize()
        
        # Shutdown should complete despite controller error
        await motor_service.shutdown()
        
        # Verify state is still reset
        assert not motor_service.is_initialized
        assert motor_service.current_mode == ControllerMode.OFFLINE


class TestMotorServiceProperties:
    """Test motor service properties."""
    
    def test_properties_not_initialized(self, motor_service):
        """Test properties when service is not initialized."""
        assert motor_service.current_mode == ControllerMode.OFFLINE
        assert not motor_service.is_initialized
        assert not motor_service.is_hardware_available
        assert not motor_service.is_simulation_available
    
    @patch('app.services.motor_service.SimulationController')
    async def test_properties_simulation_mode(self, mock_sim_class, motor_service, mock_controller):
        """Test properties in simulation mode."""
        # Setup and initialize
        mock_sim_class.return_value = mock_controller
        await motor_service.initialize()
        
        assert motor_service.current_mode == ControllerMode.SIMULATION
        assert motor_service.is_initialized
        assert not motor_service.is_hardware_available
        assert motor_service.is_simulation_available
    
    @patch('app.services.motor_service.ODriveController')
    @patch('app.services.motor_service.SimulationController')
    async def test_properties_hardware_mode(self, mock_sim_class, mock_odrive_class,
                                           app_config, axis_config, mock_controller):
        """Test properties in hardware mode."""
        # Setup configuration for hardware mode
        hardware_config = app_config.model_copy(update={"default_mode": "hardware"})
        service = MotorService(hardware_config, axis_config)
        
        # Setup mocks
        mock_hardware_controller = AsyncMock()
        mock_hardware_controller.detect_hardware.return_value = True
        mock_hardware_controller.initialize.return_value = True
        
        mock_odrive_class.return_value = mock_hardware_controller
        mock_sim_class.return_value = mock_controller
        
        # Initialize
        await service.initialize()
        
        assert service.current_mode == ControllerMode.HARDWARE
        assert service.is_initialized
        assert service.is_hardware_available
        assert service.is_simulation_available


class TestMotorServiceErrorHandling:
    """Test motor service error handling."""
    
    @patch('app.services.motor_service.SimulationController')
    async def test_command_with_controller_exception(self, mock_sim_class, motor_service, mock_controller):
        """Test command handling when controller raises exception."""
        # Setup and initialize
        mock_controller.send_command.side_effect = Exception("Controller error")
        mock_sim_class.return_value = mock_controller
        await motor_service.initialize()
        
        # Send command should raise ServiceError
        command = MotorCommand.from_degrees(45.0, 90.0)
        with pytest.raises(ServiceError, match="Failed to send position command"):
            await motor_service.send_position_command(command)
    
    @patch('app.services.motor_service.SimulationController')
    async def test_position_with_controller_exception(self, mock_sim_class, motor_service, mock_controller):
        """Test position reading when controller raises exception."""
        # Setup and initialize
        mock_controller.get_position.side_effect = CommunicationError("Communication error")
        mock_sim_class.return_value = mock_controller
        await motor_service.initialize()
        
        # Get position should re-raise CommunicationError
        with pytest.raises(CommunicationError, match="Communication error"):
            await motor_service.get_current_position()
    
    @patch('app.services.motor_service.SimulationController')
    async def test_status_with_controller_exception(self, mock_sim_class, motor_service, mock_controller):
        """Test status reading when controller raises exception."""
        # Setup and initialize
        mock_controller.get_status.side_effect = Exception("Status error")
        mock_sim_class.return_value = mock_controller
        await motor_service.initialize()
        
        # Get status should raise ServiceError
        with pytest.raises(ServiceError, match="Failed to get status"):
            await motor_service.get_status()
    
    @patch('app.services.motor_service.SimulationController')
    async def test_service_info_with_controller_exception(self, mock_sim_class, motor_service, mock_controller):
        """Test service info when controller status fails."""
        # Setup and initialize
        mock_controller.get_status.side_effect = Exception("Status error")
        mock_sim_class.return_value = mock_controller
        await motor_service.initialize()
        
        # Get service info should handle error gracefully
        info = await motor_service.get_service_info()
        
        assert "controller_status_error" in info
        assert info["controller_status_error"] == "Status error"