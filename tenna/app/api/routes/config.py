"""Configuration management API routes."""

import logging
from typing import Dict, Any
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.api.dependencies import get_state_manager, create_error_response
from app.models.api import SuccessResponse, ErrorResponse
from app.services.state_manager import StateManager

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/config", tags=["configuration"])


class ConfigurationResponse(BaseModel):
    """Response model for configuration data."""
    motor_limits: Dict[str, Any] = Field(..., description="Motor position limits")
    controller_modes: Dict[str, Any] = Field(..., description="Available controller modes")
    system_settings: Dict[str, Any] = Field(..., description="System configuration settings")


class MotorLimitsRequest(BaseModel):
    """Request model for updating motor limits."""
    pitch_min: float = Field(-90, description="Minimum pitch angle in degrees", ge=-180, le=0)
    pitch_max: float = Field(90, description="Maximum pitch angle in degrees", ge=0, le=180)
    yaw_min: float = Field(-180, description="Minimum yaw angle in degrees", ge=-360, le=0)
    yaw_max: float = Field(180, description="Maximum yaw angle in degrees", ge=0, le=360)


@router.get("/", response_model=ConfigurationResponse)
async def get_configuration(
    state_manager: StateManager = Depends(get_state_manager)
):
    """Get current system configuration."""
    try:
        # Motor limits configuration
        motor_limits = {
            "pitch_range": [-90, 90],
            "yaw_range": [-180, 180],
            "max_velocity": None,  # Could be configurable
            "max_acceleration": None  # Could be configurable
        }
        
        # Controller modes configuration
        current_mode = await state_manager.get_mode()
        controller_modes = {
            "current_mode": current_mode.value,
            "available_modes": ["simulation", "hardware"],
            "mode_descriptions": {
                "simulation": "PyBullet physics simulation",
                "hardware": "ODrive motor controller hardware"
            }
        }
        
        # System settings
        system_settings = {
            "api_version": "1.0.0",
            "coordinate_system": "degrees",
            "update_rate_hz": 60,
            "logging_enabled": True
        }
        
        return ConfigurationResponse(
            motor_limits=motor_limits,
            controller_modes=controller_modes,
            system_settings=system_settings
        )
        
    except Exception as e:
        logger.error(f"Error getting configuration: {str(e)}", exc_info=True)
        return create_error_response(e, 500, "CONFIG_READ_ERROR")


@router.get("/limits", response_model=Dict[str, Any])
async def get_motor_limits():
    """Get current motor position limits."""
    try:
        return {
            "pitch": {
                "min": -90,
                "max": 90,
                "unit": "degrees"
            },
            "yaw": {
                "min": -180,
                "max": 180,
                "unit": "degrees"
            },
            "velocity": {
                "max": None,
                "unit": "degrees/second"
            },
            "acceleration": {
                "max": None,
                "unit": "degrees/second²"
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting motor limits: {str(e)}", exc_info=True)
        return create_error_response(e, 500, "LIMITS_READ_ERROR")


@router.get("/modes", response_model=Dict[str, Any])
async def get_available_modes(
    state_manager: StateManager = Depends(get_state_manager)
):
    """Get available controller modes and their descriptions."""
    try:
        current_mode = await state_manager.get_mode()
        return {
            "current_mode": current_mode.value,
            "modes": {
                "simulation": {
                    "name": "Simulation",
                    "description": "PyBullet physics simulation mode",
                    "available": True,
                    "hardware_required": False
                },
                "hardware": {
                    "name": "Hardware",
                    "description": "ODrive motor controller hardware mode",
                    "available": True,  # Could check actual hardware availability
                    "hardware_required": True
                }
            },
            "legacy_modes": {
                "tracking": "simulation",
                "manual": "simulation",
                "odrive": "hardware"
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting available modes: {str(e)}", exc_info=True)
        return create_error_response(e, 500, "MODES_READ_ERROR")


@router.get("/system", response_model=Dict[str, Any])
async def get_system_configuration():
    """Get system-level configuration settings."""
    try:
        return {
            "api": {
                "version": "1.0.0",
                "prefix": "/api/v1",
                "cors_enabled": True
            },
            "motor_control": {
                "coordinate_system": "degrees",
                "update_rate_hz": 60,
                "position_tolerance": 0.1
            },
            "logging": {
                "level": "INFO",
                "format": "structured",
                "max_log_entries": 1000
            },
            "hardware": {
                "odrive_detection": "automatic",
                "simulation_fallback": True,
                "calibration_required": True
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting system configuration: {str(e)}", exc_info=True)
        return create_error_response(e, 500, "SYSTEM_CONFIG_READ_ERROR")