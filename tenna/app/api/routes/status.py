"""Status and health check API routes."""

import logging
import time
from datetime import datetime
from typing import Dict, Any
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.api.dependencies import get_motor_service, get_state_manager, create_error_response
from app.models.api import HealthCheckResponse, SystemStatusResponse, MotorStatusResponse, PositionResponse
from app.services.motor_service import MotorService
from app.services.state_manager import StateManager
import math

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/status", tags=["status"])

# Track application start time for uptime calculation
_start_time = time.time()


@router.get("/health", response_model=HealthCheckResponse)
async def health_check(
    motor_service: MotorService = Depends(get_motor_service),
    state_manager: StateManager = Depends(get_state_manager)
):
    """Basic health check endpoint for monitoring."""
    try:
        services = {}
        overall_status = "healthy"
        
        # Check state manager
        try:
            _ = await state_manager.get_current_position_dict()
            services["state_manager"] = "healthy"
        except Exception as e:
            services["state_manager"] = f"unhealthy: {str(e)}"
            overall_status = "degraded"
        
        # Check motor service (basic availability)
        try:
            current_mode = await state_manager.get_mode()
            services["motor_controller"] = f"healthy ({current_mode.value} mode)"
        except Exception as e:
            services["motor_controller"] = f"unhealthy: {str(e)}"
            overall_status = "unhealthy"
        
        # Check API service (if we got this far, it's working)
        services["api"] = "healthy"
        
        return HealthCheckResponse(
            status=overall_status,
            services=services,
            version="1.0.0"  # Could be read from package metadata
        )
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}", exc_info=True)
        return HealthCheckResponse(
            status="unhealthy",
            services={"api": f"error: {str(e)}"},
            version="1.0.0"
        )


@router.get("/system", response_model=SystemStatusResponse)
async def system_status(
    motor_service: MotorService = Depends(get_motor_service),
    state_manager: StateManager = Depends(get_state_manager)
):
    """Detailed system status information."""
    try:
        # Calculate uptime
        uptime = time.time() - _start_time
        
        # Get current position for motor status
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
        
        # Build motor status
        current_mode = await state_manager.get_mode()
        is_connected = current_mode.value in ["simulation", "hardware"]
        is_calibrated = True  # Can be enhanced with actual calibration status
        
        # Get error messages
        errors = await state_manager.get_errors()
        
        motor_status = MotorStatusResponse(
            is_connected=is_connected,
            is_calibrated=is_calibrated,
            current_position=current_position,
            target_position=target_position,
            errors=errors,
            mode=current_mode.value,
            state="idle"  # Can be enhanced with actual state tracking
        )
        
        # Build configuration summary
        configuration = {
            "current_mode": current_mode.value,
            "available_modes": ["simulation", "hardware"],
            "position_limits": {
                "pitch_range": [-90, 90],
                "yaw_range": [-180, 180]
            }
        }
        
        return SystemStatusResponse(
            uptime=uptime,
            motor_controller=motor_status,
            api_status="operational",
            configuration=configuration
        )
        
    except Exception as e:
        logger.error(f"Error getting system status: {str(e)}", exc_info=True)
        return create_error_response(e, 500, "SYSTEM_STATUS_ERROR")


@router.get("/logs")
async def get_recent_logs(
    limit: int = 50,
    state_manager: StateManager = Depends(get_state_manager)
):
    """Get recent system logs (simplified to show errors)."""
    try:
        errors = await state_manager.get_errors()
        
        return {
            "logs": errors,
            "count": len(errors),
            "message": "Error logs" if errors else "No errors",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting logs: {str(e)}", exc_info=True)
        return create_error_response(e, 500, "LOG_READ_ERROR")


@router.get("/metrics")
async def get_system_metrics(
    state_manager: StateManager = Depends(get_state_manager)
):
    """Get basic system metrics."""
    try:
        uptime = time.time() - _start_time
        
        # Basic metrics
        current_mode = await state_manager.get_mode()
        errors = await state_manager.get_errors()
        
        metrics = {
            "uptime_seconds": uptime,
            "uptime_formatted": f"{int(uptime // 3600)}h {int((uptime % 3600) // 60)}m {int(uptime % 60)}s",
            "current_mode": current_mode.value,
            "last_update": datetime.now().isoformat(),
            "error_count": len(errors)
        }
        
        # Position metrics
        position_dict = await state_manager.get_current_position_dict()
        metrics["current_position"] = {
            "pitch_deg": math.degrees(position_dict.get("pitch", 0.0)),
            "yaw_deg": math.degrees(position_dict.get("yaw", 0.0))
        }
        
        # Target position metrics
        manual_target = await state_manager.get_manual_target_rad()
        if manual_target:
            metrics["target_position"] = {
                "pitch_deg": math.degrees(manual_target.get("pitch", 0.0)),
                "yaw_deg": math.degrees(manual_target.get("yaw", 0.0))
            }
        
        return {
            "metrics": metrics,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting metrics: {str(e)}", exc_info=True)
        return create_error_response(e, 500, "METRICS_READ_ERROR")