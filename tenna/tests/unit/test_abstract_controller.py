"""Unit tests for simplified motor controller interface."""

import asyncio
import pytest
from datetime import datetime
from unittest.mock import AsyncMock, MagicMock

from app.controllers.base import MotorController
from app.core.exceptions import MotorControlError, CommunicationError
from app.models.motor import (
    AxisConfig, ControllerMode, ControllerStatus, DualAxisConfig,
    MotorCommand, MotorPosition, MotorState
)
from app.utils.result import Result


class MockMotorController(MotorController):
    """Mock implementation of MotorController for testing."""
    
    def __init__(self, controller_id: str = "test_controller"):
        super().__init__(controller_id, ControllerMode.SIMULATION)
        self.initialize_called = False
        self.set_position_called = False
        self.get_position_called = False
        self.shutdown_called = False
        self.should_fail_initialize = False
        self.should_fail_set_position = False
        self.should_fail_get_position = False
        self.mock_position = (0.0, 0.0)
    
    async def initialize(self) -> Result[None]:
        """Mock initialize implementation."""
        self.initialize_called = True
        if self.should_fail_initialize:
            return Result.err("Mock initialization failure")
        
        self._is_initialized = True
        self._is_connected = True
        self._state = MotorState.IDLE
        return Result.ok(None)
    
    async def set_position(self, pitch_rad: float, yaw_rad: float) -> Result[None]:
        """Mock set_position implementation."""
        self.set_position_called = True
        if self.should_fail_set_position:
            return Result.err("Mock position set failure")
        
        self._set_target_position(pitch_rad, yaw_rad)
        self._update_position(pitch_rad, yaw_rad)
        return Result.ok(None)
    
    async def get_position(self) -> Result[tuple[float, float]]:
        """Mock get_position implementation."""
        self.get_position_called = True
        if self.should_fail_get_position:
            return Result.err("Mock position read failure")
        
        return Result.ok(self.mock_position)
    
    async def shutdown(self) -> Result[None]:
        """Mock shutdown implementation."""
        self.shutdown_called = True
        self._is_connected = False
        self._state = MotorState.DISCONNECTED
        return Result.ok(None)


class TestMotorController:
    """Test simplified MotorController interface."""
    
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
        
        assert result.is_ok()
        assert controller.initialize_called is True
        assert controller._is_initialized is True
        assert controller._is_connected is True
        assert controller._state == MotorState.IDLE
    
    @pytest.mark.asyncio
    async def test_initialize_failure(self, controller):
        """Test initialization failure."""
        controller.should_fail_initialize = True
        
        result = await controller.initialize()
        
        assert result.is_err()
        assert "Mock initialization failure" in result.error
        assert controller.initialize_called is True
    
    @pytest.mark.asyncio
    async def test_set_position_success(self, controller):
        """Test successful position setting."""
        await controller.initialize()
        
        result = await controller.set_position(0.5, 1.0)
        
        assert result.is_ok()
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
        
        assert result.is_err()
        assert "Mock position set failure" in result.error
    
    @pytest.mark.asyncio
    async def test_get_position_success(self, controller):
        """Test successful position reading."""
        await controller.initialize()
        controller.mock_position = (0.5, 1.0)
        
        result = await controller.get_position()
        
        assert result.is_ok()
        pitch, yaw = result.unwrap()
        assert pitch == 0.5
        assert yaw == 1.0
        assert controller.get_position_called is True
    
    @pytest.mark.asyncio
    async def test_get_position_failure(self, controller):
        """Test position reading failure."""
        await controller.initialize()
        controller.should_fail_get_position = True
        
        result = await controller.get_position()
        
        assert result.is_err()
        assert "Mock position read failure" in result.error
        assert controller.get_position_called is True
    
    @pytest.mark.asyncio
    async def test_get_status(self, controller):
        """Test status retrieval."""
        await controller.initialize()
        
        result = await controller.get_status()
        
        assert result.is_ok()
        status = result.unwrap()
        assert isinstance(status, ControllerStatus)
        assert status.is_connected is True
        assert status.mode == ControllerMode.SIMULATION
        assert status.state == MotorState.IDLE
    
    @pytest.mark.asyncio
    async def test_send_command(self, controller):
        """Test sending motor command."""
        await controller.initialize()
        
        command = MotorCommand(0.5, 1.0)
        result = await controller.send_command(command)
        
        assert result.is_ok()
        assert controller.set_position_called is True
    
    @pytest.mark.asyncio
    async def test_is_ready(self, controller):
        """Test ready state checking."""
        # Not ready when not initialized
        assert await controller.is_ready() is False
        
        # Ready after initialization
        await controller.initialize()
        assert await controller.is_ready() is True
        
        # Not ready when in error state
        controller.add_error("Test error")
        assert await controller.is_ready() is False
    
    def test_error_management(self, controller):
        """Test error addition and clearing."""
        # Add error
        controller.add_error("Test error")
        assert "Test error" in controller._errors
        assert controller._state == MotorState.ERROR
        
        # Clear errors
        controller._is_connected = True
        controller.clear_errors()
        assert len(controller._errors) == 0
        assert controller._state == MotorState.IDLE
    
    def test_position_tracking(self, controller):
        """Test position tracking methods."""
        # Update position
        controller._update_position(0.5, 1.0)
        assert controller._current_position.pitch_rad == 0.5
        assert controller._current_position.yaw_rad == 1.0
        
        # Set target position
        controller._set_target_position(1.0, 2.0)
        assert controller._target_position.pitch_rad == 1.0
        assert controller._target_position.yaw_rad == 2.0
    
    def test_validate_position(self, controller):
        """Test position validation."""
        # Valid positions
        result = controller._validate_position(0.5, 1.0)
        assert result.is_ok()
        
        # Invalid pitch (out of range)
        result = controller._validate_position(10.0, 1.0)
        assert result.is_err()
        assert "out of range" in result.error
        
        # Invalid yaw (unreasonable value)
        result = controller._validate_position(0.5, 200.0)
        assert result.is_err()
        assert "unreasonable" in result.error
    
    @pytest.mark.asyncio
    async def test_wait_for_position_success(self, controller):
        """Test successful position waiting."""
        await controller.initialize()
        
        # Set mock position to target
        controller.mock_position = (0.5, 1.0)
        
        result = await controller.wait_for_position(0.5, 1.0, timeout=1.0)
        assert result.is_ok()
    
    @pytest.mark.asyncio
    async def test_wait_for_position_timeout(self, controller):
        """Test position waiting timeout."""
        await controller.initialize()
        
        # Set mock position far from target
        controller.mock_position = (0.0, 0.0)
        
        result = await controller.wait_for_position(1.0, 1.0, timeout=0.1)
        assert result.is_err()
        assert "timeout" in result.error.lower()
    
    @pytest.mark.asyncio
    async def test_shutdown(self, controller):
        """Test controller shutdown."""
        await controller.initialize()
        
        result = await controller.shutdown()
        
        assert result.is_ok()
        assert controller.shutdown_called is True
        assert controller._state == MotorState.DISCONNECTED