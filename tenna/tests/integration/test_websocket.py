"""Integration tests for WebSocket functionality."""

import asyncio
import json
import pytest
import socketio
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch

from app.api.main import app
from app.services.state_manager import state_manager
from app.services.websocket_service import get_websocket_service


class TestWebSocketIntegration:
    """Test WebSocket integration functionality."""
    
    @pytest.fixture
    def client(self):
        """Create test client."""
        return TestClient(app)
    
    @pytest.fixture
    async def websocket_service(self):
        """Create WebSocket service for testing."""
        return get_websocket_service(state_manager)
    
    def test_websocket_info_endpoint(self, client):
        """Test WebSocket info endpoint."""
        response = client.get("/api/v1/websocket/info")
        assert response.status_code == 200
        
        data = response.json()
        assert "websocket_url" in data
        assert data["websocket_url"] == "/ws"
        assert "events" in data
        assert "client_to_server" in data["events"]
        assert "server_to_client" in data["events"]
        
        # Check expected events
        client_events = data["events"]["client_to_server"]
        assert "connect" in client_events
        assert "disconnect" in client_events
        assert "request_status" in client_events
        assert "request_logs" in client_events
        
        server_events = data["events"]["server_to_client"]
        assert "position_update" in server_events
        assert "status_update" in server_events
        assert "logs_update" in server_events
        assert "log_entry" in server_events
        assert "error" in server_events
    
    def test_websocket_stats_endpoint(self, client):
        """Test WebSocket stats endpoint."""
        response = client.get("/api/v1/websocket/stats")
        assert response.status_code == 200
        
        data = response.json()
        assert "connected_clients" in data
        assert "client_ids" in data
        assert "update_loop_running" in data
        assert "service_status" in data
        
        # Initially no clients should be connected
        assert data["connected_clients"] == 0
        assert data["client_ids"] == []
    
    def test_broadcast_position_endpoint(self, client):
        """Test manual position broadcast endpoint."""
        position_data = {
            "current": {
                "pitch_rad": 0.5,
                "yaw_rad": 1.0,
                "pitch_deg": 28.65,
                "yaw_deg": 57.3
            },
            "timestamp": "2024-01-01T12:00:00"
        }
        
        response = client.post("/api/v1/websocket/broadcast/position", json=position_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["message"] == "Position update broadcasted"
        assert data["clients_notified"] == 0  # No clients connected in test
        assert data["data"] == position_data
    
    def test_broadcast_status_endpoint(self, client):
        """Test manual status broadcast endpoint."""
        status_data = {
            "is_connected": True,
            "is_calibrated": True,
            "mode": "simulation",
            "state": "idle",
            "errors": [],
            "timestamp": "2024-01-01T12:00:00"
        }
        
        response = client.post("/api/v1/websocket/broadcast/status", json=status_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["message"] == "Status update broadcasted"
        assert data["clients_notified"] == 0  # No clients connected in test
        assert data["data"] == status_data
    
    def test_broadcast_log_endpoint(self, client):
        """Test manual log broadcast endpoint."""
        log_entry = "Test log message"
        
        response = client.post(
            "/api/v1/websocket/broadcast/log",
            params={"log_entry": log_entry}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["message"] == "Log entry broadcasted"
        assert data["clients_notified"] == 0  # No clients connected in test
        assert data["log_entry"] == log_entry
    
    @pytest.mark.asyncio
    async def test_websocket_service_lifecycle(self, websocket_service):
        """Test WebSocket service start/stop lifecycle."""
        # Initially not running
        assert not websocket_service._running
        assert websocket_service._update_task is None
        
        # Start service
        await websocket_service.start_updates()
        assert websocket_service._running
        assert websocket_service._update_task is not None
        
        # Stop service
        await websocket_service.stop_updates()
        assert not websocket_service._running
        assert websocket_service._update_task is None
    
    @pytest.mark.asyncio
    async def test_websocket_data_methods(self, websocket_service):
        """Test WebSocket service data retrieval methods."""
        # Test position data
        position_data = await websocket_service._get_position_data()
        assert "current" in position_data
        assert "timestamp" in position_data
        assert "pitch_rad" in position_data["current"]
        assert "yaw_rad" in position_data["current"]
        assert "pitch_deg" in position_data["current"]
        assert "yaw_deg" in position_data["current"]
        
        # Test status data
        status_data = await websocket_service._get_status_data()
        assert "is_connected" in status_data
        assert "is_calibrated" in status_data
        assert "mode" in status_data
        assert "state" in status_data
        assert "errors" in status_data
        assert "timestamp" in status_data
        
        # Test logs data
        logs_data = await websocket_service._get_logs_data()
        assert "logs" in logs_data
        assert "count" in logs_data
        assert "timestamp" in logs_data
    
    @pytest.mark.asyncio
    async def test_websocket_position_change_detection(self, websocket_service):
        """Test position change detection logic."""
        # No previous position should trigger change
        current_pos = {
            "current": {"pitch_deg": 10.0, "yaw_deg": 20.0}
        }
        assert websocket_service._position_changed(None, current_pos)
        
        # Small change should not trigger
        last_pos = {
            "current": {"pitch_deg": 10.0, "yaw_deg": 20.0}
        }
        current_pos = {
            "current": {"pitch_deg": 10.05, "yaw_deg": 20.05}
        }
        assert not websocket_service._position_changed(last_pos, current_pos)
        
        # Large change should trigger
        current_pos = {
            "current": {"pitch_deg": 15.0, "yaw_deg": 25.0}
        }
        assert websocket_service._position_changed(last_pos, current_pos)
    
    @pytest.mark.asyncio
    async def test_websocket_status_change_detection(self, websocket_service):
        """Test status change detection logic."""
        # No previous status should trigger change
        current_status = {
            "is_connected": True,
            "mode": "simulation",
            "state": "idle",
            "errors": []
        }
        assert websocket_service._status_changed(None, current_status)
        
        # Same status should not trigger
        last_status = current_status.copy()
        assert not websocket_service._status_changed(last_status, current_status)
        
        # Different connection status should trigger
        current_status["is_connected"] = False
        assert websocket_service._status_changed(last_status, current_status)
        
        # Different mode should trigger
        current_status["is_connected"] = True
        current_status["mode"] = "hardware"
        assert websocket_service._status_changed(last_status, current_status)
        
        # Different error count should trigger
        current_status["mode"] = "simulation"
        current_status["errors"] = ["test error"]
        assert websocket_service._status_changed(last_status, current_status)
    
    @pytest.mark.asyncio
    async def test_websocket_broadcast_methods(self, websocket_service):
        """Test WebSocket broadcast methods."""
        # Mock the socketio emit method
        websocket_service.sio.emit = AsyncMock()
        
        # Add a fake client
        websocket_service.connected_clients.add("test_client")
        
        # Test position broadcast
        position_data = {"test": "position"}
        await websocket_service.broadcast_position_update(position_data)
        websocket_service.sio.emit.assert_called_with('position_update', position_data)
        
        # Test status broadcast
        status_data = {"test": "status"}
        await websocket_service.broadcast_status_update(status_data)
        websocket_service.sio.emit.assert_called_with('status_update', status_data)
        
        # Test log broadcast
        log_entry = "test log"
        await websocket_service.broadcast_log_update(log_entry)
        
        # Check that log_entry event was called with correct structure
        call_args = websocket_service.sio.emit.call_args
        assert call_args[0][0] == 'log_entry'
        log_data = call_args[0][1]
        assert log_data["log"] == log_entry
        assert "timestamp" in log_data
        # Timestamp should be an ISO string
        assert isinstance(log_data["timestamp"], str)
    
    def test_deprecated_sse_endpoints_still_work(self, client):
        """Test that deprecated SSE endpoints still work but are marked deprecated."""
        # Test stream-updates endpoint
        with client.stream("GET", "/stream-updates") as response:
            assert response.status_code == 200
            assert response.headers["content-type"] == "text/event-stream; charset=utf-8"
            # Just check that it starts streaming, don't wait for actual data
        
        # Test stream-logs endpoint  
        with client.stream("GET", "/stream-logs") as response:
            assert response.status_code == 200
            assert response.headers["content-type"] == "text/event-stream; charset=utf-8"
            # Just check that it starts streaming, don't wait for actual data


class TestWebSocketClientSimulation:
    """Test WebSocket functionality with simulated client connections."""
    
    @pytest.fixture
    async def websocket_service(self):
        """Create WebSocket service for testing."""
        service = get_websocket_service(state_manager)
        await service.start_updates()
        yield service
        await service.stop_updates()
    
    @pytest.mark.asyncio
    async def test_client_connection_simulation(self, websocket_service):
        """Test simulated client connection and disconnection."""
        # Mock the socketio server methods
        websocket_service.sio.emit = AsyncMock()
        
        # Simulate client connection
        client_id = "test_client_123"
        
        # Manually add client (simulating connection)
        websocket_service.connected_clients.add(client_id)
        
        # Test initial state sending
        await websocket_service._send_initial_state(client_id)
        
        # Verify that initial state was sent
        assert websocket_service.sio.emit.call_count >= 3  # position, status, logs
        
        # Check that position_update was called
        calls = websocket_service.sio.emit.call_args_list
        event_names = [call[0][0] for call in calls]
        assert 'position_update' in event_names
        assert 'status_update' in event_names
        assert 'logs_update' in event_names
        
        # Simulate client disconnection
        websocket_service.connected_clients.discard(client_id)
        assert client_id not in websocket_service.connected_clients
    
    @pytest.mark.asyncio
    async def test_update_loop_with_clients(self, websocket_service):
        """Test update loop behavior with connected clients."""
        # Mock the socketio server methods
        websocket_service.sio.emit = AsyncMock()
        
        # Add simulated clients
        websocket_service.connected_clients.add("client1")
        websocket_service.connected_clients.add("client2")
        
        # Let the update loop run for a short time
        await asyncio.sleep(0.2)  # Let it run for 200ms
        
        # Verify that updates were sent
        assert websocket_service.sio.emit.called
        
        # Check that position updates were sent
        calls = websocket_service.sio.emit.call_args_list
        position_calls = [call for call in calls if call[0][0] == 'position_update']
        assert len(position_calls) > 0
    
    @pytest.mark.asyncio
    async def test_error_handling_in_update_loop(self, websocket_service):
        """Test error handling in the update loop."""
        # Mock the position data method to raise an exception
        original_method = websocket_service._get_position_data
        websocket_service._get_position_data = AsyncMock(side_effect=Exception("Test error"))
        
        # Add a client to trigger updates
        websocket_service.connected_clients.add("test_client")
        
        # Let the update loop run and handle the error
        await asyncio.sleep(0.1)
        
        # Restore original method
        websocket_service._get_position_data = original_method
        
        # The service should still be running despite the error
        assert websocket_service._running