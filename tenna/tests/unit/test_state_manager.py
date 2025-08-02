"""Unit tests for the simplified StateManager class."""

import asyncio
import pytest
from datetime import datetime

from app.services.state_manager import StateManager, GPSPosition
from app.services.state_containers import MotorState, GPSState, ErrorState
from app.models.motor import ControllerMode, MotorPosition


class TestStateManager:
    """Test cases for simplified StateManager class."""
    
    @pytest.fixture
    def state_manager(self):
        """Create a fresh StateManager instance for each test."""
        return StateManager()
    
    @pytest.mark.asyncio
    async def test_initialization(self, state_manager):
        """Test StateManager initialization."""
        mode = await state_manager.get_mode()
        assert mode == ControllerMode.SIMULATION
        
        current_position = await state_manager.get_current_position()
        assert current_position is None
        
        target_position = await state_manager.get_target_position()
        assert target_position is None
        
        errors = await state_manager.get_errors()
        assert errors == []
        
        has_errors = await state_manager.has_errors()
        assert not has_errors
        
        # Check default GPS positions
        antenna_pos = await state_manager.get_antenna_position_dict()
        assert antenna_pos["lat"] == 45.420109
        assert antenna_pos["lon"] == -75.680510
        assert antenna_pos["alt"] == 60
        
        rocket_pos = await state_manager.get_rocket_position_dict()
        assert rocket_pos["lat"] == 45.421413
        assert rocket_pos["lon"] == -75.680510
        assert rocket_pos["alt"] == 205
    
    @pytest.mark.asyncio
    async def test_mode_management(self, state_manager):
        """Test mode setting and getting."""
        # Test mode setter
        await state_manager.set_mode(ControllerMode.HARDWARE)
        mode = await state_manager.get_mode()
        assert mode == ControllerMode.HARDWARE
        
        # Test string setter
        result = await state_manager.set_mode_from_string("simulation")
        assert result
        mode = await state_manager.get_mode()
        assert mode == ControllerMode.SIMULATION
        
        result = await state_manager.set_mode_from_string("hardware")
        assert result
        mode = await state_manager.get_mode()
        assert mode == ControllerMode.HARDWARE
        
        result = await state_manager.set_mode_from_string("offline")
        assert result
        mode = await state_manager.get_mode()
        assert mode == ControllerMode.OFFLINE
        
        # Test invalid mode
        result = await state_manager.set_mode_from_string("invalid_mode")
        assert not result
        mode = await state_manager.get_mode()
        assert mode == ControllerMode.OFFLINE  # Should remain unchanged
    
    @pytest.mark.asyncio
    async def test_position_management(self, state_manager):
        """Test position setting and getting."""
        # Test setting current position
        position = MotorPosition(
            pitch_rad=0.5,
            yaw_rad=1.0,
            timestamp=datetime.now()
        )
        await state_manager.set_current_position(position)
        current = await state_manager.get_current_position()
        assert current == position
        
        # Test update_position method
        await state_manager.update_position(0.7, 1.2)
        current = await state_manager.get_current_position()
        assert current.pitch_rad == 0.7
        assert current.yaw_rad == 1.2
        
        # Test backward compatibility method
        pos_dict = await state_manager.get_current_position_dict()
        assert pos_dict["pitch"] == 0.7
        assert pos_dict["yaw"] == 1.2
    
    @pytest.mark.asyncio
    async def test_target_management(self, state_manager):
        """Test target position setting and getting."""
        # Test setting target position
        target = MotorPosition(
            pitch_rad=0.3,
            yaw_rad=0.8,
            timestamp=datetime.now()
        )
        await state_manager.set_target_position(target)
        current_target = await state_manager.get_target_position()
        assert current_target == target
        
        # Test set_target method
        await state_manager.set_target(0.4, 0.9)
        current_target = await state_manager.get_target_position()
        assert current_target.pitch_rad == 0.4
        assert current_target.yaw_rad == 0.9
        
        # Test manual target (backward compatibility)
        manual_target = {"pitch": 0.6, "yaw": 1.1}
        await state_manager.set_manual_target_rad(manual_target)
        retrieved_manual = await state_manager.get_manual_target_rad()
        assert retrieved_manual == manual_target
        
        # Should also update target_position
        updated_target = await state_manager.get_target_position()
        assert updated_target.pitch_rad == 0.6
        assert updated_target.yaw_rad == 1.1
    
    @pytest.mark.asyncio
    async def test_gps_position_management(self, state_manager):
        """Test GPS position management."""
        # Test antenna position set method
        await state_manager.set_antenna_position_gps(46.0, -76.0, 120)
        updated_antenna = await state_manager.get_antenna_position_gps()
        assert updated_antenna.lat == 46.0
        assert updated_antenna.lon == -76.0
        assert updated_antenna.alt == 120
        
        # Test backward compatibility
        antenna_dict = await state_manager.get_antenna_position_dict()
        assert antenna_dict["lat"] == 46.0
        assert antenna_dict["lon"] == -76.0
        assert antenna_dict["alt"] == 120
        
        # Test rocket position set method
        await state_manager.set_rocket_position_gps(46.1, -76.1, 220)
        updated_rocket = await state_manager.get_rocket_position_gps()
        assert updated_rocket.lat == 46.1
        assert updated_rocket.lon == -76.1
        assert updated_rocket.alt == 220
        
        # Test backward compatibility
        rocket_dict = await state_manager.get_rocket_position_dict()
        assert rocket_dict["lat"] == 46.1
        assert rocket_dict["lon"] == -76.1
        assert rocket_dict["alt"] == 220
    
    @pytest.mark.asyncio
    async def test_error_management(self, state_manager):
        """Test error tracking and management."""
        has_errors = await state_manager.has_errors()
        assert not has_errors
        
        errors = await state_manager.get_errors()
        assert errors == []
        
        # Add errors
        await state_manager.add_error("Test error 1")
        has_errors = await state_manager.has_errors()
        assert has_errors
        
        errors = await state_manager.get_errors()
        assert "Test error 1" in errors
        
        await state_manager.add_error("Test error 2")
        errors = await state_manager.get_errors()
        assert len(errors) == 2
        
        # Adding same error shouldn't duplicate
        await state_manager.add_error("Test error 1")
        errors = await state_manager.get_errors()
        assert len(errors) == 2
        
        # Remove specific error
        result = await state_manager.remove_error("Test error 1")
        assert result
        errors = await state_manager.get_errors()
        assert "Test error 1" not in errors
        assert "Test error 2" in errors
        
        # Try to remove non-existent error
        result = await state_manager.remove_error("Non-existent error")
        assert not result
        
        # Clear all errors
        await state_manager.clear_errors()
        has_errors = await state_manager.has_errors()
        assert not has_errors
        errors = await state_manager.get_errors()
        assert errors == []
        
        # Test error history
        await state_manager.add_error("Historical error")
        history = await state_manager.get_error_history()
        assert len(history) > 0
        assert history[-1][0] == "Historical error"
        assert isinstance(history[-1][1], datetime)
    
    @pytest.mark.asyncio
    async def test_state_snapshot(self, state_manager):
        """Test state snapshot functionality."""
        # Set up some state
        await state_manager.set_mode(ControllerMode.HARDWARE)
        await state_manager.update_position(0.5, 1.0)
        await state_manager.set_target(0.6, 1.1)
        await state_manager.add_error("Test error")
        
        # Get snapshot
        snapshot = await state_manager.get_state_snapshot()
        
        # Verify snapshot contents
        assert snapshot["motor"]["mode"] == "hardware"
        assert snapshot["motor"]["current_position"]["pitch_rad"] == 0.5
        assert snapshot["motor"]["current_position"]["yaw_rad"] == 1.0
        assert snapshot["motor"]["target_position"]["pitch_rad"] == 0.6
        assert snapshot["motor"]["target_position"]["yaw_rad"] == 1.1
        assert snapshot["errors"]["error_count"] == 1
        assert "gps" in snapshot
    



class TestGPSPosition:
    """Test cases for GPSPosition class."""
    
    def test_initialization(self):
        """Test GPSPosition initialization."""
        pos = GPSPosition(lat=45.0, lon=-75.0, alt=100)
        assert pos.lat == 45.0
        assert pos.lon == -75.0
        assert pos.alt == 100
        assert isinstance(pos.timestamp, datetime)
    
    def test_to_dict(self):
        """Test GPSPosition to_dict method."""
        pos = GPSPosition(lat=45.0, lon=-75.0, alt=100)
        pos_dict = pos.to_dict()
        
        assert pos_dict["lat"] == 45.0
        assert pos_dict["lon"] == -75.0
        assert pos_dict["alt"] == 100
        assert "timestamp" in pos_dict


class TestStateContainers:
    """Test cases for the simplified state containers."""
    
    def test_motor_state(self):
        """Test MotorState container."""
        motor_state = MotorState()
        assert motor_state.current_position is None
        assert motor_state.target_position is None
        assert motor_state.mode == ControllerMode.SIMULATION
        assert motor_state.manual_target_rad == {"pitch": 0.0, "yaw": 0.0}
        
        # Test to_dict
        state_dict = motor_state.to_dict()
        assert "current_position" in state_dict
        assert "target_position" in state_dict
        assert "mode" in state_dict
        assert "manual_target_rad" in state_dict
    
    def test_gps_state(self):
        """Test GPSState container."""
        gps_state = GPSState()
        assert gps_state.antenna_position is not None
        assert gps_state.rocket_position is not None
        
        # Test to_dict
        state_dict = gps_state.to_dict()
        assert "antenna_position" in state_dict
        assert "rocket_position" in state_dict
    
    def test_error_state(self):
        """Test ErrorState container."""
        error_state = ErrorState()
        assert error_state.errors == []
        assert error_state.history == []
        
        # Test to_dict
        state_dict = error_state.to_dict()
        assert "errors" in state_dict
        assert "error_count" in state_dict
        assert "history_count" in state_dict