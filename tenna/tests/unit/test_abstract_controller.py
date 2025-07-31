"""Unit tests for abstract motor controller interfaces."""

import asyncio
import pytest
from datetime import datetime
from unittest.mock import AsyncMock, MagicMock

from app.controllers.base import AbstractMotorController, BaseMotorController
from app.core.exceptions import MotorControlError, CommunicationError
from app.models.motor import (
    AxisConfig, ControllerMode, ControllerStatus, DualAxisConfig,
    MotorCommand, MotorPosition, MotorState
)


class MockMotorController(AbstractMotorController):
    """Mock implementation of AbstractMotorController for testing."""
    
    def __init__(self, controller_id: str = "test_controller"):
        super().__init__(controller_id, ControllerMode.SIMULATION)
        self.initialize_called = False
        self.set_position_called = False
        self.get_position_called = False
        self.get_status_called = False
        self.shutdown_called = False
        self.should_fail_initialize = False
        self.should_fail_set_position = False
        self.should_fail_get_position = False
        self.mock_position = (0.0, 0.0)
    
    async def initialize(self) -> bool:
        """Mock initialize implementation."""
        self.initialize_called = True
        if self.should_fail_initialize:
            raise MotorControlError("Mock initialization failure")
        
        self._is_initialized = True
        self._is_connected = True
        self._state = MotorState.IDLE
        return True
    
    async def set_position(self, pitch_rad: float, yaw_rad: float) -> bool:
        """Mock set_position implementation."""
        self.set_position_called = True
        if self.should_fail_set_position:
            return False
        
        self._set_target_position(pitch_rad, yaw_rad)
        self._update_position(pitch_rad, yaw_rad)
        return True
    
    async def get_position(self) -> tuple[float, float]:
        """Mock get_position implementation."""
        self.get_position_called = True
        if self.should_fail_get_position:
            raise CommunicationError("Mock communication failure")
        
        return self.mock_position
    
    async def get_status(self) -> ControllerStatus:
        """Mock get_status implementation."""
        self.get_status_called = True
        # Create a basic status since we don't inherit from BaseMotorController
        return ControllerStatus(
            is_connected=self._is_connected,
            is_calibrated=self._is_calibrated,
            current_position=self._current_position,
            target_position=self._target_position,
            errors=self._errors.copy(),
            mode=self.mode,
            state=self._state
        )
    
    async def shutdown(self) -> None:
        """Mock shutdown implementation."""
        self.shutdown_called = True
        self._is_connected = False
        self._state = MotorState.DISCONNECTED


class TestAbstractMotorController:
    """Test AbstractMotorController interface."""
    
    @pytest.fixture
    def controller(self):
        """Create a mock controller for testing."""
        return MockMotorController()
    
    def test_controller_initialization(self, controller):
        """Test controller initialization."""
        assert controller.controller_id == "test_controller"
        assert controller.mode == ControllerMode.SIMULATION
        assert controller._is_initialized is False
        assert controller._is_connected is False
        assert controller._is_calibrated is False
        assert controller._state == MotorState.DISCONNECTED
        assert len(controller._errors) == 0
    
    @pytest.mark.asyncio
    async def test_initialize_success(self, controller):
        """Test successful initialization."""
        result = await controller.initialize()
        
        assert result is True
        assert controller.initialize_called is True
        assert controller._is_initialized is True
        assert controller._is_connected is True
        assert controller._state == MotorState.IDLE
    
    @pytest.mark.asyncio
    async def test_initialize_failure(self, controller):
        """Test initialization failure."""
        controller.should_fail_initialize = True
        
        with pytest.raises(MotorControlError):
            await controller.initialize()
        
        assert controller.initialize_called is True
    
    @pytest.mark.asyncio
    async def test_set_position_success(self, controller):
        """Test successful position setting."""
        await controller.initialize()
        
        result = await controller.set_position(0.5, 1.0)
        
        assert result is True
        assert controller.set_position_called is True
        assert controller._target_position is not None
        assert controller._target_position.pitch_rad == 0.5
        assert controller._target_position.yaw_rad == 1.0
    
    @pytest.mark.asyncio
    async def test_set_position_failure(self, controller):
        """Test position setting failure."""
        await controller.initialize()
        controller.should_fail_set_position = True
        
        result = await controller.set_position(0.5, 1.0)
        
        assert result is False
        assert controller.set_position_called is True
    
    @pytest.mark.asyncio
    async def test_get_position_success(self, controller):
        """Test successful position reading."""
        await controller.initialize()
        controller.mock_position = (0.5, 1.0)
        
        pitch, yaw = await controller.get_position()
        
        assert pitch == 0.5
        assert yaw == 1.0
        assert controller.get_position_called is True
    
    @pytest.mark.asyncio
    async def test_get_position_failure(self, controller):
        """Test position reading failure."""
        await controller.initialize()
        controller.should_fail_get_position = True
        
        with pytest.raises(CommunicationError):
            await controller.get_position()
        
        assert controller.get_position_called is True
    
    @pytest.mark.asyncio
    async def test_get_status(self, controller):
        """Test status retrieval."""
        await controller.initialize()
        
        status = await controller.get_status()
        
        assert isinstance(status, ControllerStatus)
        assert status.is_connected is True
        assert status.mode == ControllerMode.SIMULATION
        assert status.state == MotorState.IDLE
        assert controller.get_status_called is True
    
    @pytest.mark.asyncio
    async def test_send_command(self, controller):
        """Test sending motor command."""
        await controller.initialize()
        
        command = MotorCommand(0.5, 1.0)
        result = await controller.send_command(command)
        
        assert result is True
        assert controller.set_position_called is True
    
    @pytest.mark.asyncio
    async def test_is_ready(self, controller):
        """Test ready state checking."""
        # Not ready initially
        ready = await controller.is_ready()
        assert ready is False
        
        # Ready after initialization
        await controller.initialize()
        ready = await controller.is_ready()
        assert ready is True
        
        # Not ready with errors
        controller.add_error("Test error")
        ready = await controller.is_ready()
        assert ready is False
    
    def test_add_error(self, controller):
        """Test error addition."""
        controller.add_error("Test error")
        
        assert "Test error" in controller._errors
        assert controller._state == MotorState.ERROR
    
    def test_clear_errors(self, controller):
        """Test error clearing."""
        controller._is_connected = True
        controller.add_error("Test error")
        
        assert len(controller._errors) > 0
        assert controller._state == MotorState.ERROR
        
        controller.clear_errors()
        
        assert len(controller._errors) == 0
        assert controller._state == MotorState.IDLE
    
    def test_update_position(self, controller):
        """Test position update."""
        controller._update_position(0.5, 1.0)
        
        assert controller._current_position.pitch_rad == 0.5
        assert controller._current_position.yaw_rad == 1.0
        assert isinstance(controller._current_position.timestamp, datetime)
    
    def test_set_target_position(self, controller):
        """Test target position setting."""
        controller._set_target_position(0.5, 1.0)
        
        assert controller._target_position is not None
        assert controller._target_position.pitch_rad == 0.5
        assert controller._target_position.yaw_rad == 1.0
    
    @pytest.mark.asyncio
    async def test_shutdown(self, controller):
        """Test controller shutdown."""
        await controller.initialize()
        await controller.shutdown()
        
        assert controller.shutdown_called is True
        assert controller._is_connected is False
        assert controller._state == MotorState.DISCONNECTED


class TestBaseMotorController:
    """Test BaseMotorController implementation."""
    
    class TestableBaseController(BaseMotorController):
        """Testable implementation of BaseMotorController."""
        
        def __init__(self):
            super().__init__("test_base", ControllerMode.SIMULATION)
            self.mock_position = (0.0, 0.0)
        
        async def initialize(self) -> bool:
            self._is_initialized = True
            self._is_connected = True
            self._state = MotorState.IDLE
            return True
        
        async def set_position(self, pitch_rad: float, yaw_rad: float) -> bool:
            self._set_target_position(pitch_rad, yaw_rad)
            self._update_position(pitch_rad, yaw_rad)
            return True
        
        async def get_position(self) -> tuple[float, float]:
            return self.mock_position
        
        async def shutdown(self) -> None:
            self._is_connected = False
            self._state = MotorState.DISCONNECTED
    
    @pytest.fixture
    def controller(self):
        """Create a testable base controller."""
        return self.TestableBaseController()
    
    @pytest.mark.asyncio
    async def test_wait_for_position_success(self, controller):
        """Test successful position waiting."""
        await controller.initialize()
        
        # Set mock position to target
        controller.mock_position = (0.5, 1.0)
        
        result = await controller.wait_for_position(0.5, 1.0, timeout=1.0)
        assert result is True
    
    @pytest.mark.asyncio
    async def test_wait_for_position_timeout(self, controller):
        """Test position waiting timeout."""
        await controller.initialize()
        
        # Set mock position far from target
        controller.mock_position = (0.0, 0.0)
        
        result = await controller.wait_for_position(1.0, 1.0, timeout=0.1)
        assert result is False
    
    def test_validate_position_valid(self, controller):
        """Test position validation with valid values."""
        # Should not raise exception
        controller._validate_position(0.5, 1.0)
        controller._validate_position(-1.0, -2.0)
        controller._validate_position(3.14, 6.28)
    
    def test_validate_position_invalid_pitch(self, controller):
        """Test position validation with invalid pitch."""
        with pytest.raises(ValueError, match="Pitch position .* out of range"):
            controller._validate_position(4.0, 1.0)  # > π
        
        with pytest.raises(ValueError, match="Pitch position .* out of range"):
            controller._validate_position(-4.0, 1.0)  # < -π
    
    def test_validate_position_invalid_yaw(self, controller):
        """Test position validation with unreasonable yaw."""
        with pytest.raises(ValueError, match="Yaw position .* seems unreasonable"):
            controller._validate_position(1.0, 200.0)  # Very large yaw
    
    def test_controller_with_custom_axis_config(self):
        """Test controller initialization with custom axis configuration."""
        pitch_config = AxisConfig(axis_index=0, gear_ratio=25.0)
        yaw_config = AxisConfig(axis_index=1, gear_ratio=15.0)
        dual_config = DualAxisConfig(pitch_axis=pitch_config, yaw_axis=yaw_config)
        
        controller = MockMotorController()
        controller.axis_config = dual_config
        
        assert controller.axis_config.pitch_axis.gear_ratio == 25.0
        assert controller.axis_config.yaw_axis.gear_ratio == 15.0
        assert controller.axis_config.pitch_axis.axis_index == 0
        assert controller.axis_config.yaw_axis.axis_index == 1
    
    def test_controller_default_axis_config(self):
        """Test controller initialization with default axis configuration."""
        controller = MockMotorController()
        
        # Should have default configuration
        assert controller.axis_config.pitch_axis.axis_index == 1
        assert controller.axis_config.yaw_axis.axis_index == 0
        assert controller.axis_config.pitch_axis.gear_ratio == 20.0
        assert controller.axis_config.yaw_axis.gear_ratio == 20.0


class TestAxisConfigIntegration:
    """Test integration of axis configuration with controllers."""
    
    def test_gear_ratio_calculations(self):
        """Test gear ratio calculations work correctly."""
        # Test with different gear ratios for each axis
        pitch_config = AxisConfig(axis_index=1, gear_ratio=25.0)
        yaw_config = AxisConfig(axis_index=0, gear_ratio=15.0)
        dual_config = DualAxisConfig(pitch_axis=pitch_config, yaw_axis=yaw_config)
        
        # Test pitch axis (25:1 ratio)
        pitch_turns = dual_config.pitch_axis.motor_turns_from_degrees(360.0)
        assert abs(pitch_turns - 25.0) < 0.001
        
        # Test yaw axis (15:1 ratio)  
        yaw_turns = dual_config.yaw_axis.motor_turns_from_degrees(360.0)
        assert abs(yaw_turns - 15.0) < 0.001
    
    def test_axis_index_mapping(self):
        """Test that axis indices can be configured flexibly."""
        # Test standard configuration (pitch=axis1, yaw=axis0)
        standard_config = DualAxisConfig()
        assert standard_config.get_axis_by_index(0) == standard_config.yaw_axis
        assert standard_config.get_axis_by_index(1) == standard_config.pitch_axis
        
        # Test swapped configuration (pitch=axis0, yaw=axis1)
        pitch_config = AxisConfig(axis_index=0)
        yaw_config = AxisConfig(axis_index=1)
        swapped_config = DualAxisConfig(pitch_axis=pitch_config, yaw_axis=yaw_config)
        
        assert swapped_config.get_axis_by_index(0) == swapped_config.pitch_axis
        assert swapped_config.get_axis_by_index(1) == swapped_config.yaw_axis
    
    def test_circular_setpoints_configuration(self):
        """Test circular setpoints configuration."""
        config = AxisConfig(axis_index=0, circular_setpoints=True)
        assert config.circular_setpoints is True
        
        config_no_circular = AxisConfig(axis_index=1, circular_setpoints=False)
        assert config_no_circular.circular_setpoints is False