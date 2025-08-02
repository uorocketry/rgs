"""Test API dependency injection."""

import pytest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

from app.api.main import app
from app.services.motor_service import MotorService


class TestAPIDependencyInjection:
    """Test API dependency injection functionality."""
    
    def test_api_without_motor_service_initialization(self):
        """Test that API returns error when motor service is not initialized."""
        # Ensure motor service is not initialized by creating a fresh client
        with TestClient(app) as client:
            # This should fail because motor service is not initialized
            response = client.get("/api/v1/status/health")
            
            # Should return 500 error due to motor service not being initialized
            assert response.status_code == 500
    
    @patch('app.api.dependencies.get_motor_service')
    @patch('app.api.dependencies.get_state_manager')
    def test_api_with_mocked_dependencies(self, mock_get_state_manager, mock_get_motor_service):
        """Test API with mocked dependencies."""
        # Setup mocks
        mock_motor_service = AsyncMock(spec=MotorService)
        mock_motor_service.is_initialized = True
        mock_motor_service.current_mode.value = "simulation"
        
        mock_state_manager = AsyncMock()
        mock_state_manager.mode.value = "simulation"
        mock_state_manager.get_current_position_dict.return_value = {"pitch": 0.0, "yaw": 0.0}
        
        mock_get_motor_service.return_value = mock_motor_service
        mock_get_state_manager.return_value = mock_state_manager
        
        with TestClient(app) as client:
            response = client.get("/api/v1/status/health")
            
            # Should succeed with mocked dependencies
            assert response.status_code == 200
            data = response.json()
            assert "status" in data
            assert "services" in data
    
    @patch('app.api.dependencies._motor_service', None)  # Reset global state
    @patch('app.api.dependencies.MotorService')
    def test_api_with_proper_initialization(self, mock_motor_service_class):
        """Test API with proper motor service initialization."""
        from app.api.dependencies import initialize_motor_service, shutdown_motor_service
        
        # Setup mock
        mock_service = AsyncMock(spec=MotorService)
        mock_service.initialize.return_value = None
        mock_service.shutdown.return_value = None
        mock_motor_service_class.return_value = mock_service
        
        async def test_with_initialized_service():
            # Initialize motor service
            await initialize_motor_service()
            
            try:
                with TestClient(app) as client:
                    # Mock the state manager for this test
                    with patch('app.api.routes.status.get_state_manager') as mock_get_state_manager:
                        mock_state_manager = AsyncMock()
                        mock_state_manager.mode.value = "simulation"
                        mock_state_manager.get_current_position_dict.return_value = {"pitch": 0.0, "yaw": 0.0}
                        mock_get_state_manager.return_value = mock_state_manager
                        
                        response = client.get("/api/v1/status/health")
                        
                        # Should succeed with initialized service
                        assert response.status_code == 200
                        data = response.json()
                        assert "status" in data
                        assert "services" in data
            finally:
                # Clean up
                await shutdown_motor_service()
        
        # Run the async test
        import asyncio
        asyncio.run(test_with_initialized_service())