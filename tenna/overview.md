# Antenna Tracker System - Comprehensive Technical Overview

## 1. SYSTEM ARCHITECTURE

### 1.1 Core Components
The antenna tracker system is a sophisticated real-time tracking platform consisting of:

- **Physics Simulation Engine**: PyBullet-based 3D physics simulation for accurate mechanical modeling
- **Web-Based Control Interface**: FastAPI backend with Three.js frontend for real-time visualization and control
- **Dual-Mode Operation**: Autonomous GPS tracking and manual joystick control capabilities
- **Real-Time Data Streaming**: Server-sent events for continuous position updates at 60 FPS

### 1.2 Technology Stack
- **Backend**: Python 3.12+ with FastAPI framework
- **Physics Engine**: PyBullet for realistic mechanical simulation
- **Frontend**: HTML5/JavaScript with Three.js for 3D visualization
- **Real-Time Communication**: Server-Sent Events (SSE) for live data streaming
- **3D Modeling**: URDF (Unified Robot Description Format) for mechanical specifications

## 2. ANTENNA TRACKER SPECIFICATIONS

### 2.1 Mechanical Design
The antenna tracker is a motorized yaw-pitch motion platform featuring:

**Base Structure:**
- Cylindrical base mount (0.2m radius, 0.1m height, 2.0kg mass)
- Fixed mounting to ground reference frame

**Yaw Assembly:**
- **Joint Type**: Continuous rotation (unlimited 360° movement)
- **Axis**: Vertical Z-axis rotation
- **Motor Specifications**: 
  - Maximum Torque: 5.76 Nm
  - Maximum Velocity: 603.19 rad/s
- **Mass**: 1.7kg rotator assembly
- **Damping**: 0.1 Nm·s/rad with 0.05 Nm friction

**Pitch Assembly:**
- **Joint Type**: Revolute with mechanical limits
- **Range**: 0° to 90° (0 to π/2 radians)
- **Axis**: Horizontal Y-axis rotation
- **Motor Specifications**: Identical to yaw (5.76 Nm, 603.19 rad/s)
- **Mount**: U-shaped bracket design for antenna attachment

### 2.2 Antenna Specifications
**Yagi Antenna Array:**
- **Type**: High-gain directional Yagi antenna
- **Gain**: 16 dBi (cross-polarized configuration)
- **Physical Dimensions**: 1.0m boom length with graduated element spacing
- **Elements**: Multiple directors with decreasing length (0.5m to 0.35m)
- **Mass**: 1.0kg total antenna assembly
- **Mounting**: Fixed to pitch assembly at 0.15m offset

## 3. CONTROL SYSTEMS

### 3.1 Autonomous Tracking Mode
The system implements sophisticated GPS-based tracking algorithms:

**GPS Coordinate Processing:**
- Real-time conversion from WGS84 coordinates to local Cartesian frame
- Haversine formula implementation for great-circle distance calculations
- Spherical trigonometry for bearing and elevation angle computation

**Tracking Algorithm:**
```
Bearing Calculation: atan2(sin(Δlon)·cos(lat₂), cos(lat₁)·sin(lat₂) - sin(lat₁)·cos(lat₂)·cos(Δlon))
Elevation Angle: atan2(altitude_difference, horizontal_distance)
```

**Motion Control:**
- Position-based servo control with continuous yaw tracking
- Anti-wrap algorithm prevents unnecessary 360° rotations
- Real-time target interpolation at 240 Hz simulation rate

### 3.2 Manual Control Mode
**Joystick Interface:**
- Web-based slider controls for pitch (0-90°) and yaw (-180° to +180°)
- Real-time position feedback with degree precision display
- Smooth interpolated motion to prevent mechanical stress

**Failsafe Operation:**
- Manual override capability if autonomous tracking fails
- Physical handle attachment points for emergency manual positioning
- Mode switching without system restart required

## 4. SOFTWARE IMPLEMENTATION

### 4.1 Backend Architecture (Python/FastAPI)
**Core Modules:**
- `AppState`: Thread-safe global state management with mutex locking
- `Physics Simulation Loop`: 240 Hz continuous simulation thread
- `GPS Calculations`: Geodetic coordinate transformations
- `Motor Control`: PyBullet position-based servo control

**API Endpoints:**
- `/set-mode`: Switch between tracking/manual modes
- `/set-target`: Manual position control
- `/set-rocket-position`: Update target GPS coordinates
- `/set-antenna-position`: Update tracker base position
- `/stream-updates`: Real-time position streaming

**Threading Model:**
- Main FastAPI thread for HTTP requests
- Dedicated physics simulation thread (daemon)
- Thread-safe state synchronization with mutex locks

### 4.2 Frontend Implementation (JavaScript/Three.js)
**3D Visualization Engine:**
- Z-up coordinate system for intuitive navigation
- URDF model loading with real-time joint animation
- Orbital camera controls with damping
- Grid reference system with cardinal direction labels

**Real-Time Data Handling:**
- EventSource API for server-sent events
- 60 FPS position updates from backend
- Smooth interpolated animation (10% blend factor)
- Debounced input handling for performance optimization

**User Interface Components:**
- Radio button mode selection
- GPS coordinate input forms with real-time validation
- Range sliders for manual control
- Live position display with degree precision

### 4.3 Coordinate System Implementation
**World Frame (Z-Up):**
- Z-axis: Vertical (altitude)
- Y-axis: North direction
- X-axis: East direction
- Origin: Antenna base position

**GPS Integration:**
- WGS84 to local Cartesian conversion
- Bearing calculation with proper yaw inversion for counter-clockwise joint rotation
- Altitude differential handling for pitch calculation
- Visual rocket indicator positioning in 3D space

## 5. PERFORMANCE CHARACTERISTICS

### 5.1 Real-Time Performance
- **Simulation Rate**: 240 Hz physics updates
- **Visualization Rate**: 60 FPS frontend rendering
- **Network Latency**: Sub-100ms for local network operation
- **Position Accuracy**: Sub-degree precision for tracking calculations

### 5.2 Mechanical Specifications
- **Yaw Range**: Unlimited continuous rotation
- **Pitch Range**: 0° to 90° elevation
- **Maximum Torque**: 5.76 Nm per axis
- **Maximum Angular Velocity**: 603.19 rad/s theoretical
- **Total System Mass**: ~4.7kg including antenna assembly

### 5.3 Tracking Capabilities
- **GPS Coordinate Precision**: 5 decimal places (±1.1m accuracy)
- **Angular Resolution**: 0.1° minimum increment
- **Tracking Range**: Limited only by antenna gain pattern and line-of-sight
- **Update Rate**: Real-time continuous tracking

## 6. OPERATIONAL MODES

### 6.1 Tracking Mode Operation
1. **Initialization**: System loads with default GPS coordinates
2. **Target Acquisition**: Rocket position updates via web interface or API
3. **Continuous Tracking**: Real-time bearing and elevation calculation
4. **Servo Control**: Smooth motion to maintain target lock
5. **Visual Feedback**: 3D representation of tracker and target positions

### 6.2 Manual Mode Operation
1. **Mode Switch**: Radio button selection disables GPS tracking
2. **Direct Control**: Slider-based pitch and yaw positioning
3. **Real-Time Feedback**: Live position display and 3D visualization
4. **Smooth Motion**: Interpolated movement prevents mechanical shock

## 7. SYSTEM INTEGRATION

### 7.1 Hardware Interface
- **Motor Controllers**: Position-based servo control via PyBullet simulation
- **Sensor Integration**: GPS coordinate input via web API
- **Mechanical Assembly**: URDF-defined kinematic chain

### 7.2 Network Architecture
- **Web Server**: FastAPI with static file serving
- **Real-Time Communication**: Server-Sent Events for position streaming
- **Cross-Platform Compatibility**: Browser-based interface supports all platforms

### 7.3 Development Environment
- **Python Dependencies**: FastAPI, PyBullet, Uvicorn
- **JavaScript Dependencies**: Three.js, URDF-loader
- **Build System**: Vite for frontend bundling
- **Package Management**: UV for Python, NPM for JavaScript

## 8. TECHNICAL INNOVATIONS

### 8.1 Coordinate System Handling
- **Z-Up Implementation**: Proper 3D visualization with intuitive camera controls
- **GPS Integration**: Seamless conversion between geodetic and Cartesian coordinates
- **Yaw Inversion**: Corrected bearing calculation for counter-clockwise joint rotation

### 8.2 Real-Time Simulation
- **Physics Integration**: PyBullet provides realistic mechanical behavior
- **Thread Safety**: Mutex-protected state management for concurrent access
- **Performance Optimization**: Efficient 240 Hz simulation with 60 FPS visualization

### 8.3 User Experience
- **Dual-Mode Interface**: Seamless switching between autonomous and manual control
- **Visual Feedback**: Real-time 3D representation of system state
- **Responsive Design**: Web-based interface adapts to different screen sizes

## 9. SYSTEM RELIABILITY

### 9.1 Failsafe Mechanisms
- **Manual Override**: Physical handles for emergency positioning
- **Mode Switching**: Instant transition between control modes
- **Thread Isolation**: Physics simulation continues independently of web interface

### 9.2 Error Handling
- **GPS Validation**: Input bounds checking for coordinate values
- **Mechanical Limits**: Software enforcement of pitch angle constraints
- **Network Resilience**: Automatic reconnection for streaming data

The antenna tracker system represents a comprehensive solution for autonomous rocket tracking, combining advanced GPS algorithms, real-time 3D simulation, and intuitive web-based control interfaces. The system's dual-mode operation ensures reliable performance across various operational scenarios while maintaining high precision and responsiveness.