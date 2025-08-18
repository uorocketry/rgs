#!/usr/bin/env python3
"""
Prediction service for gps-ingest.

Self-managed background process that ingests GPS samples (from the Rust gps-ingest
binary or from test coordinates), maintains a short history, and exposes the
latest GPS and a next-position prediction. Also provides geodesy helpers for
antenna pointing.
"""

from __future__ import annotations

import json
import math
import select
import shlex
import subprocess
import threading
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import List, Optional, Tuple

try:
    import numpy as np
except Exception:  # pragma: no cover - optional dependency
    np = None  # type: ignore


# -----------------------
# Configuration and Models
# -----------------------

@dataclass
class AntennaLimits:
    yaw_deg: Tuple[float, float] = (-80.0, 80.0)
    pitch_deg: Tuple[float, float] = (-10.0, 90.0)


@dataclass
class PredictorConfig:
    # Antenna site
    antenna_lat_deg: float = 48.48058344683317
    antenna_lon_deg: float = -81.33124126482966
    antenna_alt_m: float = 300.0
    antenna_yaw_zero_deg: float = 180.0  # yaw-zero = South
    yaw_normalization: str = "pm180"  # "pm180" or "0to360"

    # Data source
    use_real_gps_ingest: bool = False
    gps_ingest_cmd: str = "cargo run -p gps-ingest"
    test_target_lat_deg: float = 48.48158344683317
    test_target_lon_deg: float = -81.33124126482966
    test_target_alt_m: float = 301.0

    # Prediction/history
    num_samples: int = 1  # how many samples to keep (and fit). 1 means latest only

    # Limits
    limits: AntennaLimits = field(default_factory=AntennaLimits)


@dataclass
class GpsSample:
    lat: float
    lon: float
    alt_m: float
    ts_iso: str
    source: str
    t_epoch: float


@dataclass
class Prediction:
    lat: float
    lon: float
    alt_m: float
    confidence: float
    ts_iso: str


# -----------------------
# Prediction Service
# -----------------------

class PredictorService:
    def __init__(self, config: PredictorConfig):
        self.config = config
        self._history: List[GpsSample] = []
        self._history_lock = threading.Lock()
        self._stop = threading.Event()
        self._thread: Optional[threading.Thread] = None
        self._last_prediction: Optional[Prediction] = None

    # ---- Public API ----
    def start(self) -> None:
        if self._thread and self._thread.is_alive():
            return
        self._stop.clear()
        self._thread = threading.Thread(target=self._run_loop, name="PredictorService", daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self._stop.set()
        if self._thread:
            self._thread.join(timeout=2)

    def get_history(self) -> List[GpsSample]:
        with self._history_lock:
            return list(self._history)

    def get_latest(self) -> Optional[GpsSample]:
        with self._history_lock:
            return self._history[-1] if self._history else None

    def get_prediction(self) -> Optional[Prediction]:
        return self._last_prediction

    # ---- Internal loop ----
    def _run_loop(self) -> None:
        if self.config.use_real_gps_ingest:
            self._loop_real()
        else:
            self._loop_test()

    def _loop_test(self) -> None:
        # Emit the same test coordinate repeatedly, no timeout
        while not self._stop.is_set():
            now = datetime.now(timezone.utc).isoformat()
            sample = GpsSample(
                lat=self.config.test_target_lat_deg,
                lon=self.config.test_target_lon_deg,
                alt_m=self.config.test_target_alt_m,
                ts_iso=now,
                source="test",
                t_epoch=time.time(),
            )
            self._push_sample(sample)
            self._compute_prediction()
            self._stop.wait(0.5)

    def _loop_real(self) -> None:
        # Spawn gps-ingest and stream lines indefinitely
        while not self._stop.is_set():
            try:
                cmd = shlex.split(self.config.gps_ingest_cmd)
                proc = subprocess.Popen(
                    cmd,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                )
            except Exception:
                # Backoff if launching fails
                self._stop.wait(1.0)
                continue

            try:
                assert proc.stdout is not None
                while not self._stop.is_set():
                    rlist, _, _ = select.select([proc.stdout], [], [], 0.5)
                    if not rlist:
                        if proc.poll() is not None:
                            break
                        continue
                    line = proc.stdout.readline()
                    if not line:
                        if proc.poll() is not None:
                            break
                        continue
                    line = line.strip()
                    if not (line.startswith("{") and line.endswith("}")):
                        continue
                    try:
                        data = json.loads(line)
                    except Exception:
                        continue
                    if (
                        data.get("lat") is None
                        or data.get("lon") is None
                        or data.get("altitude_m") is None
                        or data.get("ts") is None
                    ):
                        continue
                    sample = GpsSample(
                        lat=float(data["lat"]),
                        lon=float(data["lon"]),
                        alt_m=float(data["altitude_m"]),
                        ts_iso=str(data["ts"]),
                        source=str(data.get("source", "gps-ingest")),
                        t_epoch=time.time(),
                    )
                    self._push_sample(sample)
                    self._compute_prediction()
            finally:
                try:
                    if proc.poll() is None:
                        proc.terminate()
                        try:
                            proc.wait(timeout=1)
                        except subprocess.TimeoutExpired:
                            proc.kill()
                except Exception:
                    pass

    def _push_sample(self, sample: GpsSample) -> None:
        with self._history_lock:
            self._history.append(sample)
            if self.config.num_samples > 0 and len(self._history) > self.config.num_samples:
                self._history = self._history[-self.config.num_samples :]

    # -----------------------
    # Prediction and Geodesy
    # -----------------------
    def _compute_prediction(self) -> None:
        hist = self.get_history()
        if not hist:
            self._last_prediction = None
            return
        if len(hist) == 1 or np is None:
            s = hist[-1]
            self._last_prediction = Prediction(
                lat=s.lat,
                lon=s.lon,
                alt_m=s.alt_m,
                confidence=0.5,
                ts_iso=datetime.now(timezone.utc).isoformat(),
            )
            return
        # Fit linear model per component
        times = [s.t_epoch for s in hist]
        lats = [s.lat for s in hist]
        lons = [s.lon for s in hist]
        alts = [s.alt_m for s in hist]
        t0 = times[0]
        t_rel = [t - t0 for t in times]
        t_future = (times[-1] + 1.0) - t0
        try:
            lat_slope, lat_intercept = np.polyfit(t_rel, lats, 1)  # type: ignore[attr-defined]
            lon_slope, lon_intercept = np.polyfit(t_rel, lons, 1)  # type: ignore[attr-defined]
            alt_slope, alt_intercept = np.polyfit(t_rel, alts, 1)  # type: ignore[attr-defined]
            pred_lat = float(lat_slope * t_future + lat_intercept)
            pred_lon = float(lon_slope * t_future + lon_intercept)
            pred_alt = float(alt_slope * t_future + alt_intercept)
            confidence = 0.9 if len(hist) >= 5 else 0.7
        except Exception:
            s = hist[-1]
            pred_lat, pred_lon, pred_alt, confidence = s.lat, s.lon, s.alt_m, 0.5
        self._last_prediction = Prediction(
            lat=pred_lat,
            lon=pred_lon,
            alt_m=pred_alt,
            confidence=confidence,
            ts_iso=datetime.now(timezone.utc).isoformat(),
        )

    # WGS84 constants
    _WGS84_A = 6378137.0
    _WGS84_F = 1.0 / 298.257223563
    _WGS84_E2 = _WGS84_F * (2.0 - _WGS84_F)

    # Geodesy helpers
    @staticmethod
    def _geodetic_to_ecef(lat_deg: float, lon_deg: float, h_m: float) -> Tuple[float, float, float]:
        lat = math.radians(lat_deg)
        lon = math.radians(lon_deg)
        sin_lat = math.sin(lat)
        cos_lat = math.cos(lat)
        sin_lon = math.sin(lon)
        cos_lon = math.cos(lon)
        N = PredictorService._WGS84_A / math.sqrt(1.0 - PredictorService._WGS84_E2 * sin_lat * sin_lat)
        x = (N + h_m) * cos_lat * cos_lon
        y = (N + h_m) * cos_lat * sin_lon
        z = (N * (1.0 - PredictorService._WGS84_E2) + h_m) * sin_lat
        return x, y, z

    @staticmethod
    def _ecef_to_enu(dx: Tuple[float, float, float], lat0_deg: float, lon0_deg: float) -> Tuple[float, float, float]:
        lat0 = math.radians(lat0_deg)
        lon0 = math.radians(lon0_deg)
        sin_lat = math.sin(lat0)
        cos_lat = math.cos(lat0)
        sin_lon = math.sin(lon0)
        cos_lon = math.cos(lon0)
        dx_x, dx_y, dx_z = dx
        e = -sin_lon * dx_x + cos_lon * dx_y
        n = -sin_lat * cos_lon * dx_x - sin_lat * sin_lon * dx_y + cos_lat * dx_z
        u = cos_lat * cos_lon * dx_x + cos_lat * sin_lon * dx_y + sin_lat * dx_z
        return e, n, u

    @staticmethod
    def initial_bearing_deg(lat1_deg: float, lon1_deg: float, lat2_deg: float, lon2_deg: float) -> float:
        lat1 = math.radians(lat1_deg)
        lat2 = math.radians(lat2_deg)
        dlon = math.radians(lon2_deg - lon1_deg)
        x = math.sin(dlon) * math.cos(lat2)
        y = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(dlon)
        brng = math.degrees(math.atan2(x, y))
        return PredictorService.normalize_angle_0_360(brng)

    @staticmethod
    def normalize_angle_0_360(deg: float) -> float:
        return (deg % 360.0 + 360.0) % 360.0

    @staticmethod
    def normalize_angle_pm180(deg: float) -> float:
        d = PredictorService.normalize_angle_0_360(deg)
        return d - 360.0 if d > 180.0 else d

    def rotation_from_yaw_zero(self, bearing_deg: float) -> float:
        raw = bearing_deg - self.config.antenna_yaw_zero_deg
        if self.config.yaw_normalization == "0to360":
            return PredictorService.normalize_angle_0_360(raw)
        return PredictorService.normalize_angle_pm180(raw)

    def compute_az_el(self, tgt_lat: float, tgt_lon: float, tgt_alt: float) -> Tuple[float, float]:
        x_o, y_o, z_o = self._geodetic_to_ecef(
            self.config.antenna_lat_deg, self.config.antenna_lon_deg, self.config.antenna_alt_m
        )
        x_t, y_t, z_t = self._geodetic_to_ecef(tgt_lat, tgt_lon, tgt_alt)
        e, n, u = self._ecef_to_enu((x_t - x_o, y_t - y_o, z_t - z_o), self.config.antenna_lat_deg, self.config.antenna_lon_deg)
        az = math.degrees(math.atan2(e, n))
        if az < 0:
            az += 360.0
        el = math.degrees(math.atan2(u, math.hypot(e, n)))
        return az, el


