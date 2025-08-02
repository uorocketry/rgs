"""Enhanced FastAPI application with organized route modules and proper error handling."""

import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exception_handlers import http_exception_handler
from pydantic import BaseModel

from app.api.dependencies import (
    handle_motor_control_exceptions, create_error_response,
    initialize_motor_service, shutdown_motor_service
)
from app.api.routes import motor_router, status_router, config_router, websocket_router
from app.core.exceptions import MotorControlError
from app.services.state_manager import state_manager
from app.services.websocket_service import get_websocket_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management."""
    # Startup logic
    logger.info("Starting motor control service...")
    
    # Initialize motor service
    await initialize_motor_service()
    logger.info("Motor service initialized")
    
    # Start WebSocket service (only if not in test mode)
    import os
    if not os.getenv("TESTING", "false").lower() == "true":
        ws_service = get_websocket_service(state_manager)
        await ws_service.start_updates()
        logger.info("WebSocket service started")
    else:
        logger.info("WebSocket service startup skipped (test mode)")
    
    yield
    
    # Shutdown logic
    logger.info("Shutting down motor control service...")
    
    # Stop WebSocket service (only if not in test mode)
    if not os.getenv("TESTING", "false").lower() == "true":
        ws_service = get_websocket_service(state_manager)
        await ws_service.stop_updates()
        logger.info("WebSocket service stopped")
    else:
        logger.info("WebSocket service shutdown skipped (test mode)")
    
    # Shutdown motor service
    await shutdown_motor_service()
    logger.info("Motor service shutdown complete")


# Create FastAPI application
app = FastAPI(
    title="Motor Control Service API",
    description="Professional motor control service with ODrive hardware and simulation support",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add global exception handling middleware
app.middleware("http")(handle_motor_control_exceptions)


# Custom exception handlers
@app.exception_handler(MotorControlError)
async def motor_control_exception_handler(request: Request, exc: MotorControlError):
    """Handle motor control specific exceptions."""
    from app.api.dependencies import map_exception_to_status_code
    status_code = map_exception_to_status_code(exc)
    return create_error_response(exc, status_code)


@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions with consistent error format."""
    return await http_exception_handler(request, exc)


# Include API route modules with versioned prefix
API_PREFIX = "/api/v1"
app.include_router(motor_router, prefix=API_PREFIX)
app.include_router(status_router, prefix=API_PREFIX)
app.include_router(config_router, prefix=API_PREFIX)
app.include_router(websocket_router, prefix=API_PREFIX)


# Legacy endpoints for backward compatibility
class Target(BaseModel): 
    pitch: float
    yaw: float

class Position(BaseModel): 
    lat: float
    lon: float
    alt: float

class Mode(BaseModel): 
    mode: str


@app.post("/set-mode", tags=["legacy"], deprecated=True)
async def set_mode_legacy(mode: Mode):
    """Legacy endpoint for setting mode. Use /api/v1/motor/mode instead."""
    logger.warning("Using deprecated endpoint /set-mode. Use /api/v1/motor/mode instead.")
    
    mode_mapping = {
        "tracking": "simulation",
        "manual": "simulation",
        "simulation": "simulation",
        "odrive": "hardware",
        "hardware": "hardware"
    }
    
    if mode.mode in mode_mapping:
        mapped_mode = mode_mapping[mode.mode]
        if await state_manager.set_mode_from_string(mapped_mode):
            return {"message": f"Mode set to {mapped_mode}"}
        else:
            return {"message": f"Failed to set mode to {mapped_mode}"}
    return {"message": "Invalid mode"}


@app.post("/set-target", tags=["legacy"], deprecated=True)
async def set_target_legacy(target: Target):
    """Legacy endpoint for setting target. Use /api/v1/motor/position instead."""
    logger.warning("Using deprecated endpoint /set-target. Use /api/v1/motor/position instead.")
    
    await state_manager.set_manual_target_rad({"pitch": target.pitch, "yaw": target.yaw})
    return {"message": "Manual target set"}


@app.post("/set-rocket-position", tags=["legacy"], deprecated=True)
async def set_rocket_position_legacy(position: Position):
    """Legacy endpoint for setting rocket position. Use /api/v1/motor/gps/rocket instead."""
    logger.warning("Using deprecated endpoint /set-rocket-position. Use /api/v1/motor/gps/rocket instead.")
    
    await state_manager.set_rocket_position_gps(position.lat, position.lon, position.alt)
    return {"message": "Rocket position updated"}


@app.post("/set-antenna-position", tags=["legacy"], deprecated=True)
async def set_antenna_position_legacy(position: Position):
    """Legacy endpoint for setting antenna position. Use /api/v1/motor/gps/antenna instead."""
    logger.warning("Using deprecated endpoint /set-antenna-position. Use /api/v1/motor/gps/antenna instead.")
    
    await state_manager.set_antenna_position_gps(position.lat, position.lon, position.alt)
    return {"message": "Antenna position updated"}


# Streaming endpoints (deprecated - use WebSocket instead)
@app.get("/stream-updates", tags=["streaming"], deprecated=True)
async def stream_updates(request: Request):
    """Stream real-time position updates via Server-Sent Events. 
    
    DEPRECATED: Use WebSocket connection at /ws for real-time updates instead.
    """
    async def event_generator():
        import os
        test_mode = os.getenv("TESTING", "false").lower() == "true"
        iteration_count = 0
        max_iterations = 3 if test_mode else float('inf')
        
        while iteration_count < max_iterations:
            if await request.is_disconnected(): 
                break
            
            try:
                data = await state_manager.get_current_position_dict()
                pitch_state = data.get("pitch", 0)
                yaw_state = data.get("yaw", 0)

                data_str = f'{{"pitch": {pitch_state}, "yaw": {yaw_state}}}'
                yield f"data: {data_str}\n\n"
                
                iteration_count += 1
                if test_mode and iteration_count >= max_iterations:
                    break
                    
                await asyncio.sleep(1.0 / 60.0)
            except Exception as e:
                logger.error(f"Error in stream updates: {str(e)}")
                yield f"data: {{'error': 'Stream error'}}\n\n"
                break
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.get("/stream-logs", tags=["streaming"], deprecated=True)
async def stream_logs(request: Request):
    """Stream real-time log updates via Server-Sent Events.
    
    DEPRECATED: Use WebSocket connection at /ws for real-time updates instead.
    """
    async def log_generator():
        import os
        test_mode = os.getenv("TESTING", "false").lower() == "true"
        iteration_count = 0
        max_iterations = 3 if test_mode else float('inf')
        last_log_index = 0
        
        while iteration_count < max_iterations:
            if await request.is_disconnected(): 
                break
            
            try:
                # Get errors as simplified logs
                errors = await state_manager.get_errors()
                if last_log_index < len(errors):
                    for i in range(last_log_index, len(errors)):
                        yield f"data: {errors[i]}\n\n"
                    last_log_index = len(errors)
                else:
                    # Send a heartbeat in test mode
                    if test_mode:
                        yield f"data: No new logs\n\n"
                
                iteration_count += 1
                if test_mode and iteration_count >= max_iterations:
                    break
                    
                await asyncio.sleep(0.1)
            except Exception as e:
                logger.error(f"Error in stream logs: {str(e)}")
                yield f"data: Log stream error\n\n"
                break
    
    return StreamingResponse(log_generator(), media_type="text/event-stream")


# Root endpoint
@app.get("/", tags=["root"])
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Motor Control Service API",
        "version": "1.0.0",
        "api_prefix": API_PREFIX,
        "docs_url": "/docs",
        "health_check": f"{API_PREFIX}/status/health"
    }


# Mount WebSocket service
ws_service = get_websocket_service(state_manager)
app.mount("/ws", ws_service.get_asgi_app())

# Mount static files (for frontend)
app.mount("/static", StaticFiles(directory="static", html=True), name="static") 