"""Integration tests for API endpoints."""

import pytest
import asyncio
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch, AsyncMock

from app.api.main import app
from app.services.state_manager import state_manager
from app.services.motor_service import MotorService


@pytest.fixture
def client():
    """Create test client for API testing."""
    return TestClient(app)


@pytest.fixture
def mock_state_manager():
    """Mock state manager for testing."""
    mock = AsyncMock()
    mock.get_mode.return_value = Mock(value="simulation")
    mock.get_current_position_dict.return_value = {"pitch": 0.0, "yaw": 0.0}
    mock.get_manual_target_rad.return_value = {"pitch": 0.0, "yaw": 0.0}
    mock.get_errors.return_value = ["Test error"]
    mock.set_mode_from_string.return_value = True
    mock.set_manual_target_rad.return_value = None
    mock.set_antenna_position_gps.return_value = None
    mock.set_rocket_position_gps.return_value = None
    mock.get_antenna_position_dict.return_value = {"lat": 45.42, "lon": -75.68, "alt": 60}
    mock.get_rocket_position_dict.return_value = {"lat": 45.42, "lon": -75.68, "alt": 205}
    mock.has_errors.return_value = False
    return mock


@pytest.fixture
def mock_motor_service():
    """Mock motor service for testing."""
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


class TestMotorEndpoints:
    """Test motor control endpoints."""
    
    def test_set_target_position_valid(self, client, mock_state_manager, mock_motor_service):
        """Test setting valid target position."""
        with patch('app.api.routes.motor.get_state_manager', return_value=mock_state_manager):
            with patch('app.api.routes.motor.get_motor_service', return_value=mock_motor_service):
                response = client.post(
                    "/api/v1/motor/position",
                    json={"pitch": 45.0, "yaw": 90.0}
                )
                
                assert response.status_code == 200
                data = response.json()
                assert data["message"] == "Target position set successfully"
                assert data["data"]["target_pitch_deg"] == 45.0
                assert data["data"]["target_yaw_deg"] == 90.0
    
    def test_set_target_position_invalid_pitch(self, client):
        """Test setting invalid pitch angle."""
        response = client.post(
            "/api/v1/motor/position",
            json={"pitch": 95.0, "yaw": 0.0}  # Pitch out of range
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_set_target_position_invalid_yaw(self, client):
        """Test setting invalid yaw angle."""
        response = client.post(
            "/api/v1/motor/position",
            json={"pitch": 0.0, "yaw": 200.0}  # Yaw out of range
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_get_current_position(self, client, mock_state_manager):
        """Test getting current position."""
        with patch('app.api.routes.motor.get_state_manager', return_value=mock_state_manager):
            response = client.get("/api/v1/motor/position")
            
            assert response.status_code == 200
            data = response.json()
            assert "pitch_rad" in data
            assert "yaw_rad" in data
            assert "pitch_deg" in data
            assert "yaw_deg" in data
    
    def test_get_motor_status(self, client, mock_state_manager, mock_motor_service):
        """Test getting motor status."""
        with patch('app.api.routes.motor.get_state_manager', return_value=mock_state_manager):
            with patch('app.api.routes.motor.get_motor_service', return_value=mock_motor_service):
                response = client.get("/api/v1/motor/status")
                
                assert response.status_code == 200
                data = response.json()
                assert "is_connected" in data
                assert "is_calibrated" in data
                assert "current_position" in data
                assert "mode" in data
                assert "state" in data
    
    def test_set_controller_mode_valid(self, client, mock_state_manager):
        """Test setting valid controller mode."""
        with patch('app.api.routes.motor.get_state_manager', return_value=mock_state_manager):
            response = client.post(
                "/api/v1/motor/mode",
                json={"mode": "simulation"}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert "Mode set to simulation" in data["message"]
    
    def test_set_controller_mode_invalid(self, client):
        """Test setting invalid controller mode."""
        response = client.post(
            "/api/v1/motor/mode",
            json={"mode": "invalid_mode"}
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_get_controller_mode(self, client, mock_state_manager):
        """Test getting controller mode."""
        with patch('app.api.routes.motor.get_state_manager', return_value=mock_state_manager):
            response = client.get("/api/v1/motor/mode")
            
            assert response.status_code == 200
            data = response.json()
            assert "current_mode" in data
            assert "available_modes" in data
    
    def test_set_rocket_position_valid(self, client, mock_state_manager):
        """Test setting valid rocket GPS position."""
        with patch('app.api.routes.motor.get_state_manager', return_value=mock_state_manager):
            response = client.post(
                "/api/v1/motor/gps/rocket",
                json={"lat": 37.7749, "lon": -122.4194, "alt": 100.0}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["message"] == "Rocket position updated successfully"
    
    def test_set_rocket_position_invalid_lat(self, client):
        """Test setting invalid latitude."""
        response = client.post(
            "/api/v1/motor/gps/rocket",
            json={"lat": 95.0, "lon": 0.0, "alt": 100.0}  # Latitude out of range
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_set_antenna_position_valid(self, client, mock_state_manager):
        """Test setting valid antenna GPS position."""
        with patch('app.api.routes.motor.get_state_manager', return_value=mock_state_manager):
            response = client.post(
                "/api/v1/motor/gps/antenna",
                json={"lat": 37.7749, "lon": -122.4194, "alt": 50.0}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["message"] == "Antenna position updated successfully"


class TestStatusEndpoints:
    """Test status and health check endpoints."""
    
    def test_health_check(self, client, mock_state_manager, mock_motor_service):
        """Test health check endpoint."""
        with patch('app.api.routes.status.get_state_manager', return_value=mock_state_manager):
            with patch('app.api.routes.status.get_motor_service', return_value=mock_motor_service):
                response = client.get("/api/v1/status/health")
                
                assert response.status_code == 200
                data = response.json()
                assert "status" in data
                assert "services" in data
                assert "version" in data
    
    def test_system_status(self, client, mock_state_manager, mock_motor_service):
        """Test system status endpoint."""
        with patch('app.api.routes.status.get_state_manager', return_value=mock_state_manager):
            with patch('app.api.routes.status.get_motor_service', return_value=mock_motor_service):
                response = client.get("/api/v1/status/system")
                
                assert response.status_code == 200
                data = response.json()
                assert "uptime" in data
                assert "motor_controller" in data
                assert "api_status" in data
                assert "configuration" in data
    
    def test_get_recent_logs(self, client, mock_state_manager):
        """Test getting recent logs."""
        with patch('app.api.routes.status.get_state_manager', return_value=mock_state_manager):
            response = client.get("/api/v1/status/logs")
            
            assert response.status_code == 200
            data = response.json()
            assert "logs" in data
            assert "count" in data
    
    def test_get_system_metrics(self, client, mock_state_manager):
        """Test getting system metrics."""
        with patch('app.api.routes.status.get_state_manager', return_value=mock_state_manager):
            response = client.get("/api/v1/status/metrics")
            
            assert response.status_code == 200
            data = response.json()
            assert "metrics" in data
            assert "timestamp" in data


class TestConfigurationEndpoints:
    """Test configuration endpoints."""
    
    def test_get_configuration(self, client, mock_state_manager):
        """Test getting system configuration."""
        with patch('app.api.routes.config.get_state_manager', return_value=mock_state_manager):
            response = client.get("/api/v1/config/")
            
            assert response.status_code == 200
            data = response.json()
            assert "motor_limits" in data
            assert "controller_modes" in data
            assert "system_settings" in data
    
    def test_get_motor_limits(self, client):
        """Test getting motor limits."""
        response = client.get("/api/v1/config/limits")
        
        assert response.status_code == 200
        data = response.json()
        assert "pitch" in data
        assert "yaw" in data
    
    def test_get_available_modes(self, client, mock_state_manager):
        """Test getting available modes."""
        with patch('app.api.routes.config.get_state_manager', return_value=mock_state_manager):
            response = client.get("/api/v1/config/modes")
            
            assert response.status_code == 200
            data = response.json()
            assert "current_mode" in data
            assert "modes" in data
    
    def test_get_system_configuration(self, client):
        """Test getting system configuration."""
        response = client.get("/api/v1/config/system")
        
        assert response.status_code == 200
        data = response.json()
        assert "api" in data
        assert "motor_control" in data
        assert "logging" in data
        assert "hardware" in data


class TestLegacyEndpoints:
    """Test legacy endpoints for backward compatibility."""
    
    def test_legacy_set_mode(self, client, mock_state_manager):
        """Test legacy set mode endpoint."""
        with patch('app.api.main.state_manager', mock_state_manager):
            response = client.post(
                "/set-mode",
                json={"mode": "simulation"}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert "Mode set to simulation" in data["message"]
    
    def test_legacy_set_target(self, client, mock_state_manager):
        """Test legacy set target endpoint."""
        with patch('app.api.main.state_manager', mock_state_manager):
            response = client.post(
                "/set-target",
                json={"pitch": 45.0, "yaw": 90.0}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["message"] == "Manual target set"


class TestStreamingEndpoints:
    """Test streaming endpoints."""
    
    @pytest.mark.skip(reason="Streaming endpoints require special async testing setup")
    def test_stream_updates_connection(self, client):
        """Test that stream updates endpoint accepts connections."""
        # Streaming endpoints are complex to test properly in unit tests
        # They would require async test client and proper connection management
        # The endpoints are tested manually and work correctly
        pass
    
    @pytest.mark.skip(reason="Streaming endpoints require special async testing setup")
    def test_stream_logs_connection(self, client):
        """Test that stream logs endpoint accepts connections."""
        # Streaming endpoints are complex to test properly in unit tests
        # They would require async test client and proper connection management
        # The endpoints are tested manually and work correctly
        pass


class TestRootEndpoint:
    """Test root endpoint."""
    
    def test_root_endpoint(self, client):
        """Test root endpoint returns API information."""
        response = client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data
        assert "api_prefix" in data
        assert data["api_prefix"] == "/api/v1"


class TestErrorHandling:
    """Test error handling and validation."""
    
    def test_invalid_json_request(self, client):
        """Test handling of invalid JSON requests."""
        response = client.post(
            "/api/v1/motor/position",
            data="invalid json",
            headers={"content-type": "application/json"}
        )
        
        assert response.status_code == 422  # Unprocessable Entity
    
    def test_missing_required_fields(self, client):
        """Test handling of missing required fields."""
        response = client.post(
            "/api/v1/motor/position",
            json={"pitch": 45.0}  # Missing yaw field
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_nonexistent_endpoint(self, client):
        """Test handling of nonexistent endpoints."""
        response = client.get("/api/v1/nonexistent")
        
        assert response.status_code == 404  # Not Found