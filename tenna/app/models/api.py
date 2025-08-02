"""API request and response models."""

from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, Field, field_validator


class ErrorResponse(BaseModel):
    """Standard error response model."""
    error: str = Field(..., description="Error message")
    error_code: str = Field(..., description="Error code for programmatic handling")
    details: Optional[Dict] = Field(None, description="Additional error details")
    timestamp: datetime = Field(default_factory=datetime.now, description="Error timestamp")


class SuccessResponse(BaseModel):
    """Standard success response model."""
    message: str = Field(..., description="Success message")
    data: Optional[Dict] = Field(None, description="Response data")
    timestamp: datetime = Field(default_factory=datetime.now, description="Response timestamp")


# Motor Control Models
class TargetPositionRequest(BaseModel):
    """Request model for setting target position."""
    pitch: float = Field(..., description="Pitch angle in degrees", ge=-90, le=90)
    yaw: float = Field(..., description="Yaw angle in degrees", ge=-180, le=180)
    max_velocity: Optional[float] = Field(None, description="Maximum velocity", gt=0)
    max_acceleration: Optional[float] = Field(None, description="Maximum acceleration", gt=0)


class PositionResponse(BaseModel):
    """Response model for position data."""
    pitch_rad: float = Field(..., description="Pitch angle in radians")
    yaw_rad: float = Field(..., description="Yaw angle in radians")
    pitch_deg: float = Field(..., description="Pitch angle in degrees")
    yaw_deg: float = Field(..., description="Yaw angle in degrees")
    timestamp: datetime = Field(..., description="Position timestamp")


class MotorStatusResponse(BaseModel):
    """Response model for motor status."""
    is_connected: bool = Field(..., description="Controller connection status")
    is_calibrated: bool = Field(..., description="Motor calibration status")
    current_position: PositionResponse = Field(..., description="Current motor position")
    target_position: Optional[PositionResponse] = Field(None, description="Target motor position")
    errors: List[str] = Field(..., description="List of current errors")
    mode: str = Field(..., description="Current controller mode")
    state: str = Field(..., description="Current motor state")


# GPS Position Models
class GPSPositionRequest(BaseModel):
    """Request model for GPS position."""
    lat: float = Field(..., description="Latitude in degrees", ge=-90, le=90)
    lon: float = Field(..., description="Longitude in degrees", ge=-180, le=180)
    alt: float = Field(..., description="Altitude in meters")


# Mode Control Models
class ModeRequest(BaseModel):
    """Request model for mode changes."""
    mode: str = Field(..., description="Controller mode")
    
    @field_validator('mode')
    @classmethod
    def validate_mode(cls, v):
        valid_modes = ['simulation', 'hardware', 'tracking', 'manual', 'odrive']
        if v not in valid_modes:
            raise ValueError(f'Mode must be one of: {valid_modes}')
        return v


class ModeResponse(BaseModel):
    """Response model for mode information."""
    current_mode: str = Field(..., description="Current controller mode")
    available_modes: List[str] = Field(..., description="Available controller modes")


# Health Check Models
class HealthCheckResponse(BaseModel):
    """Response model for health check."""
    status: str = Field(..., description="Overall system status")
    timestamp: datetime = Field(default_factory=datetime.now, description="Health check timestamp")
    services: Dict[str, str] = Field(..., description="Individual service statuses")
    version: Optional[str] = Field(None, description="Application version")


class SystemStatusResponse(BaseModel):
    """Response model for detailed system status."""
    uptime: float = Field(..., description="System uptime in seconds")
    motor_controller: MotorStatusResponse = Field(..., description="Motor controller status")
    api_status: str = Field(..., description="API service status")
    configuration: Dict = Field(..., description="Current system configuration")