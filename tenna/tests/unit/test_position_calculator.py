"""Unit tests for position calculation service."""

import math
import pytest
from datetime import datetime
from unittest.mock import patch

from app.services.position_calculator import (
    PositionCalculator, CartesianPosition, SphericalPosition, position_calculator
)
from app.services.state_manager import GPSPosition
from app.models.motor import MotorPosition


class TestPositionCalculator:
    """Test cases for PositionCalculator class."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.calculator = PositionCalculator()
        
        # Test GPS positions (Ottawa area)
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
        
        # Expected values calculated manually/verified
        self.expected_distance_horizontal = 144.9  # meters (approximately)
        self.expected_altitude_diff = 145.0  # meters
        self.expected_azimuth_deg = 0.0  # North (approximately)
    
    def test_initialization(self):
        """Test calculator initialization."""
        calc = PositionCalculator()
        assert calc.EARTH_RADIUS_M == 6371000.0
    
    def test_global_instance(self):
        """Test global position calculator instance."""
        assert position_calculator is not None
        assert isinstance(position_calculator, PositionCalculator)
    
    def test_gps_to_cartesian_basic(self):
        """Test basic GPS to Cartesian conversion."""
        cartesian = self.calculator.gps_to_cartesian(
            self.rocket_gps, 
            self.antenna_gps
        )
        
        # Check types and structure
        assert isinstance(cartesian, CartesianPosition)
        assert isinstance(cartesian.x, float)
        assert isinstance(cartesian.y, float)
        assert isinstance(cartesian.z, float)
        assert isinstance(cartesian.timestamp, datetime)
        
        # Check altitude difference (should be exact)
        assert abs(cartesian.z - self.expected_altitude_diff) < 0.1
        
        # Check that we're moving roughly north (y should be positive, x near zero)
        assert cartesian.y > 0
        assert abs(cartesian.x) < 10  # Should be very small for due north
        
        # Check approximate horizontal distance
        horizontal_dist = math.sqrt(cartesian.x ** 2 + cartesian.y ** 2)
        assert abs(horizontal_dist - self.expected_distance_horizontal) < 5.0
    
    def test_gps_to_cartesian_same_position(self):
        """Test GPS to Cartesian with same position."""
        cartesian = self.calculator.gps_to_cartesian(
            self.antenna_gps, 
            self.antenna_gps
        )
        
        # Should be at origin
        assert abs(cartesian.x) < 0.001
        assert abs(cartesian.y) < 0.001
        assert abs(cartesian.z) < 0.001
    
    def test_gps_to_cartesian_east_west(self):
        """Test GPS to Cartesian for east-west movement."""
        # Position to the east
        east_gps = GPSPosition(
            lat=self.antenna_gps.lat,  # Same latitude
            lon=self.antenna_gps.lon + 0.001,  # East
            alt=self.antenna_gps.alt
        )
        
        cartesian = self.calculator.gps_to_cartesian(east_gps, self.antenna_gps)
        
        # Should be positive X (east), minimal Y (north), zero Z
        assert cartesian.x > 0
        assert abs(cartesian.y) < 1.0  # Should be very small
        assert abs(cartesian.z) < 0.001
        
        # Position to the west
        west_gps = GPSPosition(
            lat=self.antenna_gps.lat,
            lon=self.antenna_gps.lon - 0.001,  # West
            alt=self.antenna_gps.alt
        )
        
        cartesian = self.calculator.gps_to_cartesian(west_gps, self.antenna_gps)
        
        # Should be negative X (west)
        assert cartesian.x < 0
        assert abs(cartesian.y) < 1.0
        assert abs(cartesian.z) < 0.001
    
    def test_cartesian_to_spherical_basic(self):
        """Test Cartesian to spherical conversion."""
        # Test point to the north and up
        cartesian = CartesianPosition(
            x=0.0,      # No east-west component
            y=100.0,    # 100m north
            z=100.0,    # 100m up
            timestamp=datetime.now()
        )
        
        spherical = self.calculator.cartesian_to_spherical(cartesian)
        
        # Check types
        assert isinstance(spherical, SphericalPosition)
        assert isinstance(spherical.azimuth_rad, float)
        assert isinstance(spherical.elevation_rad, float)
        assert isinstance(spherical.range_m, float)
        
        # Check azimuth (should be 0 for due north)
        assert abs(spherical.azimuth_rad) < 0.001
        
        # Check elevation (should be 45 degrees for equal horizontal and vertical)
        expected_elevation = math.atan2(100, 100)  # 45 degrees
        assert abs(spherical.elevation_rad - expected_elevation) < 0.001
        
        # Check range
        expected_range = math.sqrt(100**2 + 100**2)  # ~141.42m
        assert abs(spherical.range_m - expected_range) < 0.001
    
    def test_cartesian_to_spherical_cardinal_directions(self):
        """Test spherical conversion for cardinal directions."""
        test_cases = [
            # (x, y, z, expected_azimuth_deg, description)
            (0, 100, 0, 0, "North"),
            (100, 0, 0, 90, "East"),
            (0, -100, 0, 180, "South"),
            (-100, 0, 0, -90, "West"),
        ]
        
        for x, y, z, expected_azimuth_deg, description in test_cases:
            cartesian = CartesianPosition(x=x, y=y, z=z, timestamp=datetime.now())
            spherical = self.calculator.cartesian_to_spherical(cartesian)
            
            azimuth_deg = math.degrees(spherical.azimuth_rad)
            
            # Handle angle wrapping for comparison
            if expected_azimuth_deg == 180:
                # South can be ±180
                assert abs(abs(azimuth_deg) - 180) < 1, f"Failed for {description}"
            else:
                assert abs(azimuth_deg - expected_azimuth_deg) < 1, f"Failed for {description}"
    
    def test_cartesian_to_spherical_vertical(self):
        """Test spherical conversion for vertical positions."""
        # Directly above
        cartesian_up = CartesianPosition(x=0, y=0, z=100, timestamp=datetime.now())
        spherical_up = self.calculator.cartesian_to_spherical(cartesian_up)
        
        assert abs(spherical_up.elevation_rad - math.pi/2) < 0.001  # 90 degrees
        assert spherical_up.range_m == 100
        
        # Directly below
        cartesian_down = CartesianPosition(x=0, y=0, z=-100, timestamp=datetime.now())
        spherical_down = self.calculator.cartesian_to_spherical(cartesian_down)
        
        assert abs(spherical_down.elevation_rad + math.pi/2) < 0.001  # -90 degrees
        assert spherical_down.range_m == 100
    
    def test_gps_to_spherical_integration(self):
        """Test integrated GPS to spherical conversion."""
        spherical = self.calculator.gps_to_spherical(
            self.rocket_gps, 
            self.antenna_gps
        )
        
        # Check types
        assert isinstance(spherical, SphericalPosition)
        
        # Check that azimuth is roughly north (0 degrees)
        azimuth_deg = math.degrees(spherical.azimuth_rad)
        assert abs(azimuth_deg) < 5  # Within 5 degrees of north
        
        # Check that elevation is positive (target is higher)
        assert spherical.elevation_rad > 0
        
        # Check range is reasonable
        assert 100 < spherical.range_m < 300
    
    def test_spherical_to_motor_position(self):
        """Test spherical to motor position conversion."""
        spherical = SphericalPosition(
            azimuth_rad=math.radians(45),    # 45 degrees
            elevation_rad=math.radians(30),  # 30 degrees
            range_m=200,
            timestamp=datetime.now()
        )
        
        motor_pos = self.calculator.spherical_to_motor_position(spherical)
        
        # Check types
        assert isinstance(motor_pos, MotorPosition)
        
        # Check that angles are preserved (no offset)
        assert abs(motor_pos.yaw_rad - spherical.azimuth_rad) < 0.001
        assert abs(motor_pos.pitch_rad - spherical.elevation_rad) < 0.001
    
    def test_spherical_to_motor_position_with_offsets(self):
        """Test spherical to motor position conversion with offsets."""
        spherical = SphericalPosition(
            azimuth_rad=0,  # North
            elevation_rad=0,  # Horizon
            range_m=100,
            timestamp=datetime.now()
        )
        
        pitch_offset = math.radians(10)  # 10 degrees
        yaw_offset = math.radians(15)    # 15 degrees
        
        motor_pos = self.calculator.spherical_to_motor_position(
            spherical, 
            pitch_offset_rad=pitch_offset,
            yaw_offset_rad=yaw_offset
        )
        
        # Check that offsets are applied
        assert abs(motor_pos.pitch_rad - pitch_offset) < 0.001
        assert abs(motor_pos.yaw_rad - yaw_offset) < 0.001
    
    def test_gps_to_motor_position_integration(self):
        """Test full GPS to motor position conversion."""
        motor_pos = self.calculator.gps_to_motor_position(
            self.rocket_gps,
            self.antenna_gps
        )
        
        # Check types
        assert isinstance(motor_pos, MotorPosition)
        assert isinstance(motor_pos.pitch_rad, float)
        assert isinstance(motor_pos.yaw_rad, float)
        assert isinstance(motor_pos.timestamp, datetime)
        
        # Check that pitch is positive (target is higher)
        assert motor_pos.pitch_rad > 0
        
        # Check that yaw is roughly north (close to 0)
        assert abs(motor_pos.yaw_rad) < math.radians(10)  # Within 10 degrees
    
    def test_calculate_shortest_path_yaw(self):
        """Test shortest path calculation for yaw angles."""
        test_cases = [
            # (current, target, expected_adjusted, description)
            (0, math.pi/2, math.pi/2, "Quarter turn clockwise"),
            (0, -math.pi/2, -math.pi/2, "Quarter turn counter-clockwise"),
            (0, math.pi, math.pi, "Half turn (either direction)"),
            (0, 3*math.pi/2, -math.pi/2, "3/4 turn -> 1/4 turn counter-clockwise"),
            (math.pi/2, -math.pi/2, -math.pi/2, "From 90° to -90° -> shortest path is -90°"),
            (-math.pi/2, math.pi/2, math.pi/2, "From -90° to 90° -> shortest path is 90°"),
        ]
        
        for current, target, expected, description in test_cases:
            result = self.calculator.calculate_shortest_path_yaw(current, target)
            
            # Check that the result is close to expected
            diff = abs(result - expected)
            if diff > math.pi:
                diff = 2*math.pi - diff
            
            assert diff < 0.001, f"Failed for {description}: got {result}, expected {expected}"
    
    def test_normalize_angle(self):
        """Test angle normalization."""
        test_cases = [
            (0, 0),
            (math.pi, math.pi),
            (-math.pi, -math.pi),
            (2*math.pi, 0),
            (-2*math.pi, 0),
            (3*math.pi, math.pi),  # 3π normalizes to π, not -π
            (-3*math.pi, -math.pi),  # -3π normalizes to -π, not π
            (5*math.pi, math.pi),  # 5π normalizes to π, not -π
        ]
        
        for input_angle, expected in test_cases:
            result = self.calculator.normalize_angle(input_angle)
            # For π and -π, both are valid (they're the same angle)
            if abs(abs(result) - math.pi) < 0.001 and abs(abs(expected) - math.pi) < 0.001:
                # Both result and expected are ±π, which is acceptable
                pass
            else:
                assert abs(result - expected) < 0.001, f"Failed for {input_angle}: got {result}, expected {expected}"
            
            # Check that result is in valid range
            assert -math.pi <= result <= math.pi
    
    def test_validate_gps_coordinates(self):
        """Test GPS coordinate validation."""
        # Valid coordinates
        valid_gps = GPSPosition(lat=45.0, lon=-75.0, alt=100.0)
        assert self.calculator.validate_gps_coordinates(valid_gps) is True
        
        # Invalid latitude (too high)
        invalid_lat_high = GPSPosition(lat=91.0, lon=-75.0, alt=100.0)
        assert self.calculator.validate_gps_coordinates(invalid_lat_high) is False
        
        # Invalid latitude (too low)
        invalid_lat_low = GPSPosition(lat=-91.0, lon=-75.0, alt=100.0)
        assert self.calculator.validate_gps_coordinates(invalid_lat_low) is False
        
        # Invalid longitude (too high)
        invalid_lon_high = GPSPosition(lat=45.0, lon=181.0, alt=100.0)
        assert self.calculator.validate_gps_coordinates(invalid_lon_high) is False
        
        # Invalid longitude (too low)
        invalid_lon_low = GPSPosition(lat=45.0, lon=-181.0, alt=100.0)
        assert self.calculator.validate_gps_coordinates(invalid_lon_low) is False
        
        # Invalid altitude (too high)
        invalid_alt_high = GPSPosition(lat=45.0, lon=-75.0, alt=60000.0)
        assert self.calculator.validate_gps_coordinates(invalid_alt_high) is False
        
        # Invalid altitude (too low)
        invalid_alt_low = GPSPosition(lat=45.0, lon=-75.0, alt=-2000.0)
        assert self.calculator.validate_gps_coordinates(invalid_alt_low) is False
        
        # Edge cases (should be valid)
        edge_cases = [
            GPSPosition(lat=90.0, lon=180.0, alt=50000.0),
            GPSPosition(lat=-90.0, lon=-180.0, alt=-1000.0),
            GPSPosition(lat=0.0, lon=0.0, alt=0.0),
        ]
        
        for gps in edge_cases:
            assert self.calculator.validate_gps_coordinates(gps) is True
    
    def test_calculate_distance_3d(self):
        """Test 3D distance calculation."""
        distance = self.calculator.calculate_distance_3d(
            self.rocket_gps,
            self.antenna_gps
        )
        
        # Should be greater than altitude difference (hypotenuse)
        assert distance > self.expected_altitude_diff
        
        # Should be reasonable for the test case
        assert 150 < distance < 250
    
    def test_calculate_horizontal_distance(self):
        """Test horizontal distance calculation."""
        distance = self.calculator.calculate_horizontal_distance(
            self.rocket_gps,
            self.antenna_gps
        )
        
        # Should be approximately the expected horizontal distance
        assert abs(distance - self.expected_distance_horizontal) < 10
        
        # Should be less than 3D distance
        distance_3d = self.calculator.calculate_distance_3d(
            self.rocket_gps,
            self.antenna_gps
        )
        assert distance < distance_3d
    
    def test_get_calculation_info_valid(self):
        """Test calculation info with valid coordinates."""
        info = self.calculator.get_calculation_info(
            self.rocket_gps,
            self.antenna_gps
        )
        
        # Check structure
        assert "error" not in info
        assert "target_gps" in info
        assert "reference_gps" in info
        assert "cartesian" in info
        assert "spherical" in info
        assert "motor_position" in info
        assert "distances" in info
        assert "angles_deg" in info
        
        # Check distances
        distances = info["distances"]
        assert "horizontal_m" in distances
        assert "total_3d_m" in distances
        assert "altitude_diff_m" in distances
        
        # Check angles
        angles = info["angles_deg"]
        assert "azimuth" in angles
        assert "elevation" in angles
        assert "pitch" in angles
        assert "yaw" in angles
        
        # Verify altitude difference
        assert abs(distances["altitude_diff_m"] - self.expected_altitude_diff) < 0.1
    
    def test_get_calculation_info_invalid(self):
        """Test calculation info with invalid coordinates."""
        invalid_gps = GPSPosition(lat=91.0, lon=-75.0, alt=100.0)  # Invalid latitude
        
        info = self.calculator.get_calculation_info(
            invalid_gps,
            self.antenna_gps
        )
        
        # Should contain error information
        assert "error" in info
        assert "target_valid" in info
        assert "reference_valid" in info
        assert info["target_valid"] is False
        assert info["reference_valid"] is True
    
    @patch('app.services.position_calculator.logger')
    def test_get_calculation_info_exception(self, mock_logger):
        """Test calculation info with exception handling."""
        # Create a mock GPS position that will cause an exception
        with patch.object(self.calculator, 'gps_to_cartesian', side_effect=Exception("Test error")):
            info = self.calculator.get_calculation_info(
                self.rocket_gps,
                self.antenna_gps
            )
            
            # Should handle exception gracefully
            assert "error" in info
            assert info["error"] == "Test error"
            mock_logger.error.assert_called_once()
    
    def test_data_model_to_dict_methods(self):
        """Test to_dict methods of data models."""
        # Test CartesianPosition
        cartesian = CartesianPosition(x=1.0, y=2.0, z=3.0, timestamp=datetime.now())
        cartesian_dict = cartesian.to_dict()
        
        assert cartesian_dict["x"] == 1.0
        assert cartesian_dict["y"] == 2.0
        assert cartesian_dict["z"] == 3.0
        assert "timestamp" in cartesian_dict
        
        # Test SphericalPosition
        spherical = SphericalPosition(
            azimuth_rad=math.pi/4, 
            elevation_rad=math.pi/6, 
            range_m=100.0,
            timestamp=datetime.now()
        )
        spherical_dict = spherical.to_dict()
        
        assert spherical_dict["azimuth_rad"] == math.pi/4
        assert spherical_dict["elevation_rad"] == math.pi/6
        assert spherical_dict["range_m"] == 100.0
        assert "azimuth_deg" in spherical_dict
        assert "elevation_deg" in spherical_dict
        assert "timestamp" in spherical_dict
        
        # Test to_degrees method
        azimuth_deg, elevation_deg, range_m = spherical.to_degrees()
        assert abs(azimuth_deg - 45.0) < 0.001
        assert abs(elevation_deg - 30.0) < 0.001
        assert range_m == 100.0


class TestPositionCalculatorKnownValues:
    """Test position calculator with known, verified values."""
    
    def setup_method(self):
        """Set up test with known coordinates and expected results."""
        self.calculator = PositionCalculator()
        
        # Known test case: Ottawa to Montreal (approximately)
        self.ottawa_gps = GPSPosition(lat=45.4215, lon=-75.6972, alt=70.0)
        self.montreal_gps = GPSPosition(lat=45.5017, lon=-73.5673, alt=20.0)
        
        # Expected values (calculated independently)
        self.expected_distance_km = 164.0  # Approximately 164 km
        self.expected_bearing_deg = 86.0   # Approximately 86 degrees (ENE) - corrected value
    
    def test_known_distance_calculation(self):
        """Test distance calculation with known coordinates."""
        distance_m = self.calculator.calculate_horizontal_distance(
            self.montreal_gps,
            self.ottawa_gps
        )
        
        distance_km = distance_m / 1000.0
        
        # Should be within 5% of expected distance
        assert abs(distance_km - self.expected_distance_km) < (self.expected_distance_km * 0.05)
    
    def test_known_bearing_calculation(self):
        """Test bearing calculation with known coordinates."""
        spherical = self.calculator.gps_to_spherical(
            self.montreal_gps,
            self.ottawa_gps
        )
        
        bearing_deg = math.degrees(spherical.azimuth_rad)
        
        # Normalize to 0-360 range for comparison
        if bearing_deg < 0:
            bearing_deg += 360
        
        # Should be within 5 degrees of expected bearing
        assert abs(bearing_deg - self.expected_bearing_deg) < 5.0


class TestPositionCalculatorEdgeCases:
    """Test edge cases and error conditions."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.calculator = PositionCalculator()
    
    def test_zero_distance_positions(self):
        """Test with positions at zero distance."""
        same_gps = GPSPosition(lat=45.0, lon=-75.0, alt=100.0)
        
        cartesian = self.calculator.gps_to_cartesian(same_gps, same_gps)
        spherical = self.calculator.cartesian_to_spherical(cartesian)
        
        # Distance should be zero
        assert abs(spherical.range_m) < 0.001
        
        # Angles can be anything when distance is zero, but should not crash
        assert isinstance(spherical.azimuth_rad, float)
        assert isinstance(spherical.elevation_rad, float)
    
    def test_extreme_coordinates(self):
        """Test with extreme but valid coordinates."""
        # North pole
        north_pole = GPSPosition(lat=90.0, lon=0.0, alt=0.0)
        equator = GPSPosition(lat=0.0, lon=0.0, alt=0.0)
        
        # Should not crash
        cartesian = self.calculator.gps_to_cartesian(north_pole, equator)
        assert isinstance(cartesian.x, float)
        assert isinstance(cartesian.y, float)
        assert isinstance(cartesian.z, float)
        
        # Distance should be approximately quarter of Earth's circumference
        distance = math.sqrt(cartesian.x**2 + cartesian.y**2 + cartesian.z**2)
        expected_distance = math.pi * self.calculator.EARTH_RADIUS_M / 2  # Quarter circumference
        
        # Should be within 10% (rough approximation due to spherical vs flat earth)
        assert abs(distance - expected_distance) < (expected_distance * 0.1)
    
    def test_antimeridian_crossing(self):
        """Test coordinates that cross the antimeridian (180° longitude)."""
        west_of_antimeridian = GPSPosition(lat=0.0, lon=179.0, alt=0.0)
        east_of_antimeridian = GPSPosition(lat=0.0, lon=-179.0, alt=0.0)
        
        # Should calculate short distance across antimeridian, not long way around
        distance = self.calculator.calculate_horizontal_distance(
            east_of_antimeridian,
            west_of_antimeridian
        )
        
        # Should be approximately 2 degrees of longitude at equator
        expected_distance = 2 * math.pi * self.calculator.EARTH_RADIUS_M / 180  # ~222 km
        
        # Should be within reasonable range
        assert distance < expected_distance * 1.5  # Allow for some approximation error