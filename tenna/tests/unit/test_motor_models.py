"""Unit tests for motor data models."""

import math
import pytest
from datetime import datetime
from app.models.motor import (
    AxisConfig, ControllerMode, ControllerStatus, DualAxisConfig,
    MotorCommand, MotorPosition, MotorState
)


class TestMotorPosition:
    """Test MotorPosition data model."""
    
    def test_motor_position_creation(self):
        """Test creating a MotorPosition instance."""
        timestamp = datetime.now()
        position = MotorPosition(
            pitch_rad=0.5,
            yaw_rad=1.0,
            timestamp=timestamp
        )
        
        assert position.pitch_rad == 0.5
        assert position.yaw_rad == 1.0
        assert position.timestamp == timestamp
    
    def test_to_degrees_conversion(self):
        """Test conversion from radians to degrees."""
        position = MotorPosition(
            pitch_rad=math.pi / 2,  # 90 degrees
            yaw_rad=math.pi,        # 180 degrees
            timestamp=datetime.now()
        )
        
        pitch_deg, yaw_deg = position.to_degrees()
        assert abs(pitch_deg - 90.0) < 0.001
        assert abs(yaw_deg - 180.0) < 0.001
    
    def test_to_dict(self):
        """Test dictionary conversion."""
        timestamp = datetime.now()
        position = MotorPosition(
            pitch_rad=0.5,
            yaw_rad=1.0,
            timestamp=timestamp
        )
        
        result = position.to_dict()
        
        assert result["pitch_rad"] == 0.5
        assert result["yaw_rad"] == 1.0
        assert abs(result["pitch_deg"] - math.degrees(0.5)) < 0.001
        assert abs(result["yaw_deg"] - math.degrees(1.0)) < 0.001
        assert result["timestamp"] == timestamp.isoformat()


class TestMotorCommand:
    """Test MotorCommand data model."""
    
    def test_motor_command_creation(self):
        """Test creating a MotorCommand instance."""
        command = MotorCommand(
            target_pitch_rad=0.5,
            target_yaw_rad=1.0,
            max_velocity=2.0,
            max_acceleration=1.0
        )
        
        assert command.target_pitch_rad == 0.5
        assert command.target_yaw_rad == 1.0
        assert command.max_velocity == 2.0
        assert command.max_acceleration == 1.0
    
    def test_motor_command_optional_params(self):
        """Test creating MotorCommand with optional parameters."""
        command = MotorCommand(
            target_pitch_rad=0.5,
            target_yaw_rad=1.0
        )
        
        assert command.target_pitch_rad == 0.5
        assert command.target_yaw_rad == 1.0
        assert command.max_velocity is None
        assert command.max_acceleration is None
    
    def test_from_degrees_class_method(self):
        """Test creating MotorCommand from degrees."""
        command = MotorCommand.from_degrees(
            pitch_deg=90.0,
            yaw_deg=180.0,
            max_velocity=2.0
        )
        
        assert abs(command.target_pitch_rad - math.pi / 2) < 0.001
        assert abs(command.target_yaw_rad - math.pi) < 0.001
        assert command.max_velocity == 2.0
        assert command.max_acceleration is None
    
    def test_to_degrees(self):
        """Test conversion to degrees."""
        command = MotorCommand(
            target_pitch_rad=math.pi / 2,
            target_yaw_rad=math.pi
        )
        
        pitch_deg, yaw_deg = command.to_degrees()
        assert abs(pitch_deg - 90.0) < 0.001
        assert abs(yaw_deg - 180.0) < 0.001


class TestControllerStatus:
    """Test ControllerStatus data model."""
    
    def test_controller_status_creation(self):
        """Test creating a ControllerStatus instance."""
        current_pos = MotorPosition(0.5, 1.0, datetime.now())
        target_pos = MotorPosition(0.6, 1.1, datetime.now())
        
        status = ControllerStatus(
            is_connected=True,
            is_calibrated=True,
            current_position=current_pos,
            target_position=target_pos,
            errors=["Test error"],
            mode=ControllerMode.HARDWARE,
            state=MotorState.MOVING
        )
        
        assert status.is_connected is True
        assert status.is_calibrated is True
        assert status.current_position == current_pos
        assert status.target_position == target_pos
        assert status.errors == ["Test error"]
        assert status.mode == ControllerMode.HARDWARE
        assert status.state == MotorState.MOVING
    
    def test_has_errors(self):
        """Test error detection."""
        current_pos = MotorPosition(0.5, 1.0, datetime.now())
        
        # Status with errors
        status_with_errors = ControllerStatus(
            is_connected=True,
            is_calibrated=True,
            current_position=current_pos,
            target_position=None,
            errors=["Connection lost"],
            mode=ControllerMode.HARDWARE,
            state=MotorState.ERROR
        )
        
        # Status without errors
        status_no_errors = ControllerStatus(
            is_connected=True,
            is_calibrated=True,
            current_position=current_pos,
            target_position=None,
            errors=[],
            mode=ControllerMode.HARDWARE,
            state=MotorState.IDLE
        )
        
        assert status_with_errors.has_errors() is True
        assert status_no_errors.has_errors() is False
    
    def test_is_operational(self):
        """Test operational status check."""
        current_pos = MotorPosition(0.5, 1.0, datetime.now())
        
        # Operational status
        operational_status = ControllerStatus(
            is_connected=True,
            is_calibrated=True,
            current_position=current_pos,
            target_position=None,
            errors=[],
            mode=ControllerMode.HARDWARE,
            state=MotorState.IDLE
        )
        
        # Non-operational status (disconnected)
        disconnected_status = ControllerStatus(
            is_connected=False,
            is_calibrated=False,
            current_position=current_pos,
            target_position=None,
            errors=[],
            mode=ControllerMode.OFFLINE,
            state=MotorState.DISCONNECTED
        )
        
        # Non-operational status (has errors)
        error_status = ControllerStatus(
            is_connected=True,
            is_calibrated=True,
            current_position=current_pos,
            target_position=None,
            errors=["Hardware fault"],
            mode=ControllerMode.HARDWARE,
            state=MotorState.ERROR
        )
        
        assert operational_status.is_operational() is True
        assert disconnected_status.is_operational() is False
        assert error_status.is_operational() is False
    
    def test_to_dict(self):
        """Test dictionary conversion."""
        current_pos = MotorPosition(0.5, 1.0, datetime.now())
        target_pos = MotorPosition(0.6, 1.1, datetime.now())
        
        status = ControllerStatus(
            is_connected=True,
            is_calibrated=True,
            current_position=current_pos,
            target_position=target_pos,
            errors=["Test error"],
            mode=ControllerMode.HARDWARE,
            state=MotorState.MOVING
        )
        
        result = status.to_dict()
        
        assert result["is_connected"] is True
        assert result["is_calibrated"] is True
        assert result["current_position"] == current_pos.to_dict()
        assert result["target_position"] == target_pos.to_dict()
        assert result["errors"] == ["Test error"]
        assert result["mode"] == "hardware"
        assert result["state"] == "moving"
    
    def test_to_dict_no_target(self):
        """Test dictionary conversion with no target position."""
        current_pos = MotorPosition(0.5, 1.0, datetime.now())
        
        status = ControllerStatus(
            is_connected=True,
            is_calibrated=True,
            current_position=current_pos,
            target_position=None,
            errors=[],
            mode=ControllerMode.SIMULATION,
            state=MotorState.IDLE
        )
        
        result = status.to_dict()
        assert result["target_position"] is None


class TestEnums:
    """Test enum definitions."""
    
    def test_controller_mode_values(self):
        """Test ControllerMode enum values."""
        assert ControllerMode.SIMULATION.value == "simulation"
        assert ControllerMode.HARDWARE.value == "hardware"
        assert ControllerMode.OFFLINE.value == "offline"
    
    def test_motor_state_values(self):
        """Test MotorState enum values."""
        assert MotorState.IDLE.value == "idle"
        assert MotorState.CALIBRATING.value == "calibrating"
        assert MotorState.MOVING.value == "moving"
        assert MotorState.ERROR.value == "error"
        assert MotorState.DISCONNECTED.value == "disconnected"


class TestAxisConfig:
    """Test AxisConfig data model."""
    
    def test_axis_config_creation(self):
        """Test creating an AxisConfig instance."""
        config = AxisConfig(
            axis_index=0,
            gear_ratio=20.0,
            pole_pairs=7,
            torque_constant=8.27 / 150,
            current_limit=5.0,
            calibration_current=5.0,
            circular_setpoints=True
        )
        
        assert config.axis_index == 0
        assert config.gear_ratio == 20.0
        assert config.pole_pairs == 7
        assert abs(config.torque_constant - 8.27 / 150) < 0.001
        assert config.current_limit == 5.0
        assert config.calibration_current == 5.0
        assert config.circular_setpoints is True
    
    def test_axis_config_defaults(self):
        """Test AxisConfig with default values."""
        config = AxisConfig(axis_index=1)
        
        assert config.axis_index == 1
        assert config.gear_ratio == 20.0
        assert config.pole_pairs == 7
        assert config.circular_setpoints is True
    
    def test_motor_turns_from_degrees(self):
        """Test conversion from degrees to motor turns."""
        config = AxisConfig(axis_index=0, gear_ratio=20.0)
        
        # 360 degrees = 1 output turn = 20 motor turns
        turns = config.motor_turns_from_degrees(360.0)
        assert abs(turns - 20.0) < 0.001
        
        # 180 degrees = 0.5 output turn = 10 motor turns
        turns = config.motor_turns_from_degrees(180.0)
        assert abs(turns - 10.0) < 0.001
        
        # 90 degrees = 0.25 output turn = 5 motor turns
        turns = config.motor_turns_from_degrees(90.0)
        assert abs(turns - 5.0) < 0.001
    
    def test_degrees_from_motor_turns(self):
        """Test conversion from motor turns to degrees."""
        config = AxisConfig(axis_index=0, gear_ratio=20.0)
        
        # 20 motor turns = 1 output turn = 360 degrees
        degrees = config.degrees_from_motor_turns(20.0)
        assert abs(degrees - 360.0) < 0.001
        
        # 10 motor turns = 0.5 output turn = 180 degrees
        degrees = config.degrees_from_motor_turns(10.0)
        assert abs(degrees - 180.0) < 0.001
        
        # 5 motor turns = 0.25 output turn = 90 degrees
        degrees = config.degrees_from_motor_turns(5.0)
        assert abs(degrees - 90.0) < 0.001
    
    def test_conversion_roundtrip(self):
        """Test that degree->turns->degree conversion is consistent."""
        config = AxisConfig(axis_index=0, gear_ratio=20.0)
        
        original_degrees = 123.45
        turns = config.motor_turns_from_degrees(original_degrees)
        converted_degrees = config.degrees_from_motor_turns(turns)
        
        assert abs(converted_degrees - original_degrees) < 0.001


class TestDualAxisConfig:
    """Test DualAxisConfig data model."""
    
    def test_dual_axis_config_creation(self):
        """Test creating a DualAxisConfig instance."""
        pitch_config = AxisConfig(axis_index=1, gear_ratio=25.0)
        yaw_config = AxisConfig(axis_index=0, gear_ratio=15.0)
        
        dual_config = DualAxisConfig(
            pitch_axis=pitch_config,
            yaw_axis=yaw_config
        )
        
        assert dual_config.pitch_axis == pitch_config
        assert dual_config.yaw_axis == yaw_config
        assert dual_config.pitch_axis.gear_ratio == 25.0
        assert dual_config.yaw_axis.gear_ratio == 15.0
    
    def test_dual_axis_config_defaults(self):
        """Test DualAxisConfig with default values."""
        dual_config = DualAxisConfig()
        
        assert dual_config.pitch_axis.axis_index == 1
        assert dual_config.yaw_axis.axis_index == 0
        assert dual_config.pitch_axis.gear_ratio == 20.0
        assert dual_config.yaw_axis.gear_ratio == 20.0
    
    def test_get_axis_config_by_name(self):
        """Test getting axis configuration by name."""
        pitch_config = AxisConfig(axis_index=1, gear_ratio=25.0)
        yaw_config = AxisConfig(axis_index=0, gear_ratio=15.0)
        
        dual_config = DualAxisConfig(
            pitch_axis=pitch_config,
            yaw_axis=yaw_config
        )
        
        # Test case-insensitive access
        assert dual_config.get_axis_config("pitch") == pitch_config
        assert dual_config.get_axis_config("PITCH") == pitch_config
        assert dual_config.get_axis_config("yaw") == yaw_config
        assert dual_config.get_axis_config("YAW") == yaw_config
    
    def test_get_axis_config_invalid_name(self):
        """Test getting axis configuration with invalid name."""
        dual_config = DualAxisConfig()
        
        with pytest.raises(ValueError, match="Unknown axis name: invalid"):
            dual_config.get_axis_config("invalid")
    
    def test_get_axis_by_index(self):
        """Test getting axis configuration by ODrive index."""
        pitch_config = AxisConfig(axis_index=1, gear_ratio=25.0)
        yaw_config = AxisConfig(axis_index=0, gear_ratio=15.0)
        
        dual_config = DualAxisConfig(
            pitch_axis=pitch_config,
            yaw_axis=yaw_config
        )
        
        assert dual_config.get_axis_by_index(0) == yaw_config
        assert dual_config.get_axis_by_index(1) == pitch_config
        assert dual_config.get_axis_by_index(2) is None
    
    def test_axis_assignment_flexibility(self):
        """Test that axis assignments can be swapped."""
        # Test swapped assignment (pitch on axis0, yaw on axis1)
        pitch_config = AxisConfig(axis_index=0, gear_ratio=25.0)
        yaw_config = AxisConfig(axis_index=1, gear_ratio=15.0)
        
        dual_config = DualAxisConfig(
            pitch_axis=pitch_config,
            yaw_axis=yaw_config
        )
        
        assert dual_config.get_axis_by_index(0) == pitch_config
        assert dual_config.get_axis_by_index(1) == yaw_config
        assert dual_config.get_axis_config("pitch").axis_index == 0
        assert dual_config.get_axis_config("yaw").axis_index == 1