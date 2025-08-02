"""Unit tests for the StateManager class."""

import asyncio
import pytest
import threading
import time
from datetime import datetime
from unittest.mock import Mock

from app.services.state_manager import (
    StateManager, StateChangeEvent, StateChangeNotification, GPSPosition
)
from app.models.motor import ControllerMode, MotorPosition


class TestStateManager:
    """Test cases for StateManager class."""
    
    @pytest.fixture
    def state_manager(self):
        """Create a fresh StateManager instance for each test."""
        return StateManager()
    
    def test_initialization(self, state_manager):
        """Test StateManager initialization."""
        assert state_manager.mode == ControllerMode.SIMULATION
        assert state_manager.current_position is None
        assert state_manager.target_position is None
        assert state_manager.errors == []
        assert state_manager.logs == []
        assert not state_manager.has_errors()
        
        # Check default GPS positions
        antenna_pos = state_manager.get_antenna_position_dict()
        assert antenna_pos["lat"] == 45.420109
        assert antenna_pos["lon"] == -75.680510
        assert antenna_pos["alt"] == 60
        
        rocket_pos = state_manager.get_rocket_position_dict()
        assert rocket_pos["lat"] == 45.421413
        assert rocket_pos["lon"] == -75.680510
        assert rocket_pos["alt"] == 205
    
    def test_context_manager_sync(self, state_manager):
        """Test synchronous context manager functionality."""
        with state_manager as sm:
            assert sm is state_manager
            # Should be able to access state within context
            assert sm.mode == ControllerMode.SIMULATION
    
    @pytest.mark.asyncio
    async def test_context_manager_async(self, state_manager):
        """Test asynchronous context manager functionality."""
        async with state_manager as sm:
            assert sm is state_manager
            # Should be able to access state within context
            assert sm.mode == ControllerMode.SIMULATION
    
    def test_mode_management(self, state_manager):
        """Test mode setting and getting."""
        # Test property setter
        state_manager.mode = ControllerMode.HARDWARE
        assert state_manager.mode == ControllerMode.HARDWARE
        
        # Test string setter
        assert state_manager.set_mode("simulation")
        assert state_manager.mode == ControllerMode.SIMULATION
        
        assert state_manager.set_mode("hardware")
        assert state_manager.mode == ControllerMode.HARDWARE
        
        assert state_manager.set_mode("offline")
        assert state_manager.mode == ControllerMode.OFFLINE
        
        # Test invalid mode
        assert not state_manager.set_mode("invalid_mode")
        assert state_manager.mode == ControllerMode.OFFLINE  # Should remain unchanged
    
    def test_position_management(self, state_manager):
        """Test position setting and getting."""
        # Test setting current position
        position = MotorPosition(
            pitch_rad=0.5,
            yaw_rad=1.0,
            timestamp=datetime.now()
        )
        state_manager.current_position = position
        assert state_manager.current_position == position
        
        # Test update_position method
        state_manager.update_position(0.7, 1.2)
        current = state_manager.current_position
        assert current.pitch_rad == 0.7
        assert current.yaw_rad == 1.2
        
        # Test backward compatibility method
        pos_dict = state_manager.get_current_position_dict()
        assert pos_dict["pitch"] == 0.7
        assert pos_dict["yaw"] == 1.2
    
    def test_target_management(self, state_manager):
        """Test target position setting and getting."""
        # Test setting target position
        target = MotorPosition(
            pitch_rad=0.3,
            yaw_rad=0.8,
            timestamp=datetime.now()
        )
        state_manager.target_position = target
        assert state_manager.target_position == target
        
        # Test set_target method
        state_manager.set_target(0.4, 0.9)
        current_target = state_manager.target_position
        assert current_target.pitch_rad == 0.4
        assert current_target.yaw_rad == 0.9
        
        # Test manual target (backward compatibility)
        manual_target = {"pitch": 0.6, "yaw": 1.1}
        state_manager.manual_target_rad = manual_target
        assert state_manager.manual_target_rad == manual_target
        
        # Should also update target_position
        updated_target = state_manager.target_position
        assert updated_target.pitch_rad == 0.6
        assert updated_target.yaw_rad == 1.1
    
    def test_gps_position_management(self, state_manager):
        """Test GPS position management."""
        # Test antenna position
        antenna_pos = GPSPosition(lat=45.5, lon=-75.7, alt=100)
        state_manager.antenna_position_gps = antenna_pos
        assert state_manager.antenna_position_gps == antenna_pos
        
        # Test set method
        state_manager.set_antenna_position_gps(46.0, -76.0, 120)
        updated_antenna = state_manager.antenna_position_gps
        assert updated_antenna.lat == 46.0
        assert updated_antenna.lon == -76.0
        assert updated_antenna.alt == 120
        
        # Test backward compatibility
        antenna_dict = state_manager.get_antenna_position_dict()
        assert antenna_dict["lat"] == 46.0
        assert antenna_dict["lon"] == -76.0
        assert antenna_dict["alt"] == 120
        
        # Test rocket position
        rocket_pos = GPSPosition(lat=45.6, lon=-75.8, alt=200)
        state_manager.rocket_position_gps = rocket_pos
        assert state_manager.rocket_position_gps == rocket_pos
        
        # Test set method
        state_manager.set_rocket_position_gps(46.1, -76.1, 220)
        updated_rocket = state_manager.rocket_position_gps
        assert updated_rocket.lat == 46.1
        assert updated_rocket.lon == -76.1
        assert updated_rocket.alt == 220
        
        # Test backward compatibility
        rocket_dict = state_manager.get_rocket_position_dict()
        assert rocket_dict["lat"] == 46.1
        assert rocket_dict["lon"] == -76.1
        assert rocket_dict["alt"] == 220
    
    def test_error_management(self, state_manager):
        """Test error tracking and management."""
        assert not state_manager.has_errors()
        assert state_manager.errors == []
        
        # Add errors
        state_manager.add_error("Test error 1")
        assert state_manager.has_errors()
        assert "Test error 1" in state_manager.errors
        
        state_manager.add_error("Test error 2")
        assert len(state_manager.errors) == 2
        
        # Adding same error shouldn't duplicate
        state_manager.add_error("Test error 1")
        assert len(state_manager.errors) == 2
        
        # Remove specific error
        assert state_manager.remove_error("Test error 1")
        assert "Test error 1" not in state_manager.errors
        assert "Test error 2" in state_manager.errors
        
        # Try to remove non-existent error
        assert not state_manager.remove_error("Non-existent error")
        
        # Clear all errors
        state_manager.clear_errors()
        assert not state_manager.has_errors()
        assert state_manager.errors == []
        
        # Test error history
        state_manager.add_error("Historical error")
        history = state_manager.get_error_history()
        assert len(history) > 0
        assert history[-1][0] == "Historical error"
        assert isinstance(history[-1][1], datetime)
    
    def test_logging_management(self, state_manager):
        """Test logging functionality."""
        assert state_manager.logs == []
        
        # Add logs
        state_manager.add_log("Test log message 1")
        state_manager.add_log("Test log message 2")
        
        logs = state_manager.logs
        assert len(logs) == 2
        assert "Test log message 1" in logs[0]
        assert "Test log message 2" in logs[1]
        
        # Test recent logs
        recent = state_manager.get_recent_logs(1)
        assert len(recent) == 1
        assert "Test log message 2" in recent[0]
        
        # Clear logs
        state_manager.clear_logs()
        assert state_manager.logs == []
    
    def test_event_handling(self, state_manager):
        """Test event subscription and notification."""
        # Create mock handlers
        mode_handler = Mock()
        position_handler = Mock()
        global_handler = Mock()
        
        # Subscribe handlers
        state_manager.subscribe(StateChangeEvent.MODE_CHANGED, mode_handler)
        state_manager.subscribe(StateChangeEvent.POSITION_UPDATED, position_handler)
        state_manager.subscribe_all(global_handler)
        
        # Trigger mode change
        state_manager.mode = ControllerMode.HARDWARE
        
        # Check that appropriate handlers were called
        mode_handler.assert_called_once()
        global_handler.assert_called_once()
        position_handler.assert_not_called()
        
        # Reset mocks
        mode_handler.reset_mock()
        global_handler.reset_mock()
        
        # Trigger position change
        state_manager.update_position(0.5, 1.0)
        
        # Check that appropriate handlers were called
        position_handler.assert_called_once()
        global_handler.assert_called_once()
        mode_handler.assert_not_called()
        
        # Test unsubscribe
        state_manager.unsubscribe(StateChangeEvent.MODE_CHANGED, mode_handler)
        state_manager.mode = ControllerMode.SIMULATION
        
        # Mode handler should not be called, but global should
        mode_handler.assert_not_called()
        global_handler.assert_called()
        
        # Test unsubscribe all
        global_handler.reset_mock()
        state_manager.unsubscribe_all(global_handler)
        state_manager.mode = ControllerMode.HARDWARE
        
        # Global handler should not be called
        global_handler.assert_not_called()
    
    def test_event_notification_details(self, state_manager):
        """Test that event notifications contain correct details."""
        handler = Mock()
        state_manager.subscribe(StateChangeEvent.MODE_CHANGED, handler)
        
        # Change mode
        state_manager.mode = ControllerMode.HARDWARE
        
        # Check notification details
        handler.assert_called_once()
        notification = handler.call_args[0][0]
        assert isinstance(notification, StateChangeNotification)
        assert notification.event_type == StateChangeEvent.MODE_CHANGED
        assert notification.old_value == ControllerMode.SIMULATION
        assert notification.new_value == ControllerMode.HARDWARE
        assert isinstance(notification.timestamp, datetime)
    
    def test_thread_safety(self, state_manager):
        """Test thread-safe access to state."""
        results = []
        errors = []
        
        def worker_thread(thread_id):
            """Worker function for thread safety test."""
            try:
                for i in range(100):
                    # Mix of read and write operations
                    state_manager.update_position(i * 0.01, i * 0.02)
                    pos = state_manager.get_current_position_dict()
                    state_manager.add_log(f"Thread {thread_id} iteration {i}")
                    
                    if i % 10 == 0:
                        state_manager.mode = ControllerMode.HARDWARE if i % 20 == 0 else ControllerMode.SIMULATION
                    
                    # Small delay to increase chance of race conditions
                    time.sleep(0.001)
                
                results.append(f"Thread {thread_id} completed")
            except Exception as e:
                errors.append(f"Thread {thread_id} error: {e}")
        
        # Create and start multiple threads
        threads = []
        for i in range(5):
            thread = threading.Thread(target=worker_thread, args=(i,))
            threads.append(thread)
            thread.start()
        
        # Wait for all threads to complete
        for thread in threads:
            thread.join()
        
        # Check results
        assert len(errors) == 0, f"Thread safety errors: {errors}"
        assert len(results) == 5, f"Expected 5 completed threads, got {len(results)}"
        
        # Verify state is still consistent
        assert isinstance(state_manager.mode, ControllerMode)
        assert len(state_manager.logs) > 0
        assert state_manager.current_position is not None
    
    def test_concurrent_event_handling(self, state_manager):
        """Test concurrent event handling doesn't cause deadlocks."""
        handler_calls = []
        
        def slow_handler(notification):
            """Handler that takes some time to process."""
            time.sleep(0.01)  # Simulate slow processing
            handler_calls.append(notification.event_type.value)
        
        # Subscribe handler to all events
        state_manager.subscribe_all(slow_handler)
        
        def trigger_events():
            """Function to trigger multiple events."""
            for i in range(10):
                state_manager.update_position(i * 0.1, i * 0.2)
                state_manager.add_log(f"Event trigger {i}")
                if i % 3 == 0:
                    state_manager.mode = ControllerMode.HARDWARE if i % 6 == 0 else ControllerMode.SIMULATION
        
        # Run event triggering in multiple threads
        threads = []
        for i in range(3):
            thread = threading.Thread(target=trigger_events)
            threads.append(thread)
            thread.start()
        
        # Wait for completion
        for thread in threads:
            thread.join()
        
        # Give handlers time to complete
        time.sleep(0.5)
        
        # Verify handlers were called
        assert len(handler_calls) > 0
    
    def test_state_snapshot(self, state_manager):
        """Test state snapshot functionality."""
        # Set up some state
        state_manager.mode = ControllerMode.HARDWARE
        state_manager.update_position(0.5, 1.0)
        state_manager.set_target(0.6, 1.1)
        state_manager.add_error("Test error")
        state_manager.add_log("Test log")
        
        # Get snapshot
        snapshot = state_manager.get_state_snapshot()
        
        # Verify snapshot contents
        assert snapshot["mode"] == "hardware"
        assert snapshot["current_position"]["pitch_rad"] == 0.5
        assert snapshot["current_position"]["yaw_rad"] == 1.0
        assert snapshot["target_position"]["pitch_rad"] == 0.6
        assert snapshot["target_position"]["yaw_rad"] == 1.1
        assert snapshot["error_count"] == 1
        assert snapshot["log_count"] == 1
        assert "errors" in snapshot
        assert "antenna_position_gps" in snapshot
        assert "rocket_position_gps" in snapshot
    
    def test_change_history(self, state_manager):
        """Test state change history tracking."""
        # Make some changes
        state_manager.mode = ControllerMode.HARDWARE
        state_manager.update_position(0.5, 1.0)
        state_manager.add_error("Test error")
        
        # Get change history
        history = state_manager.get_change_history()
        
        # Verify history
        assert len(history) >= 3
        
        # Check that we have the expected event types
        event_types = [change["event_type"] for change in history]
        assert "mode_changed" in event_types
        assert "position_updated" in event_types
        assert "error_occurred" in event_types
        
        # Verify history entries have required fields
        for change in history:
            assert "event_type" in change
            assert "old_value" in change
            assert "new_value" in change
            assert "timestamp" in change
            assert "metadata" in change
    
    def test_cleanup(self, state_manager):
        """Test cleanup functionality."""
        # Add lots of data to trigger cleanup
        for i in range(150):
            state_manager.add_log(f"Log {i}")
            state_manager.update_position(i * 0.01, i * 0.02)
            if i % 10 == 0:
                state_manager.add_error(f"Error {i}")
                state_manager.clear_errors()  # To add to error history
        
        # Perform cleanup
        state_manager.cleanup()
        
        # Verify cleanup worked (should have trimmed to max limits)
        assert len(state_manager.logs) <= 1000
        assert len(state_manager.get_change_history(200)) <= 100
        assert len(state_manager.get_error_history()) <= 100
    
    def test_error_in_event_handler(self, state_manager):
        """Test that errors in event handlers don't break the state manager."""
        def failing_handler(notification):
            raise Exception("Handler error")
        
        def working_handler(notification):
            working_handler.called = True
        
        working_handler.called = False
        
        # Subscribe both handlers
        state_manager.subscribe(StateChangeEvent.MODE_CHANGED, failing_handler)
        state_manager.subscribe(StateChangeEvent.MODE_CHANGED, working_handler)
        
        # Trigger event - should not raise exception
        state_manager.mode = ControllerMode.HARDWARE
        
        # Working handler should still be called
        assert working_handler.called
        
        # State should still be updated
        assert state_manager.mode == ControllerMode.HARDWARE


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


class TestStateChangeNotification:
    """Test cases for StateChangeNotification class."""
    
    def test_initialization(self):
        """Test StateChangeNotification initialization."""
        notification = StateChangeNotification(
            event_type=StateChangeEvent.MODE_CHANGED,
            old_value=ControllerMode.SIMULATION,
            new_value=ControllerMode.HARDWARE
        )
        
        assert notification.event_type == StateChangeEvent.MODE_CHANGED
        assert notification.old_value == ControllerMode.SIMULATION
        assert notification.new_value == ControllerMode.HARDWARE
        assert isinstance(notification.timestamp, datetime)
        assert notification.metadata == {}
    
    def test_with_metadata(self):
        """Test StateChangeNotification with metadata."""
        metadata = {"source": "test", "priority": "high"}
        notification = StateChangeNotification(
            event_type=StateChangeEvent.ERROR_OCCURRED,
            old_value=None,
            new_value="Test error",
            metadata=metadata
        )
        
        assert notification.metadata == metadata