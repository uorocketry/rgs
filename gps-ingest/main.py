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
    rotation = svc.rotation_from_yaw_zero(bearing)
    print("Prediction (+1s):")
    print(
        f"  lat={pred.lat:.8f} lon={pred.lon:.8f} alt={pred.alt_m:.1f}m conf={pred.confidence:.2f} ts={pred.ts_iso}"
    )
    print(f"  yaw(az)={az:.2f}° pitch(el)={el:.2f}°")
    print(f"  bearing={bearing:.2f}° from North; rotation(yaw-zero={svc.config.antenna_yaw_zero_deg:.1f})={rotation:.2f}°")


def cmd_rotate(svc: PredictorService, ant: AntennaService) -> None:
    pred = svc.get_prediction()
    if not pred:
        print("No prediction available.")
        return
    az, el = svc.compute_az_el(pred.lat, pred.lon, pred.alt_m)
    # Respect configured limits
    yaw_lo, yaw_hi = svc.config.limits.yaw_deg
    pit_lo, pit_hi = svc.config.limits.pitch_deg
    yaw_cmd = max(yaw_lo, min(yaw_hi, az))
    pit_cmd = max(pit_lo, min(pit_hi, el))
    if (yaw_cmd != az) or (pit_cmd != el):
        print("NOTE: Angles clamped to limits.")
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
                az, el = svc.compute_az_el(pred.lat, pred.lon, pred.alt_m)
                yaw_lo, yaw_hi = svc.config.limits.yaw_deg
                pit_lo, pit_hi = svc.config.limits.pitch_deg
                yaw_cmd = max(yaw_lo, min(yaw_hi, az))
                pit_cmd = max(pit_lo, min(pit_hi, el))
                ant.set_position(pitch=pit_cmd, yaw=yaw_cmd, bypass_limits=False)
                print(f"TRACK pitch={pit_cmd:.2f}° yaw={yaw_cmd:.2f}° -> lat={pred.lat:.6f} lon={pred.lon:.6f}")
            time.sleep(0.3)
    except KeyboardInterrupt:
        print("\nStopped auto-tracking.")


def cmd_help() -> None:
    print("Available commands:")
    print("  gps        - Stream GPS history and live updates (Ctrl-C to stop)")
    print("  prediction - Show current prediction, pointing angles and antenna rotation")
    print("  rotate     - Rotate antenna to current prediction (respects limits)")
    print("  yolo       - Auto-track predictions continuously (Ctrl-C to stop)")
    print("  help       - Show this help message")
    print("  quit/exit  - Exit the program")


def main() -> None:
    cfg = PredictorConfig()
    svc = PredictorService(cfg)
    ant = AntennaService(AntennaConfig())
    ant.connect(); ant.configure(); ant.calibrate(); ant.engage()
    svc.start()
    print("gps-ingest REPL. Commands: gps, prediction, rotate, yolo, help, quit")
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
            elif cmd == "":
                continue
            else:
                print("Unknown command. Type 'help' for available commands.")
    finally:
        svc.stop()


if __name__ == "__main__":
    main()


