#!/usr/bin/env python3
import os
import struct
import sys
import time
import errno

JS_DEV = '/dev/input/js0'
EVENT_FMT = 'IhBB'
EVENT_SIZE = struct.calcsize(EVENT_FMT)

JS_EVENT_BUTTON = 0x01
JS_EVENT_AXIS   = 0x02
JS_EVENT_INIT   = 0x80

BUTTON_MAP = {
    0: 'A', 1: 'B', 2: 'X', 3: 'Y',
    4: 'LB',5: 'RB',6: 'Back',7: 'Start',
    8: 'Guide',9: 'LThumb',10:'RThumb',
}

AXIS_MAP = {
    0: 'LX', 1: 'LY', 2: 'LT',
    3: 'RX', 4: 'RY', 5: 'RT',
}

def open_joystick(path):
    while True:
        try:
            return open(path, 'rb')
        except FileNotFoundError:
            print(f"[{time.strftime('%H:%M:%S')}] {path} not found, retrying in 1s…")
            time.sleep(1)
        except PermissionError:
            sys.exit(f"Permission denied on {path}. Run as root or adjust permissions.")

def read_event(jsdev):
    try:
        evbuf = jsdev.read(EVENT_SIZE)
        if evbuf:
            return struct.unpack(EVENT_FMT, evbuf)
    except OSError as e:
        # Propagate only if it's not “No such device”
        if e.errno != errno.ENODEV:
            raise
        # otherwise signal disconnection
        return "DISCONNECTED"
    return None

def normalize_axis(val):
    return val / 32767.0

def main():
    jsdev = open_joystick(JS_DEV)
    print(f"[{time.strftime('%H:%M:%S')}] Listening on {JS_DEV} (Ctrl-C to exit)…")

    try:
        while True:
            ev = read_event(jsdev)
            if ev == "DISCONNECTED":
                print(f"[{time.strftime('%H:%M:%S')}] *** Device disconnected! ***")
                jsdev.close()
                jsdev = open_joystick(JS_DEV)
                print(f"[{time.strftime('%H:%M:%S')}] *** Reconnected to {JS_DEV} ***")
                continue

            if ev is None:
                # no data (EOF?), just loop
                time.sleep(0.01)
                continue

            timestamp, value, ev_type, number = ev

            # skip init states
            if ev_type & JS_EVENT_INIT:
                continue

            if ev_type & JS_EVENT_BUTTON:
                name = BUTTON_MAP.get(number, f"BTN[{number}]")
                state = 'DOWN' if value else 'UP'
                print(f"[{timestamp} ms] Button {name} {state}")

            elif ev_type & JS_EVENT_AXIS:
                name = AXIS_MAP.get(number, f"AX[{number}]")
                print(f"[{timestamp} ms] Axis {name} → {normalize_axis(value):.3f}")

            # throttle output
            time.sleep(0.001)

    except KeyboardInterrupt:
        print("\nExiting…")
    finally:
        jsdev.close()

if __name__ == '__main__':
    main()
