import math
from typing import Dict

def calculate_pitch_yaw(rocket_gps: Dict, antenna_gps: Dict) -> Dict[str, float]:
    rocket_lat_rad = math.radians(rocket_gps["lat"])
    rocket_lon_rad = math.radians(rocket_gps["lon"])
    antenna_lat_rad = math.radians(antenna_gps["lat"])
    d_lon = math.radians(rocket_gps["lon"] - antenna_gps["lon"])
    d_lat = rocket_lat_rad - antenna_lat_rad

    a = math.sin(d_lat / 2)**2 + math.cos(antenna_lat_rad) * math.cos(rocket_lat_rad) * math.sin(d_lon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = 6371000 * c

    y = math.sin(d_lon) * math.cos(rocket_lat_rad)
    x = math.cos(antenna_lat_rad) * math.sin(rocket_lat_rad) - math.sin(antenna_lat_rad) * math.cos(rocket_lat_rad) * math.cos(d_lon)
    yaw_rad = math.atan2(y, x)

    alt_diff = rocket_gps["alt"] - antenna_gps["alt"]
    pitch_rad = math.atan2(alt_diff, distance) if distance > 1 else math.pi / 2

    return {"pitch": max(0, min(math.pi / 2, pitch_rad)), "yaw": -yaw_rad}

def calculate_unbounded_target(current_angle_rad: float, logical_target_rad: float) -> float:
    pi2 = 2 * math.pi
    error = logical_target_rad - (current_angle_rad % pi2)
    if error > math.pi:
        error -= pi2
    elif error < -math.pi:
        error += pi2
    return current_angle_rad + error 