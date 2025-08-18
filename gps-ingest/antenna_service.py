#!/usr/bin/env python3
"""
Antenna service abstraction used by gps-ingest REPL.

Provides a uniform API over either a real ODrive-backed antenna or a mock
software implementation when hardware is not available.
"""

from __future__ import annotations

import time
from dataclasses import dataclass
from typing import Dict, Tuple, Optional


@dataclass
class AntennaConfig:
    # Motion limits (degrees)
    limits_yaw_deg: Tuple[float, float] = (-80.0, 80.0)
    limits_pitch_deg: Tuple[float, float] = (-10.0, 90.0)
    # Gear ratios for converting degrees <-> motor turns (optional if using real controller differently)
    gear_ratio_yaw: float = 30.0
    gear_ratio_pitch: float = 36.0
    # Hardware toggles
    use_real_hardware: bool = True
    # Optional debug prints
    debug: bool = False
    # ODrive motor/controller settings
    pole_pairs: int = 7
    torque_constant: float = 8.27 / 150.0
    current_limit: float = 7.0
    regen_current_limit: float = 0.001
    dc_max_negative_current: float = -0.01
    dc_max_positive_current: float = 10.0
    calibration_current: float = 5.0
    calibration_timeout: float = 30.0
    # Controller gains
    pos_gain: float = 2.0
    vel_gain: float = 0.10
    vel_integrator_gain: float = 3.0
    # Trap trajectory defaults
    trap_vel_limit: float = 120.0
    trap_accel_limit: float = 20.0
    trap_decel_limit: float = 20.0


class AntennaService:
    """Facade for antenna control. Falls back to a mock implementation if hardware is not enabled."""

    def __init__(self, config: AntennaConfig):
        self.config = config
        self._connected = False
        self._configured = False
        self._calibrated = False
        self._engaged = False
        # Internal state (degrees)
        self._yaw_deg = 0.0
        self._pitch_deg = 0.0
        # Hardware handles (if any)
        self._device = None  # ODrive device
        self._axes: Dict[str, object] = {}  # {'yaw': axis0, 'pitch': axis1}
        self._offset_turns: Dict[str, float] = {"yaw": 0.0, "pitch": 0.0}
        # Lazily imported enums (only when hardware is enabled)
        self._AxisState = None
        self._ControlMode = None
        self._InputMode = None

    # ---- Lifecycle ----
    def connect(self) -> bool:
        if not self.config.use_real_hardware:
            self._connected = True
            return True
        try:
            import odrive  # type: ignore
            from odrive.enums import AxisState, ControlMode, InputMode  # type: ignore
            self._AxisState = AxisState
            self._ControlMode = ControlMode
            self._InputMode = InputMode
            print("AntennaService: Searching for ODrive...")
            self._device = odrive.find_any()
            if not self._device:
                print("AntennaService: no ODrive found")
                self._connected = False
                return False
            self._axes = {"yaw": self._device.axis0, "pitch": self._device.axis1}
            self._device.clear_errors()
            self._connected = True
            if self.config.debug:
                print(f"AntennaService: connected to ODrive serial {self._device.serial_number}")
            return True
        except Exception as e:  # pragma: no cover
            print("AntennaService: hardware connect failed:", e)
            self._connected = False
            return False

    def configure(self) -> bool:
        if not self._connected:
            return False
        if not self.config.use_real_hardware:
            self._configured = True
            return True
        try:
            dev = self._device
            assert dev is not None
            # Global device configuration
            dev.config.enable_brake_resistor = True
            dev.config.brake_resistance = 2.0
            dev.config.dc_max_negative_current = self.config.dc_max_negative_current
            dev.config.dc_max_positive_current = self.config.dc_max_positive_current
            dev.config.max_regen_current = self.config.regen_current_limit
            # Per-axis configuration
            for name, axis in self._axes.items():
                # Mirror manual.py behavior
                axis.controller.config.vel_limit = float('inf')
                mcfg = axis.motor.config
                ccfg = axis.controller.config
                tcfg = axis.trap_traj.config
                # Motor settings
                mcfg.pole_pairs = self.config.pole_pairs
                mcfg.torque_constant = self.config.torque_constant
                mcfg.current_lim = self.config.current_limit
                mcfg.calibration_current = self.config.calibration_current
                # Controller settings
                ccfg.input_mode = self._InputMode.TRAP_TRAJ
                ccfg.control_mode = self._ControlMode.POSITION_CONTROL
                ccfg.pos_gain = self.config.pos_gain
                ccfg.vel_gain = self.config.vel_gain
                ccfg.vel_integrator_gain = self.config.vel_integrator_gain
                # Trap trajectory limits
                tcfg.vel_limit = self.config.trap_vel_limit
                tcfg.accel_limit = self.config.trap_accel_limit
                tcfg.decel_limit = self.config.trap_decel_limit
                # Keep controller vel_limit in sync with trap traj
                ccfg.vel_limit = tcfg.vel_limit
                if name == 'yaw':
                    ccfg.circular_setpoints = False
            self._configured = True
            if self.config.debug:
                print("AntennaService: configured motors and controller")
            return True
        except Exception as e:
            print("AntennaService: configure failed:", e)
            return False

    def calibrate(self) -> bool:
        if not self._configured:
            return False
        if not self.config.use_real_hardware:
            self._calibrated = True
            return True
        try:
            dev = self._device
            assert dev is not None
            dev.clear_errors()
            timeout_s = self.config.calibration_timeout
            for name, ax in self._axes.items():
                if self.config.debug:
                    print(f"AntennaService: calibrating {name} axis...")
                ax.requested_state = self._AxisState.FULL_CALIBRATION_SEQUENCE
                start = time.time()
                while ax.current_state != self._AxisState.IDLE:
                    if time.time() - start > timeout_s:
                        print(f"AntennaService: calibration timed out for {name}")
                        return False
                    time.sleep(0.2)
                ax.requested_state = self._AxisState.CLOSED_LOOP_CONTROL
                time.sleep(0.5)
                if ax.error != 0:
                    try:
                        from odrive.utils import dump_errors  # type: ignore
                        dump_errors(dev)
                    except Exception:
                        pass
                    print(f"AntennaService: {name} axis error after calibration")
                    return False
                if self.config.debug:
                    print(f"AntennaService: {name} axis calibration complete")
            self._calibrated = True
            self._engaged = True
            if self.config.debug:
                print("AntennaService: calibration successful")
            return True
        except Exception as e:
            print("AntennaService: calibrate failed:", e)
            return False

    def engage(self) -> bool:
        if not self._calibrated:
            return False
        if not self.config.use_real_hardware:
            self._engaged = True
            return True
        try:
            for ax in self._axes.values():
                ax.requested_state = self._AxisState.CLOSED_LOOP_CONTROL
            time.sleep(0.2)
            self._engaged = True
            return not self._has_errors()
        except Exception:
            return False

    def disengage(self) -> bool:
        if not self.config.use_real_hardware:
            self._engaged = False
            return True
        try:
            for ax in self._axes.values():
                ax.requested_state = self._AxisState.IDLE
            time.sleep(0.2)
            self._engaged = False
            return not self._has_errors()
        except Exception:
            return False

    def stop(self) -> bool:
        if not self.config.use_real_hardware:
            return True
        try:
            for ax in self._axes.values():
                ax.controller.input_vel = 0
            return not self._has_errors()
        except Exception:
            return False

    def zero(self) -> None:
        if not self.config.use_real_hardware:
            self._yaw_deg = 0.0
            self._pitch_deg = 0.0
            return
        for name, ax in self._axes.items():
            self._offset_turns[name] = float(ax.controller.input_pos)

    # ---- Status ----
    def get_position(self) -> Dict[str, float]:
        if not self.config.use_real_hardware:
            return {"yaw": self._yaw_deg, "pitch": self._pitch_deg}
        pos: Dict[str, float] = {}
        for name, ax in self._axes.items():
            turns = float(ax.controller.input_pos) - self._offset_turns[name]
            if name == 'yaw':
                deg = (turns / self.config.gear_ratio_yaw) * 360.0
            else:
                deg = (turns / self.config.gear_ratio_pitch) * 360.0
            pos[name] = deg
        return pos

    def status(self) -> Dict[str, bool]:
        return {
            "connected": self._connected,
            "configured": self._configured,
            "calibrated": self._calibrated,
            "engaged": self._engaged,
        }

    # ---- Command ----
    def set_position(self, *, pitch: Optional[float] = None, yaw: Optional[float] = None, bypass_limits: bool = False) -> bool:
        if pitch is None and yaw is None:
            return True
        # Clamp to limits unless bypassed
        pitch_cmd = None
        yaw_cmd = None
        if pitch is not None:
            if bypass_limits:
                pitch_cmd = pitch
            else:
                lo, hi = self.config.limits_pitch_deg
                pitch_cmd = max(lo, min(hi, pitch))
        if yaw is not None:
            if bypass_limits:
                yaw_cmd = yaw
            else:
                lo, hi = self.config.limits_yaw_deg
                yaw_cmd = max(lo, min(hi, yaw))
        if not self.config.use_real_hardware:
            if pitch_cmd is not None:
                self._pitch_deg = pitch_cmd
            if yaw_cmd is not None:
                self._yaw_deg = yaw_cmd
            if self.config.debug:
                print(f"AntennaService: set_position pitch={self._pitch_deg:.2f} yaw={self._yaw_deg:.2f}")
            return True
        try:
            if pitch_cmd is not None:
                turns = (pitch_cmd / 360.0) * self.config.gear_ratio_pitch + self._offset_turns["pitch"]
                self._axes["pitch"].controller.input_pos = turns
            if yaw_cmd is not None:
                turns = (yaw_cmd / 360.0) * self.config.gear_ratio_yaw + self._offset_turns["yaw"]
                self._axes["yaw"].controller.input_pos = turns
            if self.config.debug:
                pd = pitch_cmd if pitch_cmd is not None else self.get_position().get("pitch", 0.0)
                yd = yaw_cmd if yaw_cmd is not None else self.get_position().get("yaw", 0.0)
                print(f"AntennaService: set_position pitch={pd:.2f} yaw={yd:.2f}")
            return not self._has_errors()
        except Exception as e:
            print("AntennaService: set_position failed:", e)
            return False

    # ---- Internal ----
    def _has_errors(self) -> bool:
        if not self.config.use_real_hardware:
            return False
        try:
            if any(getattr(ax, 'error', 0) for ax in self._axes.values()):
                try:
                    from odrive.utils import dump_errors  # type: ignore
                    dump_errors(self._device)
                except Exception:
                    pass
                return True
            return False
        except Exception:
            return True


