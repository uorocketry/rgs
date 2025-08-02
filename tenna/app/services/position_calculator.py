"""Position calculation service for GPS-to-angle conversions and coordinate transformations."""

import math
import logging
from dataclasses import dataclass
from typing import Tuple, Optional, Dict, Any
from datetime import datetime

from app.services.state_manager import GPSPosition
from app.models.motor import MotorPosition


logger = logging.getLogger(__name__)


@dataclass
class CartesianPosition:
    """3D Cartesian position relative to antenna."""
    x: float  # East (meters)
    y: float  # North (meters) 
    z: float  # Up (meters)
    timestamp: datetime
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary representation."""
        return {
            "x": self.x,
            "y": self.y,
            "z": self.z,
            "timestamp": self.timestamp.isoformat()
        }


@dataclass
class SphericalPosition:
    """Spherical position (azimuth, elevation, range) relative to antenna."""
    azimuth_rad: float    # Azimuth angle in radians (0 = North, positive = clockwise)
    elevation_rad: float  # Elevation angle in radians (0 = horizon, positive = up)
    range_m: float        # Range in meters
    timestamp: datetime
    
    def to_degrees(self) -> Tuple[float, float, float]:
        """Convert angles to degrees."""
        return (
            math.degrees(self.azimuth_rad),
            math.degrees(self.elevation_rad),
            self.range_m
        )
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary representation."""
        azimuth_deg, elevation_deg, range_m = self.to_degrees()
        return {
            "azimuth_rad": self.azimuth_rad,
            "elevation_rad": self.elevation_rad,
            "range_m": self.range_m,
            "azimuth_deg": azimuth_deg,
            "elevation_deg": elevation_deg,
            "timestamp": self.timestamp.isoformat()
        }


class PositionCalculator:
    """Service for GPS-to-angle conversions and coordinate transformations."""
    
    # Earth radius in meters (WGS84 mean radius)
    EARTH_RADIUS_M = 6371000.0
    
    def __init__(self):
        """Initialize the position calculator."""
        logger.info("Position calculator initialized")
    
    def gps_to_cartesian(
        self, 
        target_gps: GPSPosition, 
        reference_gps: GPSPosition
    ) -> CartesianPosition:
        """Convert GPS coordinates to local Cartesian coordinates.
        
        Uses the haversine formula for distance calculation and bearing calculation
        for azimuth. The coordinate system is:
        - X-axis: East (positive)
        - Y-axis: North (positive)
        - Z-axis: Up (positive)
        
        Args:
            target_gps: Target GPS position
            reference_gps: Reference (antenna) GPS position
            
        Returns:
            CartesianPosition relative to reference point
        """
        # Convert to radians
        target_lat_rad = math.radians(target_gps.lat)
        target_lon_rad = math.radians(target_gps.lon)
        ref_lat_rad = math.radians(reference_gps.lat)
        ref_lon_rad = math.radians(reference_gps.lon)
        
        # Calculate differences
        d_lat = target_lat_rad - ref_lat_rad
        d_lon = target_lon_rad - ref_lon_rad
        
        # Haversine formula for horizontal distance
        a = (math.sin(d_lat / 2) ** 2 + 
             math.cos(ref_lat_rad) * math.cos(target_lat_rad) * 
             math.sin(d_lon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        horizontal_distance = self.EARTH_RADIUS_M * c
        
        # Calculate bearing (azimuth from North)
        y_bearing = math.sin(d_lon) * math.cos(target_lat_rad)
        x_bearing = (math.cos(ref_lat_rad) * math.sin(target_lat_rad) - 
                    math.sin(ref_lat_rad) * math.cos(target_lat_rad) * math.cos(d_lon))
        azimuth_rad = math.atan2(y_bearing, x_bearing)
        
        # Convert polar coordinates to Cartesian (North = +Y, East = +X)
        x = horizontal_distance * math.sin(azimuth_rad)  # East
        y = horizontal_distance * math.cos(azimuth_rad)  # North
        z = target_gps.alt - reference_gps.alt           # Up
        
        return CartesianPosition(
            x=x,
            y=y,
            z=z,
            timestamp=datetime.now()
        )
    
    def cartesian_to_spherical(self, cartesian: CartesianPosition) -> SphericalPosition:
        """Convert Cartesian coordinates to spherical coordinates.
        
        Args:
            cartesian: Cartesian position
            
        Returns:
            SphericalPosition with azimuth, elevation, and range
        """
        # Calculate horizontal distance and range
        horizontal_distance = math.sqrt(cartesian.x ** 2 + cartesian.y ** 2)
        range_m = math.sqrt(cartesian.x ** 2 + cartesian.y ** 2 + cartesian.z ** 2)
        
        # Calculate azimuth (from North, clockwise positive)
        azimuth_rad = math.atan2(cartesian.x, cartesian.y)
        
        # Calculate elevation (from horizon, up positive)
        if horizontal_distance > 0:
            elevation_rad = math.atan2(cartesian.z, horizontal_distance)
        else:
            # Handle case where target is directly above/below
            elevation_rad = math.pi / 2 if cartesian.z > 0 else -math.pi / 2
        
        return SphericalPosition(
            azimuth_rad=azimuth_rad,
            elevation_rad=elevation_rad,
            range_m=range_m,
            timestamp=datetime.now()
        )
    
    def gps_to_spherical(
        self, 
        target_gps: GPSPosition, 
        reference_gps: GPSPosition
    ) -> SphericalPosition:
        """Convert GPS coordinates directly to spherical coordinates.
        
        This is a convenience method that combines GPS-to-Cartesian and 
        Cartesian-to-spherical conversions.
        
        Args:
            target_gps: Target GPS position
            reference_gps: Reference (antenna) GPS position
            
        Returns:
            SphericalPosition with azimuth, elevation, and range
        """
        cartesian = self.gps_to_cartesian(target_gps, reference_gps)
        return self.cartesian_to_spherical(cartesian)
    
    def spherical_to_motor_position(
        self, 
        spherical: SphericalPosition,
        pitch_offset_rad: float = 0.0,
        yaw_offset_rad: float = 0.0
    ) -> MotorPosition:
        """Convert spherical coordinates to motor position.
        
        Args:
            spherical: Spherical position
            pitch_offset_rad: Pitch offset in radians (for calibration)
            yaw_offset_rad: Yaw offset in radians (for calibration)
            
        Returns:
            MotorPosition with pitch and yaw angles
        """
        # Map spherical coordinates to motor coordinates
        # Azimuth -> Yaw (with offset)
        # Elevation -> Pitch (with offset)
        yaw_rad = spherical.azimuth_rad + yaw_offset_rad
        pitch_rad = spherical.elevation_rad + pitch_offset_rad
        
        return MotorPosition(
            pitch_rad=pitch_rad,
            yaw_rad=yaw_rad,
            timestamp=datetime.now()
        )
    
    def gps_to_motor_position(
        self,
        target_gps: GPSPosition,
        reference_gps: GPSPosition,
        pitch_offset_rad: float = 0.0,
        yaw_offset_rad: float = 0.0
    ) -> MotorPosition:
        """Convert GPS coordinates directly to motor position.
        
        This is the main method that combines all conversion steps to go from
        GPS coordinates to motor angles, preserving the existing GPS-to-angle
        conversion functionality.
        
        Args:
            target_gps: Target GPS position
            reference_gps: Reference (antenna) GPS position
            pitch_offset_rad: Pitch offset in radians (for calibration)
            yaw_offset_rad: Yaw offset in radians (for calibration)
            
        Returns:
            MotorPosition with pitch and yaw angles
        """
        spherical = self.gps_to_spherical(target_gps, reference_gps)
        return self.spherical_to_motor_position(
            spherical, 
            pitch_offset_rad, 
            yaw_offset_rad
        )
    
    def calculate_shortest_path_yaw(
        self, 
        current_yaw_rad: float, 
        target_yaw_rad: float
    ) -> float:
        """Calculate the shortest path for circular yaw motion.
        
        This handles the circular nature of yaw angles, ensuring the motor
        takes the shortest path to the target angle.
        
        Args:
            current_yaw_rad: Current yaw angle in radians
            target_yaw_rad: Target yaw angle in radians
            
        Returns:
            Adjusted target yaw angle for shortest path
        """
        # Calculate the difference
        yaw_diff = target_yaw_rad - current_yaw_rad
        
        # Normalize to [-π, π] range for shortest path
        while yaw_diff > math.pi:
            yaw_diff -= 2 * math.pi
        while yaw_diff < -math.pi:
            yaw_diff += 2 * math.pi
        
        # Return the adjusted target
        return current_yaw_rad + yaw_diff
    
    def normalize_angle(self, angle_rad: float) -> float:
        """Normalize angle to [-π, π] range.
        
        Args:
            angle_rad: Angle in radians
            
        Returns:
            Normalized angle in [-π, π] range
        """
        while angle_rad > math.pi:
            angle_rad -= 2 * math.pi
        while angle_rad < -math.pi:
            angle_rad += 2 * math.pi
        return angle_rad
    
    def validate_gps_coordinates(self, gps: GPSPosition) -> bool:
        """Validate GPS coordinates are within reasonable bounds.
        
        Args:
            gps: GPS position to validate
            
        Returns:
            True if coordinates are valid, False otherwise
        """
        # Check latitude bounds
        if not (-90.0 <= gps.lat <= 90.0):
            logger.warning(f"Invalid latitude: {gps.lat}")
            return False
        
        # Check longitude bounds
        if not (-180.0 <= gps.lon <= 180.0):
            logger.warning(f"Invalid longitude: {gps.lon}")
            return False
        
        # Check altitude bounds (reasonable range)
        if not (-1000.0 <= gps.alt <= 50000.0):  # -1km to 50km
            logger.warning(f"Invalid altitude: {gps.alt}")
            return False
        
        return True
    
    def calculate_distance_3d(
        self, 
        target_gps: GPSPosition, 
        reference_gps: GPSPosition
    ) -> float:
        """Calculate 3D distance between two GPS positions.
        
        Args:
            target_gps: Target GPS position
            reference_gps: Reference GPS position
            
        Returns:
            3D distance in meters
        """
        cartesian = self.gps_to_cartesian(target_gps, reference_gps)
        return math.sqrt(cartesian.x ** 2 + cartesian.y ** 2 + cartesian.z ** 2)
    
    def calculate_horizontal_distance(
        self, 
        target_gps: GPSPosition, 
        reference_gps: GPSPosition
    ) -> float:
        """Calculate horizontal distance between two GPS positions.
        
        Args:
            target_gps: Target GPS position
            reference_gps: Reference GPS position
            
        Returns:
            Horizontal distance in meters
        """
        cartesian = self.gps_to_cartesian(target_gps, reference_gps)
        return math.sqrt(cartesian.x ** 2 + cartesian.y ** 2)
    
    def get_calculation_info(
        self,
        target_gps: GPSPosition,
        reference_gps: GPSPosition
    ) -> Dict[str, Any]:
        """Get comprehensive calculation information for debugging.
        
        Args:
            target_gps: Target GPS position
            reference_gps: Reference GPS position
            
        Returns:
            Dictionary with calculation details
        """
        try:
            # Validate inputs
            target_valid = self.validate_gps_coordinates(target_gps)
            reference_valid = self.validate_gps_coordinates(reference_gps)
            
            if not target_valid or not reference_valid:
                return {
                    "error": "Invalid GPS coordinates",
                    "target_valid": target_valid,
                    "reference_valid": reference_valid
                }
            
            # Perform calculations
            cartesian = self.gps_to_cartesian(target_gps, reference_gps)
            spherical = self.cartesian_to_spherical(cartesian)
            motor_position = self.spherical_to_motor_position(spherical)
            
            return {
                "target_gps": target_gps.to_dict(),
                "reference_gps": reference_gps.to_dict(),
                "cartesian": cartesian.to_dict(),
                "spherical": spherical.to_dict(),
                "motor_position": motor_position.to_dict(),
                "distances": {
                    "horizontal_m": self.calculate_horizontal_distance(target_gps, reference_gps),
                    "total_3d_m": self.calculate_distance_3d(target_gps, reference_gps),
                    "altitude_diff_m": target_gps.alt - reference_gps.alt
                },
                "angles_deg": {
                    "azimuth": math.degrees(spherical.azimuth_rad),
                    "elevation": math.degrees(spherical.elevation_rad),
                    "pitch": math.degrees(motor_position.pitch_rad),
                    "yaw": math.degrees(motor_position.yaw_rad)
                }
            }
            
        except Exception as e:
            logger.error(f"Error in calculation info: {e}")
            return {
                "error": str(e),
                "target_gps": target_gps.to_dict() if target_gps else None,
                "reference_gps": reference_gps.to_dict() if reference_gps else None
            }


# Global position calculator instance
position_calculator = PositionCalculator()