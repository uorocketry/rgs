"""Configuration management using pydantic-settings."""

from typing import List, Optional
from dataclasses import dataclass, field
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict


@dataclass
class ODriveConfig:
    """ODrive motor controller configuration."""
    gear_ratio: float = 20.0
    pole_pairs: int = 7
    torque_constant: float = 8.27 / 150
    current_limit: float = 5.0
    calibration_current: float = 5.0
    circular_setpoints: bool = True


@dataclass
class SimulationConfig:
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
    odrive_config: ODriveConfig = field(default_factory=ODriveConfig)
    simulation_config: SimulationConfig = field(default_factory=SimulationConfig)
    
    # API Configuration
    cors_origins: List[str] = field(default_factory=list)
    api_prefix: str = "/api/v1"
    
    # Logging Configuration
    log_level: str = "INFO"
    log_format: str = "json"
    
    # Environment
    environment: str = "development"


# Global configuration instance
config = AppConfig()