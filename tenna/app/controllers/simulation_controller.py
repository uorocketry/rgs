import time
import pybullet as p
import pybullet_data
from app.state import state
from app.utils.helpers import calculate_pitch_yaw, calculate_unbounded_target

# --- Physics Simulation Setup ---
physicsClient = p.connect(p.DIRECT)
p.setAdditionalSearchPath(pybullet_data.getDataPath())
p.setGravity(0, 0, -9.8)
planeId = p.loadURDF("plane.urdf")
turretId = p.loadURDF("static/turret.urdf", [0, 0, 0])

joint_name_to_index = {p.getJointInfo(turretId, i)[1].decode('UTF-8'): i for i in range(p.getNumJoints(turretId))}
yaw_joint_index = joint_name_to_index['yaw_joint']
pitch_joint_index = joint_name_to_index['pitch_joint']

# --- Explicit Motor Parameters ---
MAX_TORQUE = 5.76
MAX_VELOCITY = 603.19

def simulation_loop():
    while True:
        logical_target_rad = {"pitch": 0.0, "yaw": 0.0}
        with state.lock:
            if state.mode == "tracking":
                logical_target_rad = calculate_pitch_yaw(state.rocket_position_gps, state.antenna_position_gps)
            else: # manual mode
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
        
        # Update shared state
        pitch_state = p.getJointState(turretId, pitch_joint_index)
        yaw_state = p.getJointState(turretId, yaw_joint_index)
        with state.lock:
            state.current_position_rad["pitch"] = pitch_state[0]
            state.current_position_rad["yaw"] = yaw_state[0]

        time.sleep(1./240.) 