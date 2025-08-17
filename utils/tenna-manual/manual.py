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
            'gear_ratios': {'yaw': 30, 'pitch': 36},
            'pole_pairs': 7,
            'torque_constant': 8.27 / 150,
            'current_limit': 7.0,
            'regen_current_limit': 0.001, # Amps
            'dc_max_negative_current': -0.01, # Amps
            'dc_max_positive_current': 10.0, # Amps
            'calibration_current': 5.0, # Amps
            'calibration_timeout': 30.0,
            'ctrl_speed_scale': 2, # How fast the controller affects the target position
            'speed_step': 1.5,
            'speed_mult_limits': (0.1, 2.0),
            'limits': {
                # 'yaw': (-370, 370),
                'yaw': (-80, 80),
                'pitch': (-10, 90),
            },
            'gains': {
                'pos': 2.0,
                'vel': 0.10,
                'vel_int': 3.0,
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



        self.device.config.enable_brake_resistor = True
        self.device.config.brake_resistance = 2.0

        self.device.config.dc_max_negative_current = self.cfg['dc_max_negative_current']
        self.device.config.dc_max_positive_current = self.cfg['dc_max_positive_current']
        self.device.config.max_regen_current = self.cfg['regen_current_limit']
        for name, axis in self.axes.items():
            axis.controller.config.vel_limit = float('inf') #revs/sec (max safe limit)
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
        print("Clearing errors and calibrating axes...")
        self.device.clear_errors()  # Clear any existing errors before calibration
        print(f"Calibrating axes individually (timeout: {self.cfg['calibration_timeout']}s each)...")
        for name, ax in self.axes.items():
            print(f"Calibrating {name} axis...")
            ax.requested_state = AxisState.FULL_CALIBRATION_SEQUENCE
            start = time.time()
            while ax.current_state != AxisState.IDLE:
                if time.time() - start > self.cfg['calibration_timeout']:
                    print(f"ERROR: Calibration timed out for {name} axis")
                    return False
                time.sleep(0.2)
            ax.requested_state = AxisState.CLOSED_LOOP_CONTROL
            time.sleep(0.5)
            if ax.error != 0:
                print(f"ERROR: {name} axis has error after calibration")
                dump_errors(self.device)
                return False
            print(f"{name.capitalize()} axis calibration complete.")
        self.calibrated = True
        print("All axes calibrated.")
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
            pos[name] = (turns / self.cfg['gear_ratios'][name]) * 360.0
        return pos

    def set_pos(self, pitch=None, yaw=None, verbose=True, bypass_limits=False):
        for name, deg in [('pitch', pitch), ('yaw', yaw)]:
            if deg is None:
                continue
            if bypass_limits:
                clamped = deg
                if verbose:
                    print(f"LIMITS BYPASSED: {name.capitalize()} set to {deg}°")
            else:
                lo, hi = self.cfg['limits'][name]
                clamped = max(lo, min(hi, deg))
                if verbose and clamped != deg:
                    print(f"WARNING: {name.capitalize()} clamped to {clamped}°")
            turns = (clamped / 360.0) * self.cfg['gear_ratios'][name] + self.offsets[name]
            self.axes[name].controller.input_pos = turns

        print(f"Pitch Degrees: {pitch}, Yaw Degrees: {yaw}")
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

    def disengage(self):
        """Set both axes to IDLE state (disengaged)"""
        print("Disengaging motors...")
        for name, ax in self.axes.items():
            ax.requested_state = AxisState.IDLE
        time.sleep(0.5)  # Allow time for state change
        print("Motors disengaged.")
        return not self.has_errors()

    def engage(self):
        """Set both axes to CLOSED_LOOP_CONTROL state (engaged)"""
        if not self.calibrated:
            print("ERROR: Cannot engage - motors not calibrated. Run calibration first.")
            return False
        print("Engaging motors...")
        for name, ax in self.axes.items():
            ax.requested_state = AxisState.CLOSED_LOOP_CONTROL
        time.sleep(0.5)  # Allow time for state change
        print("Motors engaged.")
        return not self.has_errors()

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
        print("Hold 'A' button to bypass position limits.")
        # Fixed speed settings - no dynamic speed changes
        fixed_vel, fixed_acc, fixed_dec = 120.0, 20.0, 20.0
        last_x = last_y = False

        for ax in self.axes.values():
            ax.trap_traj.config.vel_limit = fixed_vel
            ax.trap_traj.config.accel_limit = fixed_acc
            ax.trap_traj.config.decel_limit = fixed_dec

        try:
            while self.controller_active:
                if not self.controller.is_connected():
                    print("Controller disconnected.")
                    break
                xb = self.controller.get_button('X')
                yb = self.controller.get_button('Y')
                ab = self.controller.get_button('A')
                if xb and not last_x:
                    self.zero()
                if yb and not last_y:
                    # Temporarily lower speed to 0.1x while going to zero, then restore
                    reduced_mult = 0.1

                    # Apply reduced limits immediately
                    reduced_vel = fixed_vel * reduced_mult
                    reduced_acc = fixed_acc * reduced_mult
                    reduced_dec = fixed_dec * reduced_mult
                    for ax in self.axes.values():
                        ax.trap_traj.config.vel_limit = reduced_vel
                        ax.trap_traj.config.accel_limit = reduced_acc
                        ax.trap_traj.config.decel_limit = reduced_dec

                    # Command move to stored zero point (0 pitch, 0 yaw)
                    print("Moving to zero point at 0.1x speed")
                    self.set_pos(0.0, 0.0, bypass_limits=False)

                    # Wait for trajectory to complete with a safety timeout
                    start_wait = time.time()
                    while self.controller_active:
                        in_traj_any = False
                        for ax in self.axes.values():
                            if getattr(ax.controller, 'in_traj', False):
                                in_traj_any = True
                                break
                        if not in_traj_any:
                            break
                        if time.time() - start_wait > 5.0:
                            break
                        time.sleep(0.02)

                    # Restore original limits
                    orig_vel = fixed_vel
                    orig_acc = fixed_acc
                    orig_dec = fixed_dec
                    for ax in self.axes.values():
                        ax.trap_traj.config.vel_limit = orig_vel
                        ax.trap_traj.config.accel_limit = orig_acc
                        ax.trap_traj.config.decel_limit = orig_dec

                    # Ensure state tracking prevents immediate retrigger
                    yb = False
                    last_x = False
                last_x, last_y = xb, yb

                yaw_in = self.controller.get_axis('LX')
                pitch_in = -self.controller.get_axis('RY')
                if abs(yaw_in) > 0.05 or abs(pitch_in) > 0.05:
                    scale = self.cfg['ctrl_speed_scale'] 
                    pos = self.get_pos()
                    if ab:  # A button held - bypass limits
                        tgt_yaw = pos['yaw'] + yaw_in*scale
                        tgt_pitch = pos['pitch'] + pitch_in*scale
                    else:  # Normal operation with limits
                        tgt_yaw = max(self.cfg['limits']['yaw'][0], min(self.cfg['limits']['yaw'][1], pos['yaw'] + yaw_in*scale))
                        tgt_pitch = max(self.cfg['limits']['pitch'][0], min(self.cfg['limits']['pitch'][1], pos['pitch'] + pitch_in*scale))
                    if self.debug:
                        limit_status = "LIMITS BYPASSED" if ab else "LIMITS ACTIVE"
                        print(f"DBG: {limit_status} - Yaw_in={yaw_in:.2f}, Pitch_in={pitch_in:.2f} -> {tgt_yaw:.2f}, {tgt_pitch:.2f}")
                    self.set_pos(tgt_pitch, tgt_yaw, verbose=False, bypass_limits=ab)
                time.sleep(0.05)
        except KeyboardInterrupt:
            print("\nExiting controller mode.")
        finally:
            self._stop_controller_services()


def main():
    ctl = ManualODriveControl()
    if not (ctl.connect() and ctl.configure() and ctl.calibrate()):
        return
    cmds = ['help','status','zero','stop','pos','debug','controller','engage','disengage','calibrate','quit']
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
                print("Commands: status, zero, stop, pos <pitch> <yaw>, debug <on|off>, controller, engage, disengage, calibrate, quit")
                print("Controller: X=zero here, Y=go to zero, A=bypass limits")
            elif cmd == 'status': ctl.status()
            elif cmd == 'zero': ctl.zero()
            elif cmd == 'stop': ctl.stop()
            elif cmd == 'pos' and len(args)==2: ctl.set_pos(float(args[0]), float(args[1]), bypass_limits=False)
            elif cmd == 'debug' and args: ctl.toggle_debug(args[0]=='on')
            elif cmd == 'controller': ctl.run_controller_loop()
            elif cmd == 'engage': ctl.engage()
            elif cmd == 'disengage': ctl.disengage()
            elif cmd == 'calibrate': ctl.calibrate()
            else:
                print("Unknown command")
        except KeyboardInterrupt:
            break

if __name__ == '__main__':
    main()
