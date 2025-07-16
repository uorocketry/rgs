import threading
import time
import math
import pybullet as p
import pybullet_data
from typing import Dict
import asyncio
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

app = FastAPI()

# --- Global State Management (Unchanged) ---
class AppState:
    def __init__(self):
        self.lock = threading.Lock()
        self.mode = "tracking"
        self.antenna_position_gps = {"lat": 45.420109, "lon": -75.680510, "alt": 60}
        self.rocket_position_gps = {"lat": 45.421413, "lon": -75.680510, "alt": 205}
        self.manual_target_rad = {"pitch": 0.0, "yaw": 0.0}

state = AppState()

# --- Physics Simulation Setup (Unchanged) ---
physicsClient = p.connect(p.DIRECT)
p.setAdditionalSearchPath(pybullet_data.getDataPath())
p.setGravity(0, 0, -9.8)
planeId = p.loadURDF("plane.urdf")
turretId = p.loadURDF("static/turret.urdf", [0, 0, 0])

joint_name_to_index = {p.getJointInfo(turretId, i)[1].decode('UTF-8'): i for i in range(p.getNumJoints(turretId))}
yaw_joint_index = joint_name_to_index['yaw_joint']
pitch_joint_index = joint_name_to_index['pitch_joint']

# --- Explicit Motor Parameters (Unchanged) ---
MAX_TORQUE = 5.76
MAX_VELOCITY = 603.19

# --- MODIFIED: GPS Calculation with Yaw Inversion ---
def calculate_pitch_yaw(rocket_gps: Dict, antenna_gps: Dict) -> Dict[str, float]:
    rocket_lat_rad = math.radians(rocket_gps["lat"])
    rocket_lon_rad = math.radians(rocket_gps["lon"])
    antenna_lat_rad = math.radians(antenna_gps["lat"])
    d_lon = math.radians(rocket_gps["lon"] - antenna_gps["lon"])
    d_lat = rocket_lat_rad - antenna_lat_rad

    a = math.sin(d_lat / 2)**2 + math.cos(antenna_lat_rad) * math.cos(rocket_lat_rad) * math.sin(d_lon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = 6371000 * c

    # Standard bearing calculation (clockwise from North)
    y = math.sin(d_lon) * math.cos(rocket_lat_rad)
    x = math.cos(antenna_lat_rad) * math.sin(rocket_lat_rad) - math.sin(antenna_lat_rad) * math.cos(rocket_lat_rad) * math.cos(d_lon)
    yaw_rad = math.atan2(y, x)

    alt_diff = rocket_gps["alt"] - antenna_gps["alt"]
    pitch_rad = math.atan2(alt_diff, distance) if distance > 1 else math.pi / 2

    # THE FIX: Invert the yaw to match the robot's counter-clockwise joint rotation
    return {"pitch": max(0, min(math.pi / 2, pitch_rad)), "yaw": -yaw_rad}


# --- Helper function to prevent wrap-around (Unchanged) ---
def calculate_unbounded_target(current_angle_rad: float, logical_target_rad: float) -> float:
    pi2 = 2 * math.pi
    error = logical_target_rad - (current_angle_rad % pi2)
    if error > math.pi:
        error -= pi2
    elif error < -math.pi:
        error += pi2
    return current_angle_rad + error

# --- Simulation Loop (Unchanged) ---
def physics_simulation_loop():
    while True:
        logical_target_rad = {"pitch": 0.0, "yaw": 0.0}
        with state.lock:
            if state.mode == "tracking":
                logical_target_rad = calculate_pitch_yaw(state.rocket_position_gps, state.antenna_position_gps)
            else:
                logical_target_rad = state.manual_target_rad

        current_yaw_rad = p.getJointState(turretId, yaw_joint_index)[0]
        unbounded_yaw_target = calculate_unbounded_target(current_yaw_rad, logical_target_rad["yaw"])

        p.setJointMotorControl2(
            bodyUniqueId=turretId, jointIndex=yaw_joint_index, controlMode=p.POSITION_CONTROL,
            targetPosition=unbounded_yaw_target, force=MAX_TORQUE
        )
        p.setJointMotorControl2(
            bodyUniqueId=turretId, jointIndex=pitch_joint_index, controlMode=p.POSITION_CONTROL,
            targetPosition=logical_target_rad["pitch"], force=MAX_TORQUE
        )
        p.stepSimulation()
        time.sleep(1./240.)

# --- Pydantic Models and API Endpoints (Unchanged) ---
class Target(BaseModel): pitch: float; yaw: float
class Position(BaseModel): lat: float; lon: float; alt: float
class Mode(BaseModel): mode: str

@app.on_event("startup")
def startup_event():
    threading.Thread(target=physics_simulation_loop, daemon=True).start()

@app.post("/set-mode")
def set_mode(mode: Mode):
    with state.lock:
        if mode.mode in ["tracking", "manual"]:
            state.mode = mode.mode
            return {"message": f"Mode set to {state.mode}"}
    return {"message": "Invalid mode"}

@app.post("/set-target")
def set_target(target: Target):
    with state.lock:
        state.manual_target_rad = {"pitch": target.pitch, "yaw": target.yaw}
    return {"message": "Manual target set"}

@app.post("/set-rocket-position")
def set_rocket_position(position: Position):
    with state.lock:
        state.rocket_position_gps = {"lat": position.lat, "lon": position.lon, "alt": position.alt}
    return {"message": "Rocket position updated"}

@app.post("/set-antenna-position")
def set_antenna_position(position: Position):
    with state.lock:
        state.antenna_position_gps = {"lat": position.lat, "lon": position.lon, "alt": position.alt}
    return {"message": "Antenna position updated"}

@app.get("/stream-updates")
async def stream_updates(request: Request):
    async def event_generator():
        while True:
            if await request.is_disconnected(): break
            pitch_state = p.getJointState(turretId, pitch_joint_index)
            yaw_state = p.getJointState(turretId, yaw_joint_index)
            data_str = f'{{"pitch": {pitch_state[0]}, "yaw": {yaw_state[0]}}}'
            yield f"data: {data_str}\n\n"
            await asyncio.sleep(1.0 / 60.0)
    return StreamingResponse(event_generator(), media_type="text/event-stream")

app.mount("/", StaticFiles(directory="static", html=True), name="static")