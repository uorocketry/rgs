"""Configuration management using pydantic-settings."""

import os
from typing import List, Optional
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class ODriveConfig(BaseModel):
    """ODrive motor controller configuration."""
    gear_ratio: float = 20.0
    pole_pairs: int = 7
    torque_constant: float = 8.27 / 150
    current_limit: float = 5.0
    calibration_current: float = 5.0
    circular_setpoints: bool = True


class SimulationConfig(BaseModel):
    """PyBullet simulation configuration."""
    max_torque: float = 5.76
    max_velocity: float = 603.19
    physics_timestep: float = 1.0/240.0


class AppConfig(BaseSettings):
    """Main application configuration."""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    reload: bool = False
    
    # Motor Configuration
    default_mode: str = "simulation"
    odrive_config: ODriveConfig = Field(default_factory=ODriveConfig)
    simulation_config: SimulationConfig = Field(default_factory=SimulationConfig)
    
    # API Configuration
    cors_origins: List[str] = Field(default_factory=list)
    api_prefix: str = "/api/v1"
    
    # Logging Configuration
    log_level: str = "INFO"
    log_format: str = "json"
    
    # Environment
    environment: str = "development"


def get_config(env_file: Optional[str] = None) -> AppConfig:
    """Get configuration instance based on environment.
    
    Args:
        env_file: Optional path to environment file. If not provided,
                 determines based on ENVIRONMENT variable or defaults to .env
    
    Returns:
        Configured AppConfig instance
    """
    if env_file is None:
        environment = os.getenv("ENVIRONMENT", "development").lower()
        
        # Determine environment file based on environment
        env_files = {
            "development": ".env",
            "testing": ".env.test",
            "production": ".env.prod"
        }
        env_file = env_files.get(environment, ".env")
    
    # Create config with appropriate environment file
    return AppConfig(_env_file=env_file)


def create_config_for_testing() -> AppConfig:
    """Create configuration instance optimized for testing.
    
    Returns:
        AppConfig instance with testing defaults
    """
    return AppConfig(
        environment="testing",
        debug=True,
        log_level="DEBUG",
        default_mode="simulation",
        _env_file=".env.test"
    )