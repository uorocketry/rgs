"""Test that singleton pattern has been successfully removed."""

import pytest
from unittest.mock import patch, AsyncMock

from app.services.motor_service import MotorService
from app.api.dependencies import get_motor_service, initialize_motor_service, shutdown_motor_service


class TestSingletonRemoval:
    """Test that singleton pattern has been successfully removed."""
    
    def test_no_global_singleton_functions(self):
        """Test that old singleton functions are removed."""
        # These functions should not exist anymore
        with pytest.raises(ImportError):
            from app.services.motor_service import get_motor_service_instance
        
        with pytest.raises(ImportError):
            from app.services.motor_service import initialize_motor_service as old_init
    
    def test_motor_service_can_be_instantiated_directly(self):
        """Test that MotorService can be instantiated directly without singleton."""
        from app.core.config import AppConfig
        from app.models.motor import DualAxisConfig
        
        config = AppConfig()
        axis_config = DualAxisConfig()
        
        # Should be able to create multiple instances
        service1 = MotorService(config, axis_config)
        service2 = MotorService(config, axis_config)
        
        # They should be different instances
        assert service1 is not service2
        assert id(service1) != id(service2)
    
    async def test_dependency_injection_provides_same_instance(self):
        """Test that dependency injection provides the same instance during app lifecycle."""
        # Clean up any existing service
        await shutdown_motor_service()
        
        with patch('app.api.dependencies.MotorService') as mock_motor_service_class:
            mock_service = AsyncMock(spec=MotorService)
            mock_service.initialize.return_value = None
            mock_service.shutdown.return_value = None
            mock_motor_service_class.return_value = mock_service
            
            # Initialize service
            await initialize_motor_service()
            
            try:
                # Get service multiple times
                service1 = await get_motor_service()
                service2 = await get_motor_service()
                
                # Should be the same instance (application-level singleton)
                assert service1 is service2
                
                # But it's managed through dependency injection, not global singleton
                assert mock_motor_service_class.call_count == 1  # Only created once
                
            finally:
                await shutdown_motor_service()
    
    async def test_service_lifecycle_management(self):
        """Test that service lifecycle is properly managed."""
        with patch('app.api.dependencies.MotorService') as mock_motor_service_class:
            mock_service = AsyncMock(spec=MotorService)
            mock_service.initialize.return_value = None
            mock_service.shutdown.return_value = None
            mock_motor_service_class.return_value = mock_service
            
            # Service should not be available initially
            with pytest.raises(RuntimeError, match="Motor service not initialized"):
                await get_motor_service()
            
            # Initialize service
            await initialize_motor_service()
            
            # Service should be available
            service = await get_motor_service()
            assert service is not None
            
            # Shutdown service
            await shutdown_motor_service()
            
            # Service should not be available after shutdown
            with pytest.raises(RuntimeError, match="Motor service not initialized"):
                await get_motor_service()
            
            # Verify lifecycle methods were called
            mock_service.initialize.assert_called_once()
            mock_service.shutdown.assert_called_once()
    
    def test_thread_safety_without_global_state(self):
        """Test that the new approach doesn't rely on global state for thread safety."""
        from app.core.config import AppConfig
        from app.models.motor import DualAxisConfig
        
        config = AppConfig()
        axis_config = DualAxisConfig()
        
        # Create multiple service instances
        services = [MotorService(config, axis_config) for _ in range(5)]
        
        # Each should have its own state
        for i, service in enumerate(services):
            assert service.config is config  # Same config reference is fine
            assert service.axis_config is axis_config  # Same axis config reference is fine
            # But each service should be a separate instance
            for j, other_service in enumerate(services):
                if i != j:
                    assert service is not other_service
                    assert service._lock is not other_service._lock  # Different locks