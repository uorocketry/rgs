"""Custom exception hierarchy for motor control service."""

from typing import Optional, Dict, Any


class MotorControlError(Exception):
    """Base exception for motor control errors."""
    
    def __init__(
        self, 
        message: str, 
        error_code: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message)
        self.message = message
        self.error_code = error_code or self.__class__.__name__
        self.details = details or {}


class HardwareError(MotorControlError):
    """Hardware-related errors."""
    pass


class ODriveError(HardwareError):
    """ODrive-specific hardware errors."""
    pass


class CalibrationError(ODriveError):
    """Motor calibration errors."""
    pass


class CommunicationError(MotorControlError):
    """Communication-related errors."""
    pass


class ODriveCommunicationError(CommunicationError):
    """ODrive communication errors."""
    pass


class ConfigurationError(MotorControlError):
    """Configuration-related errors."""
    pass


class ValidationError(ConfigurationError):
    """Data validation errors."""
    pass


class PositionError(MotorControlError):
    """Position calculation and movement errors."""
    pass


class PositionLimitError(PositionError):
    """Position limit exceeded errors."""
    pass


class SimulationError(MotorControlError):
    """Simulation-related errors."""
    pass


class ServiceError(MotorControlError):
    """Service layer errors."""
    pass


class StateError(ServiceError):
    """State management errors."""
    pass


class APIError(MotorControlError):
    """API-related errors."""
    pass


class AuthenticationError(APIError):
    """Authentication errors."""
    pass


class AuthorizationError(APIError):
    """Authorization errors."""
    pass