"""API dependencies and common functionality."""

import logging
from typing import Optional
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse

from app.core.exceptions import (
    MotorControlError, HardwareError, ConfigurationError, 
    ValidationError, APIError, CommunicationError
)
from app.models.api import ErrorResponse
from app.services.motor_service import MotorService
from app.services.state_manager import state_manager

logger = logging.getLogger(__name__)


# Application-level motor service instance
# This will be initialized during application startup
_motor_service: Optional[MotorService] = None


async def get_motor_service() -> MotorService:
    """Dependency to get the motor service instance.
    
    Returns the application-level motor service instance that was
    initialized during application startup.
    
    Raises:
        RuntimeError: If motor service is not initialized
    """
    if _motor_service is None:
        raise RuntimeError(
            "Motor service not initialized. Ensure initialize_motor_service() "
            "is called during application startup."
        )
    return _motor_service


async def initialize_motor_service() -> MotorService:
    """Initialize the application-level motor service instance.
    
    This should be called during application startup.
    
    Returns:
        Initialized motor service instance
    """
    global _motor_service
    
    if _motor_service is not None:
        logger.warning("Motor service already initialized")
        return _motor_service
    
    from app.core.config import AppConfig
    from app.models.motor import DualAxisConfig
    
    config = AppConfig()
    axis_config = DualAxisConfig()
    
    _motor_service = MotorService(config, axis_config)
    await _motor_service.initialize()
    
    logger.info("Motor service initialized successfully")
    return _motor_service


async def shutdown_motor_service() -> None:
    """Shutdown the application-level motor service instance.
    
    This should be called during application shutdown.
    """
    global _motor_service
    
    if _motor_service is not None:
        await _motor_service.shutdown()
        _motor_service = None
        logger.info("Motor service shutdown complete")


async def get_state_manager():
    """Dependency to get the state manager instance."""
    return state_manager


def create_error_response(
    error: Exception, 
    status_code: int = 500,
    error_code: Optional[str] = None
) -> JSONResponse:
    """Create a standardized error response."""
    
    if isinstance(error, MotorControlError):
        error_response = ErrorResponse(
            error=error.message,
            error_code=error_code or error.error_code,
            details=error.details
        )
    else:
        error_response = ErrorResponse(
            error=str(error),
            error_code=error_code or "INTERNAL_ERROR",
            details={}
        )
    
    logger.error(f"API Error: {error_response.error}", exc_info=True)
    
    return JSONResponse(
        status_code=status_code,
        content=error_response.model_dump()
    )


def map_exception_to_status_code(error: Exception) -> int:
    """Map exception types to appropriate HTTP status codes."""
    
    if isinstance(error, ValidationError):
        return 400  # Bad Request
    elif isinstance(error, ConfigurationError):
        return 400  # Bad Request
    elif isinstance(error, HardwareError):
        return 503  # Service Unavailable
    elif isinstance(error, CommunicationError):
        return 503  # Service Unavailable
    elif isinstance(error, APIError):
        return 400  # Bad Request
    elif isinstance(error, MotorControlError):
        return 500  # Internal Server Error
    else:
        return 500  # Internal Server Error


async def handle_motor_control_exceptions(request: Request, call_next):
    """Middleware to handle motor control exceptions globally."""
    try:
        response = await call_next(request)
        return response
    except MotorControlError as e:
        status_code = map_exception_to_status_code(e)
        return create_error_response(e, status_code)
    except Exception as e:
        logger.error(f"Unhandled exception in API: {str(e)}", exc_info=True)
        return create_error_response(e, 500, "INTERNAL_ERROR")


def validate_position_limits(pitch: float, yaw: float) -> None:
    """Validate position limits for motor commands."""
    if not (-90 <= pitch <= 90):
        raise ValidationError(
            f"Pitch angle {pitch} is out of range [-90, 90] degrees",
            error_code="PITCH_OUT_OF_RANGE",
            details={"pitch": pitch, "valid_range": [-90, 90]}
        )
    
    if not (-180 <= yaw <= 180):
        raise ValidationError(
            f"Yaw angle {yaw} is out of range [-180, 180] degrees", 
            error_code="YAW_OUT_OF_RANGE",
            details={"yaw": yaw, "valid_range": [-180, 180]}
        )


def validate_gps_coordinates(lat: float, lon: float, alt: float) -> None:
    """Validate GPS coordinate ranges."""
    if not (-90 <= lat <= 90):
        raise ValidationError(
            f"Latitude {lat} is out of range [-90, 90] degrees",
            error_code="LATITUDE_OUT_OF_RANGE",
            details={"latitude": lat, "valid_range": [-90, 90]}
        )
    
    if not (-180 <= lon <= 180):
        raise ValidationError(
            f"Longitude {lon} is out of range [-180, 180] degrees",
            error_code="LONGITUDE_OUT_OF_RANGE", 
            details={"longitude": lon, "valid_range": [-180, 180]}
        )
    
    # Reasonable altitude limits (below sea level to stratosphere)
    if not (-500 <= alt <= 50000):
        raise ValidationError(
            f"Altitude {alt} is out of reasonable range [-500, 50000] meters",
            error_code="ALTITUDE_OUT_OF_RANGE",
            details={"altitude": alt, "valid_range": [-500, 50000]}
        )