#!/usr/bin/env python3
"""
Simple manual ODrive control script.
Sets up ODrives, performs calibration, and enters a REPL for manual control.
"""

import math
import time
import asyncio
from typing import Optional, Tuple

try:
    import odrive
    from odrive.enums import AxisState
    ODRIVE_AVAILABLE = True
except ImportError:
    print("ERROR: ODrive library not available. Install with: pip install odrive")
    exit(1)


class ManualODriveControl:
    """Simple manual ODrive control interface."""
    
    def __init__(self):
        self.odrive_device = None
        self.axis0 = None  # Yaw axis
        self.axis1 = None  # Pitch axis
        self.is_calibrated = False
        
        # Default configuration (adjust as needed)
        self.config = {
            'yaw_axis': 0,
            'pitch_axis': 1,
            'gear_ratio': 20.0,
            'pole_pairs': 7,
            'torque_constant': 8.27 / 150,
            'current_limit': 5.0,
            'calibration_current': 5.0,
            'calibration_timeout': 30.0
        }
    
    def connect(self) -> bool:
        """Connect to ODrive hardware."""
        print("Searching for ODrive hardware...")
        try:
            self.odrive_device = odrive.find_any()
            if self.odrive_device is None:
                print("ERROR: No ODrive hardware detected")
                return False
            
            serial_number = self.odrive_device.serial_number
            print(f"Connected to ODrive (Serial: {serial_number})")
            
            # Get axis references
            self.axis0 = getattr(self.odrive_device, 'axis0')
            self.axis1 = getattr(self.odrive_device, 'axis1')
            
            # Clear any existing errors
            self.odrive_device.clear_errors()
            
            return True
            
        except Exception as e:
            print(f"ERROR: Failed to connect to ODrive: {e}")
            return False
    
    def configure_motors(self) -> bool:
        """Configure motor parameters."""
        print("Configuring motors...")
        try:
            # Configure axis0 (yaw)
            self.axis0.motor.config.pole_pairs = self.config['pole_pairs']
            self.axis0.motor.config.torque_constant = self.config['torque_constant']
            self.axis0.motor.config.current_lim = self.config['current_limit']
            self.axis0.motor.config.calibration_current = self.config['calibration_current']
            self.axis0.controller.config.circular_setpoints = True
            self.axis0.controller.config.circular_setpoint_range = 1.0
            
            # Configure axis1 (pitch)
            self.axis1.motor.config.pole_pairs = self.config['pole_pairs']
            self.axis1.motor.config.torque_constant = self.config['torque_constant']
            self.axis1.motor.config.current_lim = self.config['current_limit']
            self.axis1.motor.config.calibration_current = self.config['calibration_current']
            
            print("Motor configuration complete")
            return True
            
        except Exception as e:
            print(f"ERROR: Failed to configure motors: {e}")
            return False
    
    def calibrate_motors(self) -> bool:
        """Perform motor calibration."""
        print("Starting motor calibration...")
        print("This may take up to 30 seconds...")
        
        try:
            # Start calibration for both axes
            self.axis0.requested_state = AxisState.FULL_CALIBRATION_SEQUENCE
            self.axis1.requested_state = AxisState.FULL_CALIBRATION_SEQUENCE
            
            # Wait for calibration to complete
            start_time = time.time()
            while time.time() - start_time < self.config['calibration_timeout']:
                axis0_state = self.axis0.current_state
                axis1_state = self.axis1.current_state
                
                print(f"Calibrating... Axis0: {axis0_state}, Axis1: {axis1_state}")
                
                if axis0_state == AxisState.IDLE and axis1_state == AxisState.IDLE:
                    break
                
                time.sleep(1.0)
            else:
                print("ERROR: Calibration timeout")
                return False
            
            # Enter closed loop control
            self.axis0.requested_state = AxisState.CLOSED_LOOP_CONTROL
            self.axis1.requested_state = AxisState.CLOSED_LOOP_CONTROL
            
            # Wait for closed loop control to be active
            time.sleep(1.0)
            
            self.is_calibrated = True
            print("Motor calibration complete!")
            return self.odrive_device.axis0.motor.error == 0 and  self.odrive_device.axis1.motor.error == 0
            
        except Exception as e:
            print(f"ERROR: Calibration failed: {e}")
            return False
    
    def get_position(self) -> Tuple[float, float]:
        """Get current position in degrees."""
        try:
            # Convert motor turns to degrees
            yaw_turns = self.axis0.encoder.pos_estimate
            pitch_turns = self.axis1.encoder.pos_estimate
            
            yaw_deg = (yaw_turns / self.config['gear_ratio']) * 360.0
            pitch_deg = (pitch_turns / self.config['gear_ratio']) * 360.0
            
            return pitch_deg, yaw_deg
            
        except Exception as e:
            print(f"ERROR: Failed to read position: {e}")
            return 0.0, 0.0
    
    def set_position(self, pitch_deg: float, yaw_deg: float) -> bool:
        """Set target position in degrees."""
        try:
            # Convert degrees to motor turns
            yaw_turns = (yaw_deg / 360.0) * self.config['gear_ratio']
            pitch_turns = (pitch_deg / 360.0) * self.config['gear_ratio']
            
            # Set positions
            self.axis0.controller.input_pos = yaw_turns
            self.axis1.controller.input_pos = pitch_turns
            
            print(f"Position set: Pitch={pitch_deg:.2f}°, Yaw={yaw_deg:.2f}°")
            return True
            
        except Exception as e:
            print(f"ERROR: Failed to set position: {e}")
            return False
    
    def set_velocity(self, pitch_vel: float, yaw_vel: float) -> bool:
        """Set velocity in degrees/second."""
        try:
            # Convert degrees/sec to turns/sec
            yaw_vel_turns = (yaw_vel / 360.0) * self.config['gear_ratio']
            pitch_vel_turns = (pitch_vel / 360.0) * self.config['gear_ratio']
            
            # Set velocities
            self.axis0.controller.input_vel = yaw_vel_turns
            self.axis1.controller.input_vel = pitch_vel_turns
            
            print(f"Velocity set: Pitch={pitch_vel:.2f}°/s, Yaw={yaw_vel:.2f}°/s")
            return True
            
        except Exception as e:
            print(f"ERROR: Failed to set velocity: {e}")
            return False
    
    def stop_motors(self) -> bool:
        """Stop all motors."""
        try:
            self.axis0.controller.input_vel = 0
            self.axis1.controller.input_vel = 0
            print("Motors stopped")
            return True
        except Exception as e:
            print(f"ERROR: Failed to stop motors: {e}")
            return False
    
    def get_status(self) -> None:
        """Print current status."""
        try:
            pitch_deg, yaw_deg = self.get_position()
            print(f"Current Position: Pitch={pitch_deg:.2f}°, Yaw={yaw_deg:.2f}°")
            print(f"Axis0 State: {self.axis0.current_state}")
            print(f"Axis1 State: {self.axis1.current_state}")
            print(f"Calibrated: {self.is_calibrated}")
        except Exception as e:
            print(f"ERROR: Failed to get status: {e}")
    
    def shutdown(self) -> None:
        """Shutdown gracefully."""
        print("Shutting down...")
        try:
            if self.odrive_device:
                self.stop_motors()
                self.axis0.requested_state = AxisState.IDLE
                self.axis1.requested_state = AxisState.IDLE
                time.sleep(1.0)
        except Exception as e:
            print(f"Warning: Error during shutdown: {e}")


def print_help():
    """Print available commands."""
    print("\nAvailable commands:")
    print("  pos <pitch> <yaw>     - Set position in degrees")
    print("  vel <pitch> <yaw>     - Set velocity in degrees/second")
    print("  stop                  - Stop all motors")
    print("  status                - Show current status")
    print("  help                  - Show this help")
    print("  quit                  - Exit program")
    print("\nExamples:")
    print("  pos 45 90             - Move to pitch=45°, yaw=90°")
    print("  vel 10 20             - Set velocity to pitch=10°/s, yaw=20°/s")


def main():
    """Main function."""
    print("=== Manual ODrive Control ===")
    
    # Create controller
    controller = ManualODriveControl()
    
    # Connect to hardware
    if not controller.connect():
        return
    
    # Configure motors
    if not controller.configure_motors():
        return
    
    # Calibrate motors
    if not controller.calibrate_motors():
        return
    
    print("\n=== Ready for manual control ===")
    print_help()
    
    # Main REPL loop
    try:
        while True:
            try:
                command = input("\n> ").strip().lower().split()
                if not command:
                    continue
                
                cmd = command[0]
                
                if cmd == "quit" or cmd == "exit":
                    break
                elif cmd == "help":
                    print_help()
                elif cmd == "status":
                    controller.get_status()
                elif cmd == "stop":
                    controller.stop_motors()
                elif cmd == "pos" and len(command) == 3:
                    try:
                        pitch = float(command[1])
                        yaw = float(command[2])
                        controller.set_position(pitch, yaw)
                    except ValueError:
                        print("ERROR: Invalid position values")
                elif cmd == "vel" and len(command) == 3:
                    try:
                        pitch_vel = float(command[1])
                        yaw_vel = float(command[2])
                        controller.set_velocity(pitch_vel, yaw_vel)
                    except ValueError:
                        print("ERROR: Invalid velocity values")
                else:
                    print("ERROR: Unknown command. Type 'help' for available commands.")
                    
            except KeyboardInterrupt:
                print("\nInterrupted. Type 'quit' to exit.")
            except EOFError:
                break
            except Exception as e:
                print(f"ERROR: {e}")
    
    finally:
        controller.shutdown()
        print("Goodbye!")


if __name__ == "__main__":
    main() 