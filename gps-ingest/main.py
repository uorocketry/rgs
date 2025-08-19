#!/usr/bin/env python3
"""
gps-ingest CLI REPL for antenna integration.

Commands:
  - gps:        stream-print latest GPS samples; Ctrl-C to stop
  - prediction: print current prediction, pointing angles and antenna rotation
  - rotate:     print the command that would rotate antenna to predicted angles
  - yolo:       continuously (auto) print predicted rotation; Ctrl-C to stop

This CLI uses PredictorService as the API layer managing background ingestion
and prediction.
"""

from __future__ import annotations

import sys
import time
from dataclasses import asdict

from predictor_service import PredictorConfig, PredictorService
from antenna_service import AntennaConfig, AntennaService


def _print_gps(sample) -> None:
    print(
        f"[{sample.ts_iso}] lat={sample.lat:.8f} lon={sample.lon:.8f} alt={sample.alt_m:.1f}m src={sample.source}"
    )


def cmd_gps(svc: PredictorService) -> None:
    print("Streaming GPS (Ctrl-C to stop)...")
    try:
        # Print existing history first
        hist = svc.get_history()
        last_ts = None
        for s in hist:
            _print_gps(s)
            last_ts = s.ts_iso
        while True:
            s = svc.get_latest()
            if s and s.ts_iso != last_ts:
                _print_gps(s)
                last_ts = s.ts_iso
            time.sleep(0.1)
    except KeyboardInterrupt:
        print("\nStopped GPS stream.")


def cmd_prediction(svc: PredictorService) -> None:
    latest = svc.get_latest()
    pred = svc.get_prediction()
    if not latest:
        print("No GPS yet.")
        return
    print("Antenna:")
    print(
        f"  lat={svc.config.antenna_lat_deg:.8f} lon={svc.config.antenna_lon_deg:.8f} alt={svc.config.antenna_alt_m:.1f}m"
    )
    print("Latest GPS:")
    _print_gps(latest)
    if not pred:
        print("No prediction yet.")
        return
    az, el = svc.compute_az_el(pred.lat, pred.lon, pred.alt_m)
    bearing = svc.initial_bearing_deg(
        svc.config.antenna_lat_deg, svc.config.antenna_lon_deg, pred.lat, pred.lon
    )

    # Preview the rotation we would send (without updating the accumulator)
    if svc.config.yaw_normalization == "continuous" and svc._last_yaw_cmd is not None:
        rotation_preview = svc.rotation_from_yaw_zero_continuous(az, svc._last_yaw_cmd)
    else:
        rotation_preview = svc._rotation_from_yaw_zero_basic(az)

    print("Prediction (+1s):")
    print(
        f"  lat={pred.lat:.8f} lon={pred.lon:.8f} alt={pred.alt_m:.1f}m conf={pred.confidence:.2f} ts={pred.ts_iso}"
    )
    print(f"  yaw(az from North)={az:.2f}° pitch(el)={el:.2f}°")
    print(f"  bearing={bearing:.2f}° from North; rotation(yaw-zero={svc.config.antenna_yaw_zero_deg:.1f}, mode={svc.config.yaw_normalization})={rotation_preview:.2f}°")


def cmd_rotate(svc: PredictorService, ant: AntennaService) -> None:
    pred = svc.get_prediction()
    if not pred:
        print("No prediction available.")
        return

    yaw_cmd, pit_cmd = svc.yaw_pitch_from_target(pred.lat, pred.lon, pred.alt_m)

    ok = ant.set_position(pitch=pit_cmd, yaw=yaw_cmd, bypass_limits=False)
    if ok:
        print(f"ROTATE pitch={pit_cmd:.2f}° yaw={yaw_cmd:.2f}° (sent)")
    else:
        print("Failed to send rotation command")


def cmd_yolo(svc: PredictorService, ant: AntennaService) -> None:
    print("Auto-tracking predictions (Ctrl-C to stop)...")
    try:
        while True:
            pred = svc.get_prediction()
            if pred:
                yaw_cmd, pit_cmd = svc.yaw_pitch_from_target(pred.lat, pred.lon, pred.alt_m)
                ant.set_position(pitch=pit_cmd, yaw=yaw_cmd, bypass_limits=False)
                print(f"TRACK pitch={pit_cmd:.2f}° yaw={yaw_cmd:.2f}° -> lat={pred.lat:.6f} lon={pred.lon:.6f}")
            time.sleep(0.3)
    except KeyboardInterrupt:
        print("\nStopped auto-tracking.")


def cmd_calibrate(ant: AntennaService) -> None:
    """Calibrate the antenna motors using the same logic as manual.py"""
    print("Clearing errors and calibrating axes...")
    if not ant._connected:
        print("ERROR: Antenna not connected. Run connect first.")
        return
    
    # Clear any existing errors before calibration
    if hasattr(ant, '_device') and ant._device:
        ant._device.clear_errors()
    
    print(f"Calibrating both axes simultaneously (timeout: {ant.config.calibration_timeout}s)...")
    
    # Start calibration on both axes
    for name, ax in ant._axes.items():
        print(f"Requesting calibration for {name} axis...")
        ax.requested_state = ant._AxisState.FULL_CALIBRATION_SEQUENCE

    start = time.time()
    # Wait for both axes to finish calibration or timeout
    while True:
        all_idle = all(ax.current_state == ant._AxisState.IDLE for ax in ant._axes.values())
        if all_idle:
            break
        if time.time() - start > ant.config.calibration_timeout:
            print("ERROR: Calibration timed out for one or more axes")
            return
        time.sleep(0.2)

    # Set both axes to closed loop control
    for name, ax in ant._axes.items():
        ax.requested_state = ant._AxisState.CLOSED_LOOP_CONTROL
    time.sleep(0.5)

    # Check for errors on both axes
    for name, ax in ant._axes.items():
        if ax.error != 0:
            print(f"ERROR: {name} axis has error after calibration")
            # Use the existing _has_errors method which will dump errors
            ant._has_errors()
            return
        print(f"{name.capitalize()} axis calibration complete.")

    print("All axes calibrated successfully.")
    ant._calibrated = True
    ant._engaged = True


def cmd_engage(ant: AntennaService) -> None:
    """Engage the antenna motors for closed loop control"""
    if not ant._connected:
        print("ERROR: Antenna not connected. Run connect first.")
        return
    if not ant._calibrated:
        print("ERROR: Antenna not calibrated. Run calibrate first.")
        return
    if ant._engaged:
        print("Antenna is already engaged.")
        return
    
    print("Engaging antenna motors...")
    if ant.engage():
        print("Antenna motors engaged successfully.")
    else:
        print("ERROR: Failed to engage antenna motors.")


def cmd_disengage(ant: AntennaService) -> None:
    """Disengage the antenna motors and set to idle"""
    if not ant._connected:
        print("ERROR: Antenna not connected. Run connect first.")
        return
    if not ant._engaged:
        print("Antenna is already disengaged.")
        return
    
    print("Disengaging antenna motors...")
    if ant.disengage():
        print("Antenna motors disengaged successfully.")
    else:
        print("ERROR: Failed to disengage antenna motors.")


def cmd_help() -> None:
    print("Available commands:")
    print("  gps        - Stream GPS history and live updates (Ctrl-C to stop)")
    print("  prediction - Show current prediction, pointing angles and antenna rotation")
    print("  rotate     - Rotate antenna to current prediction (respects limits)")
    print("  yolo       - Auto-track predictions continuously (Ctrl-C to stop)")
    print("  calibrate  - Calibrate antenna motors (clears errors, runs full calibration)")
    print("  engage     - Engage antenna motors for closed loop control")
    print("  disengage  - Disengage antenna motors and set to idle")
    print("  help       - Show this help message")
    print("  quit/exit  - Exit the program")


def main() -> None:
    cfg = PredictorConfig()
    svc = PredictorService(cfg)
    ant = AntennaService(AntennaConfig())
    ant.connect(); ant.configure(); ant.calibrate(); ant.engage()
    svc.start()
    print("gps-ingest REPL. Commands: gps, prediction, rotate, yolo, calibrate, engage, disengage, help, quit")
    try:
        while True:
            try:
                cmd = input("> ").strip().lower()
            except EOFError:
                break
            if cmd in ("quit", "exit"):
                break
            if cmd == "help":
                cmd_help()
            elif cmd == "gps":
                cmd_gps(svc)
            elif cmd == "prediction":
                cmd_prediction(svc)
            elif cmd == "rotate":
                cmd_rotate(svc, ant)
            elif cmd == "yolo":
                cmd_yolo(svc, ant)
            elif cmd == "calibrate":
                cmd_calibrate(ant)
            elif cmd == "engage":
                cmd_engage(ant)
            elif cmd == "disengage":
                cmd_disengage(ant)
            elif cmd == "":
                continue
            else:
                print("Unknown command. Type 'help' for available commands.")
    finally:
        print("Shutting down...")
        svc.stop()
        # Ensure antenna is disengaged and set to idle before exit
        if ant._engaged:
            print("Disengaging antenna motors...")
            ant.disengage()
        print("Cleanup complete.")


if __name__ == "__main__":
    main()


