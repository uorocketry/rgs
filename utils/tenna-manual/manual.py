#!/usr/bin/env python3
"""
Simplified Manual ODrive Control with Xbox Controller
"""
import time
import readline
import odrive
from odrive.enums import AxisState, ControlMode, InputMode
from odrive.utils import dump_errors
from remote import XboxController

class ManualODriveControl:
    """Manage manual control of an ODrive device, including Xbox controller support."""
    def __init__(self):
        self.device = None
        self.axes = {}  # {'yaw': axis0, 'pitch': axis1}
        self.offsets = {'yaw': 0.0, 'pitch': 0.0}
        self.calibrated = False
        self.debug = False
        self.controller = None
        self.controller_active = False

        self.cfg = {
            'gear_ratio': 40,
            'pole_pairs': 7,
            'torque_constant': 8.27 / 150,
            'current_limit': 8.0,
            'calibration_current': 5.0,
            'calibration_timeout': 30.0,
            'ctrl_speed_scale': 20.0,
            'speed_step': 1.5,
            'speed_mult_limits': (0.1, 3.0),
            'limits': {
                'yaw': (-90, 90),
                'pitch': (-80, 80),
            },
            'gains': {
                'pos': 4.0,
                'vel': 0.16,
                'vel_int': 6.0,
            }
        }

    def connect(self):
        print("Connecting to ODrive...")
        try:
            self.device = odrive.find_any()
            if not self.device:
                print("ERROR: No ODrive found.")
                return False
            self.axes = {'yaw': self.device.axis0, 'pitch': self.device.axis1}
            self.device.clear_errors()
            print(f"Connected: Serial {self.device.serial_number}")
            return True
        except Exception as e:
            print("ERROR: Could not connect", e)
            return False

    def configure(self):
        print("Configuring motors...")
        self.device.config.dc_max_negative_current = -self.cfg['current_limit']
        self.device.config.max_regen_current = self.cfg['current_limit']
        for name, axis in self.axes.items():
            mcfg = axis.motor.config
            ccfg = axis.controller.config
            tcfg = axis.trap_traj.config
            # Motor settings
            mcfg.pole_pairs = self.cfg['pole_pairs']
            mcfg.torque_constant = self.cfg['torque_constant']
            mcfg.current_lim = self.cfg['current_limit']
            mcfg.calibration_current = self.cfg['calibration_current']
            # Controller settings
            ccfg.input_mode = InputMode.TRAP_TRAJ
            ccfg.control_mode = ControlMode.POSITION_CONTROL
            ccfg.pos_gain = self.cfg['gains']['pos']
            ccfg.vel_gain = self.cfg['gains']['vel']
            ccfg.vel_integrator_gain = self.cfg['gains']['vel_int']
            # Mirror trap trajectory velocity limit
            ccfg.vel_limit = tcfg.vel_limit
            # Disable circular setpoints for yaw to prevent wrapping
            if name == 'yaw':
                ccfg.circular_setpoints = False
        print("Configuration done.")
        return True

    def calibrate(self):
        print(f"Calibrating (timeout: {self.cfg['calibration_timeout']}s)...")
        for ax in self.axes.values():
            ax.requested_state = AxisState.FULL_CALIBRATION_SEQUENCE
        start = time.time()
        while any(ax.current_state != AxisState.IDLE for ax in self.axes.values()):
            if time.time() - start > self.cfg['calibration_timeout']:
                print("ERROR: Calibration timed out")
                return False
            time.sleep(0.2)
        for ax in self.axes.values():
            ax.requested_state = AxisState.CLOSED_LOOP_CONTROL
        time.sleep(0.5)
        self.calibrated = True
        print("Calibration complete.")
        return not self.has_errors()

    def has_errors(self):
        if any(ax.error for ax in self.axes.values()):
            dump_errors(self.device)
            return True
        return False

    def get_pos(self):
        pos = {}
        for name, axis in self.axes.items():
            turns = axis.controller.input_pos - self.offsets[name]
            pos[name] = (turns / self.cfg['gear_ratio']) * 360.0
        return pos

    def set_pos(self, pitch=None, yaw=None, verbose=True):
        for name, deg in [('pitch', pitch), ('yaw', yaw)]:
            if deg is None:
                continue
            lo, hi = self.cfg['limits'][name]
            clamped = max(lo, min(hi, deg))
            if verbose and clamped != deg:
                print(f"WARNING: {name.capitalize()} clamped to {clamped}°")
            turns = (clamped / 360.0) * self.cfg['gear_ratio'] + self.offsets[name]
            self.axes[name].controller.input_pos = turns
        return not self.has_errors()

    def stop(self):
        for ax in self.axes.values():
            ax.controller.input_vel = 0
        print("Motors stopped.")

    def zero(self):
        for name, ax in self.axes.items():
            self.offsets[name] = ax.controller.input_pos
        print("Zero position set.")

    def status(self):
        pos = self.get_pos()
        print(f"Pitch: {pos['pitch']:.2f}°, Yaw: {pos['yaw']:.2f}°")
        for name, ax in self.axes.items():
            print(f"{name.capitalize()} state: {AxisState(ax.current_state).name}")
        print(f"Calibrated: {self.calibrated}")
        self.has_errors()

    def toggle_debug(self, on):
        self.debug = on
        print("Debug", "ON" if on else "OFF")

    def _start_controller_services(self):
        if self.controller_active:
            return True
        try:
            self.controller = XboxController(deadzone=0.1)
            if not self.controller.start():
                print("ERROR: Failed to start Xbox controller.")
                return False
            self.controller_active = True
            return True
        except Exception as e:
            print("ERROR:", e)
            return False

    def _stop_controller_services(self):
        if not self.controller_active:
            return True
        print("Stopping controller...")
        if self.controller:
            self.controller.stop()
        self.controller_active = False
        self.stop()
        print("Xbox controller stopped.")
        return True

    def run_controller_loop(self):
        if not self._start_controller_services():
            return
        print("\nController mode active. Ctrl-C to exit.")
        base_vel, base_acc, base_dec = 60.0, 30.0, 20.0
        speed_mult = 1.0
        last_rb = last_lb = last_x = False

        for ax in self.axes.values():
            ax.trap_traj.config.vel_limit = base_vel
            ax.trap_traj.config.accel_limit = base_acc
            ax.trap_traj.config.decel_limit = base_dec

        try:
            while self.controller_active:
                if not self.controller.is_connected():
                    print("Controller disconnected.")
                    break
                rb = self.controller.get_button('RB')
                lb = self.controller.get_button('LB')
                xb = self.controller.get_button('X')
                if rb and not last_rb:
                    speed_mult = min(speed_mult * self.cfg['speed_step'], self.cfg['speed_mult_limits'][1])
                if lb and not last_lb:
                    speed_mult = max(speed_mult / self.cfg['speed_step'], self.cfg['speed_mult_limits'][0])
                if xb and not last_x:
                    self.zero()
                last_rb, last_lb, last_x = rb, lb, xb

                new_vel = base_vel * speed_mult
                new_acc = base_acc * speed_mult
                new_dec = base_dec * speed_mult
                for ax in self.axes.values():
                    ax.trap_traj.config.vel_limit = new_vel
                    ax.trap_traj.config.accel_limit = new_acc
                    ax.trap_traj.config.decel_limit = new_dec
                    ax.controller.config.vel_limit = new_vel

                yaw_in = self.controller.get_axis('LX')
                pitch_in = -self.controller.get_axis('RY')
                if abs(yaw_in) > 0.05 or abs(pitch_in) > 0.05:
                    scale = self.cfg['ctrl_speed_scale'] * 0.05 * speed_mult
                    pos = self.get_pos()
                    tgt_yaw = max(self.cfg['limits']['yaw'][0], min(self.cfg['limits']['yaw'][1], pos['yaw'] + yaw_in*scale))
                    tgt_pitch = max(self.cfg['limits']['pitch'][0], min(self.cfg['limits']['pitch'][1], pos['pitch'] + pitch_in*scale))
                    if self.debug:
                        print(f"DBG: Yaw_in={yaw_in:.2f}, Pitch_in={pitch_in:.2f} -> {tgt_yaw:.2f}, {tgt_pitch:.2f}")
                    self.set_pos(tgt_pitch, tgt_yaw, verbose=False)
                time.sleep(0.05)
        except KeyboardInterrupt:
            print("\nExiting controller mode.")
        finally:
            self._stop_controller_services()


def main():
    ctl = ManualODriveControl()
    if not (ctl.connect() and ctl.configure() and ctl.calibrate()):
        return
    cmds = ['help','status','zero','stop','pos','debug','controller','quit']
    readline.parse_and_bind("tab: complete")
    readline.set_completer(lambda t,s: [c for c in cmds if c.startswith(t)][s] if s < len(cmds) else None)
    print("Ready. Type 'help'.")
    while True:
        try:
            inp = input('> ').split()
            if not inp: continue
            cmd, *args = inp
            if cmd in ('quit','exit'):
                break
            if cmd == 'help':
                print("Commands: status, zero, stop, pos <pitch> <yaw>, debug <on|off>, controller, quit")
            elif cmd == 'status': ctl.status()
            elif cmd == 'zero': ctl.zero()
            elif cmd == 'stop': ctl.stop()
            elif cmd == 'pos' and len(args)==2: ctl.set_pos(float(args[0]), float(args[1]))
            elif cmd == 'debug' and args: ctl.toggle_debug(args[0]=='on')
            elif cmd == 'controller': ctl.run_controller_loop()
            else:
                print("Unknown command")
        except KeyboardInterrupt:
            break

if __name__ == '__main__':
    main()
