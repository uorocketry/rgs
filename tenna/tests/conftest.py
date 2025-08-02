"""Test configuration and fixtures."""

import pytest
import asyncio
from unittest.mock import AsyncMock, Mock
from fastapi.testclient import TestClient

from app.api.main import app
from app.api.dependencies import initialize_motor_service, shutdown_motor_service
from app.services.motor_service import MotorService


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
async def initialized_motor_service():
    """Create and initialize a motor service for testing."""
    # Initialize the motor service for testing
    service = await initialize_motor_service()
    yield service
    # Clean up after test
    await shutdown_motor_service()


@pytest.fixture
def client_with_motor_service(initialized_motor_service):
    """Create a test client with properly initialized motor service."""
    with TestClient(app) as client:
        yield client


@pytest.fixture
def mock_motor_service():
    """Create a mock motor service for testing."""
    mock = AsyncMock(spec=MotorService)
    mock.is_initialized = True
    mock.current_mode.value = "simulation"
    mock.is_ready.return_value = True
    mock.send_position_command.return_value = True
    mock.get_current_position.return_value = (0.0, 0.0)
    mock.get_status.return_value = Mock(
        is_connected=True,
        is_calibrated=True,
        current_position=Mock(pitch_rad=0.0, yaw_rad=0.0),
        target_position=None,
        errors=[],
        mode="simulation",
        state="idle"
    )
    return mock


@pytest.fixture
def mock_state_manager():
    """Create a mock state manager for testing."""
    mock = Mock()
    mock.mode.value = "simulation"
    mock.get_current_position_dict.return_value = {"pitch": 0.0, "yaw": 0.0}
    mock.manual_target_rad = {"pitch": 0.0, "yaw": 0.0}
    mock.logs = ["Test log entry"]
    mock.last_update_time = "2024-01-01T00:00:00"
    mock.set_mode.return_value = True
    return mock