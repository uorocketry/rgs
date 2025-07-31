"""Motor-related data models and schemas."""

import math
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Tuple


class ControllerMode(Enum):
    """Motor controller operating modes."""
    SIMULATION = "simulation"
    HARDWARE = "hardware"
    OFFLINE = "offline"


class MotorState(Enum):
    """Motor operational states."""
    IDLE = "idle"
    CALIBRATING = "calibrating"
    MOVING = "moving"
    ERROR = "error"
    DISCONNECTED = "disconnected"


@dataclass
class AxisConfig:
    """Configuration for a single motor axis."""
    axis_index: int  # ODrive axis index (0 or 1)
    gear_ratio: float = 20.0  # Gearbox ratio (output:motor)
    pole_pairs: int = 7
    torque_constant: float = 8.27 / 150
    current_limit: float = 5.0
    calibration_current: float = 5.0
    circular_setpoints: bool = True
    
    def motor_turns_from_degrees(self, degrees: float) -> float:
        """Convert output degrees to motor turns."""
        return (degrees / 360.0) * self.gear_ratio
    
    def degrees_from_motor_turns(self, turns: float) -> float:
        """Convert motor turns to output degrees."""
        return (turns / self.gear_ratio) * 360.0


@dataclass 
class DualAxisConfig:
    """Configuration for dual-axis motor setup."""
    pitch_axis: AxisConfig = field(default_factory=lambda: AxisConfig(axis_index=1))
    yaw_axis: AxisConfig = field(default_factory=lambda: AxisConfig(axis_index=0))
    
    def get_axis_config(self, axis_name: str) -> AxisConfig:
        """Get configuration for named axis."""
        if axis_name.lower() == "pitch":
            return self.pitch_axis
        elif axis_name.lower() == "yaw":
            return self.yaw_axis
        else:
            raise ValueError(f"Unknown axis name: {axis_name}")
    
    def get_axis_by_index(self, axis_index: int) -> Optional[AxisConfig]:
        """Get axis configuration by ODrive axis index."""
        if self.pitch_axis.axis_index == axis_index:
            return self.pitch_axis
        elif self.yaw_axis.axis_index == axis_index:
            return self.yaw_axis
        return None


@dataclass
class MotorPosition:
    """Represents motor position in radians with timestamp."""
    pitch_rad: float
    yaw_rad: float
    timestamp: datetime
    
    def to_degrees(self) -> Tuple[float, float]:
        """Convert position from radians to degrees."""
        return (math.degrees(self.pitch_rad), math.degrees(self.yaw_rad))
    
    def to_dict(self) -> dict:
        """Convert to dictionary representation."""
        return {
            "pitch_rad": self.pitch_rad,
            "yaw_rad": self.yaw_rad,
            "pitch_deg": math.degrees(self.pitch_rad),
            "yaw_deg": math.degrees(self.yaw_rad),
            "timestamp": self.timestamp.isoformat()
        }


@dataclass
class MotorCommand:
    """Represents a motor position command."""
    target_pitch_rad: float
    target_yaw_rad: float
    max_velocity: Optional[float] = None
    max_acceleration: Optional[float] = None
    
    @classmethod
    def from_degrees(cls, pitch_deg: float, yaw_deg: float, 
                    max_velocity: Optional[float] = None,
                    max_acceleration: Optional[float] = None) -> 'MotorCommand':
        """Create command from degree values."""
        return cls(
            target_pitch_rad=math.radians(pitch_deg),
            target_yaw_rad=math.radians(yaw_deg),
            max_velocity=max_velocity,
            max_acceleration=max_acceleration
        )
    
    def to_degrees(self) -> Tuple[float, float]:
        """Get target position in degrees."""
        return (math.degrees(self.target_pitch_rad), math.degrees(self.target_yaw_rad))


@dataclass
class ControllerStatus:
    """Represents the current status of a motor controller."""
    is_connected: bool
    is_calibrated: bool
    current_position: MotorPosition
    target_position: Optional[MotorPosition]
    errors: List[str]
    mode: ControllerMode
    state: MotorState
    
    def to_dict(self) -> dict:
        """Convert to dictionary representation."""
        return {
            "is_connected": self.is_connected,
            "is_calibrated": self.is_calibrated,
            "current_position": self.current_position.to_dict(),
            "target_position": self.target_position.to_dict() if self.target_position else None,
            "errors": self.errors,
            "mode": self.mode.value,
            "state": self.state.value
        }
    
    def has_errors(self) -> bool:
        """Check if controller has any errors."""
        return len(self.errors) > 0
    
    def is_operational(self) -> bool:
        """Check if controller is operational (connected and no critical errors)."""
        return self.is_connected and not self.has_errors()