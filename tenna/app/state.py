import threading

class AppState:
    def __init__(self):
        self.lock = threading.Lock()
        self.mode = "simulation"
        self.antenna_position_gps = {"lat": 45.420109, "lon": -75.680510, "alt": 60}
        self.rocket_position_gps = {"lat": 45.421413, "lon": -75.680510, "alt": 205}
        self.manual_target_rad = {"pitch": 0.0, "yaw": 0.0}
        self.current_position_rad = {"pitch": 0.0, "yaw": 0.0}
        self.logs = []
        self.log_lock = threading.Lock()

state = AppState() 