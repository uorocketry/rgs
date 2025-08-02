import asyncio
import threading
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.services.state_manager import state_manager
from app.controllers import simulation_controller, odrive_controller

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("Starting up...")
    thread = None
    current_mode = state_manager.mode.value
    if current_mode == "simulation":
        print("Initial mode: simulation")
        thread = threading.Thread(target=simulation_controller.simulation_loop, daemon=True)
    elif current_mode == "hardware":  # Updated from "odrive" to match new enum
        print("Initial mode: hardware")
        if odrive_controller.odrive_setup():
            thread = threading.Thread(target=odrive_controller.odrive_loop, daemon=True)
        else:
            print("ODrive setup failed, falling back to simulation mode.")
            state_manager.set_mode("simulation")
            thread = threading.Thread(target=simulation_controller.simulation_loop, daemon=True)
    
    if thread:
        thread.start()
    
    yield
    
    # Shutdown logic (if any)
    print("Shutting down...")


app = FastAPI(lifespan=lifespan)

class Target(BaseModel): pitch: float; yaw: float
class Position(BaseModel): lat: float; lon: float; alt: float
class Mode(BaseModel): 
    mode: str

@app.post("/set-mode")
def set_mode(mode: Mode):
    # Map old mode names to new ones for backward compatibility
    mode_mapping = {
        "tracking": "simulation",  # Legacy mode
        "manual": "simulation",    # Legacy mode
        "simulation": "simulation",
        "odrive": "hardware",      # Map old "odrive" to new "hardware"
        "hardware": "hardware"
    }
    
    if mode.mode in mode_mapping:
        mapped_mode = mode_mapping[mode.mode]
        if state_manager.set_mode(mapped_mode):
            return {"message": f"Mode set to {mapped_mode}"}
        else:
            return {"message": f"Failed to set mode to {mapped_mode}"}
    return {"message": "Invalid mode"}

@app.post("/set-target")
def set_target(target: Target):
    state_manager.manual_target_rad = {"pitch": target.pitch, "yaw": target.yaw}
    return {"message": "Manual target set"}

@app.post("/set-rocket-position")
def set_rocket_position(position: Position):
    state_manager.set_rocket_position_gps(position.lat, position.lon, position.alt)
    return {"message": "Rocket position updated"}

@app.post("/set-antenna-position")
def set_antenna_position(position: Position):
    state_manager.set_antenna_position_gps(position.lat, position.lon, position.alt)
    return {"message": "Antenna position updated"}

@app.get("/stream-updates")
async def stream_updates(request: Request):
    async def event_generator():
        while True:
            if await request.is_disconnected(): break
            
            data = state_manager.get_current_position_dict()
            pitch_state = data.get("pitch", 0)
            yaw_state = data.get("yaw", 0)

            data_str = f'{{"pitch": {pitch_state}, "yaw": {yaw_state}}}'
            yield f"data: {data_str}\n\n"
            await asyncio.sleep(1.0 / 60.0)
    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.get("/stream-logs")
async def stream_logs(request: Request):
    async def log_generator():
        last_log_index = 0
        while True:
            if await request.is_disconnected(): break
            logs = state_manager.logs
            if last_log_index < len(logs):
                for i in range(last_log_index, len(logs)):
                    yield f"data: {logs[i]}\\n\\n"
                last_log_index = len(logs)
            await asyncio.sleep(0.1)
    return StreamingResponse(log_generator(), media_type="text/event-stream")

app.mount("/", StaticFiles(directory="static", html=True), name="static") 