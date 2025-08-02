"""Motor control API routes."""

import logging
import math
from datetime import datetime
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse

from app.api.dependencies import (
    get_motor_service, get_state_manager, create_error_response,
    map_exception_to_status_code, validate_position_limits, validate_gps_coordinates
)
from app.core.exceptions import MotorControlError, ValidationError
from app.models.api import (
    TargetPositionRequest, PositionResponse, MotorStatusResponse,
    GPSPositionRequest, ModeRequest, ModeResponse, SuccessResponse, ErrorResponse
)
from app.models.motor import MotorCommand, ControllerMode
from app.services.motor_service import MotorService
from app.services.state_manager import StateManager

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/motor", tags=["motor"])


@router.post("/position", response_model=SuccessResponse, responses={
    400: {"model": ErrorResponse, "description": "Invalid position parameters"},
    503: {"model": ErrorResponse, "description": "Motor controller unavailable"}
})
async def set_target_position(
    request: TargetPositionRequest,
    motor_service: MotorService = Depends(get_motor_service),
    state_manager: StateManager = Depends(get_state_manager)
):
    """Set target position for the motor controller."""
    try:
        # Validate position limits
        validate_position_limits(request.pitch, request.yaw)
        
        # Create motor command
        command = MotorCommand.from_degrees(
            pitch_deg=request.pitch,
            yaw_deg=request.yaw,
            max_velocity=request.max_velocity,
            max_acceleration=request.max_acceleration
        )
        
        # Set manual target in state manager
        await state_manager.set_manual_target_rad({
            "pitch": command.target_pitch_rad,
            "yaw": command.target_yaw_rad
        })
        
        logger.info(f"Target position set to pitch={request.pitch}°, yaw={request.yaw}°")
        
        return SuccessResponse(
            message="Target position set successfully",
            data={
                "target_pitch_deg": request.pitch,
                "target_yaw_deg": request.yaw,
                "target_pitch_rad": command.target_pitch_rad,
                "target_yaw_rad": command.target_yaw_rad
            }
        )
        
    except MotorControlError as e:
        status_code = map_exception_to_status_code(e)
        return create_error_response(e, status_code)
    except Exception as e:
        logger.error(f"Unexpected error setting target position: {str(e)}", exc_info=True)
        return create_error_response(e, 500, "INTERNAL_ERROR")


@router.get("/position", response_model=PositionResponse, responses={
    503: {"model": ErrorResponse, "description": "Motor controller unavailable"}
})
async def get_current_position(
    state_manager: StateManager = Depends(get_state_manager)
):
    """Get current motor position."""
    try:
        position_dict = await state_manager.get_current_position_dict()
        
        pitch_rad = position_dict.get("pitch", 0.0)
        yaw_rad = position_dict.get("yaw", 0.0)
        
        return PositionResponse(
            pitch_rad=pitch_rad,
            yaw_rad=yaw_rad,
            pitch_deg=math.degrees(pitch_rad),
            yaw_deg=math.degrees(yaw_rad),
            timestamp=datetime.now()
        )
        
    except Exception as e:
        logger.error(f"Error getting current position: {str(e)}", exc_info=True)
        return create_error_response(e, 500, "POSITION_READ_ERROR")


@router.get("/status", response_model=MotorStatusResponse, responses={
    503: {"model": ErrorResponse, "description": "Motor controller unavailable"}
})
async def get_motor_status(
    motor_service: MotorService = Depends(get_motor_service),
    state_manager: StateManager = Depends(get_state_manager)
):
    """Get comprehensive motor controller status."""
    try:
        # Get current position
        position_dict = await state_manager.get_current_position_dict()
        pitch_rad = position_dict.get("pitch", 0.0)
        yaw_rad = position_dict.get("yaw", 0.0)
        
        current_position = PositionResponse(
            pitch_rad=pitch_rad,
            yaw_rad=yaw_rad,
            pitch_deg=math.degrees(pitch_rad),
            yaw_deg=math.degrees(yaw_rad),
            timestamp=datetime.now()
        )
        
        # Get target position if available
        target_position = None
        manual_target = await state_manager.get_manual_target_rad()
        if manual_target:
            target_pitch_rad = manual_target.get("pitch", 0.0)
            target_yaw_rad = manual_target.get("yaw", 0.0)
            target_position = PositionResponse(
                pitch_rad=target_pitch_rad,
                yaw_rad=target_yaw_rad,
                pitch_deg=math.degrees(target_pitch_rad),
                yaw_deg=math.degrees(target_yaw_rad),
                timestamp=datetime.now()
            )
        
        # Determine connection and calibration status based on mode
        current_mode = await state_manager.get_mode()
        is_connected = current_mode.value in ["simulation", "hardware"]
        is_calibrated = True  # Assume calibrated for now, can be enhanced later
        
        # Get any error messages
        errors = await state_manager.get_errors()
        
        return MotorStatusResponse(
            is_connected=is_connected,
            is_calibrated=is_calibrated,
            current_position=current_position,
            target_position=target_position,
            errors=errors,
            mode=current_mode.value,
            state="idle"  # Can be enhanced with actual state tracking
        )
        
    except Exception as e:
        logger.error(f"Error getting motor status: {str(e)}", exc_info=True)
        return create_error_response(e, 500, "STATUS_READ_ERROR")


@router.post("/mode", response_model=SuccessResponse, responses={
    400: {"model": ErrorResponse, "description": "Invalid mode"},
    503: {"model": ErrorResponse, "description": "Mode change failed"}
})
async def set_controller_mode(
    request: ModeRequest,
    state_manager: StateManager = Depends(get_state_manager)
):
    """Set the motor controller operating mode."""
    try:
        # Map legacy mode names to current ones
        mode_mapping = {
            "tracking": "simulation",
            "manual": "simulation", 
            "simulation": "simulation",
            "odrive": "hardware",
            "hardware": "hardware"
        }
        
        if request.mode not in mode_mapping:
            raise ValidationError(
                f"Invalid mode '{request.mode}'. Valid modes: {list(mode_mapping.keys())}",
                error_code="INVALID_MODE",
                details={"requested_mode": request.mode, "valid_modes": list(mode_mapping.keys())}
            )
        
        mapped_mode = mode_mapping[request.mode]
        
        if await state_manager.set_mode_from_string(mapped_mode):
            logger.info(f"Controller mode changed to: {mapped_mode}")
            return SuccessResponse(
                message=f"Mode set to {mapped_mode}",
                data={"previous_mode": request.mode, "current_mode": mapped_mode}
            )
        else:
            raise MotorControlError(
                f"Failed to set mode to {mapped_mode}",
                error_code="MODE_CHANGE_FAILED",
                details={"requested_mode": mapped_mode}
            )
            
    except MotorControlError as e:
        status_code = map_exception_to_status_code(e)
        return create_error_response(e, status_code)
    except Exception as e:
        logger.error(f"Unexpected error setting mode: {str(e)}", exc_info=True)
        return create_error_response(e, 500, "INTERNAL_ERROR")


@router.get("/mode", response_model=ModeResponse)
async def get_controller_mode(
    state_manager: StateManager = Depends(get_state_manager)
):
    """Get current controller mode and available modes."""
    try:
        current_mode = await state_manager.get_mode()
        available_modes = ["simulation", "hardware", "tracking", "manual", "odrive"]
        
        return ModeResponse(
            current_mode=current_mode.value,
            available_modes=available_modes
        )
        
    except Exception as e:
        logger.error(f"Error getting controller mode: {str(e)}", exc_info=True)
        return create_error_response(e, 500, "MODE_READ_ERROR")


@router.post("/gps/rocket", response_model=SuccessResponse, responses={
    400: {"model": ErrorResponse, "description": "Invalid GPS coordinates"}
})
async def set_rocket_position(
    request: GPSPositionRequest,
    state_manager: StateManager = Depends(get_state_manager)
):
    """Set the rocket/target GPS position for tracking."""
    try:
        # Validate GPS coordinates
        validate_gps_coordinates(request.lat, request.lon, request.alt)
        
        # Set rocket position in state manager
        await state_manager.set_rocket_position_gps(request.lat, request.lon, request.alt)
        
        logger.info(f"Rocket position set to lat={request.lat}, lon={request.lon}, alt={request.alt}")
        
        return SuccessResponse(
            message="Rocket position updated successfully",
            data={
                "latitude": request.lat,
                "longitude": request.lon,
                "altitude": request.alt
            }
        )
        
    except MotorControlError as e:
        status_code = map_exception_to_status_code(e)
        return create_error_response(e, status_code)
    except Exception as e:
        logger.error(f"Error setting rocket position: {str(e)}", exc_info=True)
        return create_error_response(e, 500, "INTERNAL_ERROR")


@router.post("/gps/antenna", response_model=SuccessResponse, responses={
    400: {"model": ErrorResponse, "description": "Invalid GPS coordinates"}
})
async def set_antenna_position(
    request: GPSPositionRequest,
    state_manager: StateManager = Depends(get_state_manager)
):
    """Set the antenna/base GPS position for tracking calculations."""
    try:
        # Validate GPS coordinates
        validate_gps_coordinates(request.lat, request.lon, request.alt)
        
        # Set antenna position in state manager
        await state_manager.set_antenna_position_gps(request.lat, request.lon, request.alt)
        
        logger.info(f"Antenna position set to lat={request.lat}, lon={request.lon}, alt={request.alt}")
        
        return SuccessResponse(
            message="Antenna position updated successfully",
            data={
                "latitude": request.lat,
                "longitude": request.lon,
                "altitude": request.alt
            }
        )
        
    except MotorControlError as e:
        status_code = map_exception_to_status_code(e)
        return create_error_response(e, status_code)
    except Exception as e:
        logger.error(f"Error setting antenna position: {str(e)}", exc_info=True)
        return create_error_response(e, 500, "INTERNAL_ERROR")