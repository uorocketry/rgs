"""Integration tests for position calculator with state manager."""

import math
import pytest
from datetime import datetime

from app.services.state_manager import state_manager, GPSPosition
from app.services.position_calculator import position_calculator
from app.models.motor import MotorPosition


class TestPositionCalculatorIntegration:
    """Integration tests for position calculator with state manager."""
    
    def setup_method(self):
        """Set up test fixtures."""
        # Reset state manager to clean state
        state_manager.clear_errors()
        
        # Set up test GPS positions
        self.antenna_gps = GPSPosition(
            lat=45.420109, 
            lon=-75.680510, 
            alt=60.0
        )
        
        self.rocket_gps = GPSPosition(
            lat=45.421413, 
            lon=-75.680510, 
            alt=205.0
        )
    
    def test_state_manager_gps_to_motor_position(self):
        """Test converting GPS positions from state manager to motor positions."""
        # Set GPS positions in state manager
        state_manager.antenna_position_gps = self.antenna_gps
        state_manager.rocket_position_gps = self.rocket_gps
        
        # Get GPS positions from state manager
        antenna_pos = state_manager.antenna_position_gps
        rocket_pos = state_manager.rocket_position_gps
        
        assert antenna_pos is not None
        assert rocket_pos is not None
        
        # Calculate motor position using position calculator
        motor_position = position_calculator.gps_to_motor_position(
            rocket_pos, 
            antenna_pos
        )
        
        # Verify result
        assert isinstance(motor_position, MotorPosition)
        assert motor_position.pitch_rad > 0  # Target is higher
        assert abs(motor_position.yaw_rad) < math.radians(10)  # Roughly north
        
        # Update state manager with calculated position
        state_manager.target_position = motor_position
        
        # Verify state manager was updated
        target_pos = state_manager.target_position
        assert target_pos is not None
        assert abs(target_pos.pitch_rad - motor_position.pitch_rad) < 0.001
        assert abs(target_pos.yaw_rad - motor_position.yaw_rad) < 0.001
    
    def test_gps_position_update_workflow(self):
        """Test complete workflow of GPS position updates."""
        # Initial state
        assert state_manager.antenna_position_gps is not None
        assert state_manager.rocket_position_gps is not None
        
        # Update rocket position (simulating tracking update)
        new_rocket_gps = GPSPosition(
            lat=45.422000,  # Moved further north
            lon=-75.680000,  # Moved slightly east
            alt=300.0       # Higher altitude
        )
        
        state_manager.rocket_position_gps = new_rocket_gps
        
        # Calculate new motor position
        antenna_pos = state_manager.antenna_position_gps
        rocket_pos = state_manager.rocket_position_gps
        
        motor_position = position_calculator.gps_to_motor_position(
            rocket_pos, 
            antenna_pos
        )
        
        # Verify the new position makes sense
        assert motor_position.pitch_rad > 0  # Still pointing up
        assert motor_position.yaw_rad > 0    # Now pointing slightly east of north
        
        # Update target position
        state_manager.target_position = motor_position
        
        # Verify state consistency
        target_pos = state_manager.target_position
        assert target_pos.pitch_rad == motor_position.pitch_rad
        assert target_pos.yaw_rad == motor_position.yaw_rad
    
    def test_calculation_info_with_state_manager_data(self):
        """Test calculation info using data from state manager."""
        # Set GPS positions
        state_manager.antenna_position_gps = self.antenna_gps
        state_manager.rocket_position_gps = self.rocket_gps
        
        # Get calculation info
        info = position_calculator.get_calculation_info(
            state_manager.rocket_position_gps,
            state_manager.antenna_position_gps
        )
        
        # Verify info structure
        assert "error" not in info
        assert "target_gps" in info
        assert "reference_gps" in info
        assert "cartesian" in info
        assert "spherical" in info
        assert "motor_position" in info
        assert "distances" in info
        assert "angles_deg" in info
        
        # Verify GPS data matches
        assert info["target_gps"]["lat"] == self.rocket_gps.lat
        assert info["target_gps"]["lon"] == self.rocket_gps.lon
        assert info["target_gps"]["alt"] == self.rocket_gps.alt
        
        assert info["reference_gps"]["lat"] == self.antenna_gps.lat
        assert info["reference_gps"]["lon"] == self.antenna_gps.lon
        assert info["reference_gps"]["alt"] == self.antenna_gps.alt
    
    def test_shortest_path_calculation_with_current_position(self):
        """Test shortest path calculation using current position from state manager."""
        # Set current motor position
        current_position = MotorPosition(
            pitch_rad=math.radians(30),
            yaw_rad=math.radians(90),  # Pointing east
            timestamp=datetime.now()
        )
        state_manager.current_position = current_position
        
        # Calculate target position from GPS
        state_manager.antenna_position_gps = self.antenna_gps
        state_manager.rocket_position_gps = self.rocket_gps
        
        target_motor_position = position_calculator.gps_to_motor_position(
            state_manager.rocket_position_gps,
            state_manager.antenna_position_gps
        )
        
        # Calculate shortest path for yaw
        current_yaw = state_manager.current_position.yaw_rad
        target_yaw = target_motor_position.yaw_rad
        
        shortest_path_yaw = position_calculator.calculate_shortest_path_yaw(
            current_yaw, 
            target_yaw
        )
        
        # Verify shortest path calculation
        assert isinstance(shortest_path_yaw, float)
        
        # The difference should be the shortest way around the circle
        yaw_diff = abs(shortest_path_yaw - current_yaw)
        assert yaw_diff <= math.pi  # Should never be more than 180 degrees
    
    def test_coordinate_validation_with_state_manager(self):
        """Test coordinate validation with state manager data."""
        # Valid coordinates (should pass)
        valid_gps = GPSPosition(lat=45.0, lon=-75.0, alt=100.0)
        assert position_calculator.validate_gps_coordinates(valid_gps) is True
        
        # Set valid coordinates in state manager
        state_manager.antenna_position_gps = valid_gps
        assert state_manager.antenna_position_gps.lat == 45.0
        
        # Invalid coordinates (should fail validation)
        invalid_gps = GPSPosition(lat=91.0, lon=-75.0, alt=100.0)  # Invalid latitude
        assert position_calculator.validate_gps_coordinates(invalid_gps) is False
        
        # State manager should still accept invalid coordinates (validation is separate)
        state_manager.rocket_position_gps = invalid_gps
        assert state_manager.rocket_position_gps.lat == 91.0
        
        # But calculation info should report the error
        info = position_calculator.get_calculation_info(
            state_manager.rocket_position_gps,
            state_manager.antenna_position_gps
        )
        
        assert "error" in info
        assert "Invalid GPS coordinates" in info["error"]
    
    def test_distance_calculations_with_state_data(self):
        """Test distance calculations using state manager data."""
        # Set GPS positions
        state_manager.antenna_position_gps = self.antenna_gps
        state_manager.rocket_position_gps = self.rocket_gps
        
        # Calculate distances
        horizontal_distance = position_calculator.calculate_horizontal_distance(
            state_manager.rocket_position_gps,
            state_manager.antenna_position_gps
        )
        
        distance_3d = position_calculator.calculate_distance_3d(
            state_manager.rocket_position_gps,
            state_manager.antenna_position_gps
        )
        
        # Verify distances
        assert horizontal_distance > 0
        assert distance_3d > horizontal_distance  # 3D should be longer
        
        # Verify altitude difference
        altitude_diff = (state_manager.rocket_position_gps.alt - 
                        state_manager.antenna_position_gps.alt)
        assert altitude_diff == 145.0  # From test data
        
        # Verify 3D distance using Pythagorean theorem
        expected_3d = math.sqrt(horizontal_distance**2 + altitude_diff**2)
        assert abs(distance_3d - expected_3d) < 0.001
    
    def teardown_method(self):
        """Clean up after each test."""
        # Reset state manager to default values
        state_manager.clear_errors()
        state_manager.current_position = None
        state_manager.target_position = None