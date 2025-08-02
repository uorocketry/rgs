"""Test dependency injection functionality."""

import pytest
from unittest.mock import patch, AsyncMock

from app.api.dependencies import get_motor_service, initialize_motor_service, shutdown_motor_service
from app.services.motor_service import MotorService


class TestDependencyInjection:
    """Test dependency injection functionality."""
    
    async def test_motor_service_not_initialized_raises_error(self):
        """Test that get_motor_service raises error when not initialized."""
        # Ensure motor service is not initialized
        await shutdown_motor_service()
        
        with pytest.raises(RuntimeError, match="Motor service not initialized"):
            await get_motor_service()
    
    @patch('app.api.dependencies.MotorService')
    async def test_initialize_motor_service(self, mock_motor_service_class):
        """Test motor service initialization."""
        # Setup mock
        mock_service = AsyncMock(spec=MotorService)
        mock_service.initialize.return_value = None
        mock_motor_service_class.return_value = mock_service
        
        # Initialize service
        service = await initialize_motor_service()
        
        # Verify service was created and initialized
        assert service == mock_service
        mock_service.initialize.assert_called_once()
        
        # Verify we can get the service
        retrieved_service = await get_motor_service()
        assert retrieved_service == mock_service
        
        # Clean up
        await shutdown_motor_service()
    
    async def test_shutdown_motor_service(self):
        """Test motor service shutdown."""
        # Initialize service first
        with patch('app.api.dependencies.MotorService') as mock_motor_service_class:
            mock_service = AsyncMock(spec=MotorService)
            mock_service.initialize.return_value = None
            mock_service.shutdown.return_value = None
            mock_motor_service_class.return_value = mock_service
            
            # Initialize and then shutdown
            await initialize_motor_service()
            await shutdown_motor_service()
            
            # Verify shutdown was called
            mock_service.shutdown.assert_called_once()
            
            # Verify service is no longer available
            with pytest.raises(RuntimeError, match="Motor service not initialized"):
                await get_motor_service()
    
    async def test_double_initialization_warning(self):
        """Test that double initialization logs a warning."""
        with patch('app.api.dependencies.MotorService') as mock_motor_service_class:
            with patch('app.api.dependencies.logger') as mock_logger:
                mock_service = AsyncMock(spec=MotorService)
                mock_service.initialize.return_value = None
                mock_motor_service_class.return_value = mock_service
                
                # Initialize twice
                service1 = await initialize_motor_service()
                service2 = await initialize_motor_service()
                
                # Should return the same service and log warning
                assert service1 == service2
                mock_logger.warning.assert_called_with("Motor service already initialized")
                
                # Clean up
                await shutdown_motor_service()