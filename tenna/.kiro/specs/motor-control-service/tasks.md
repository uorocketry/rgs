# Implementation Plan

## Priority Overview

**CRITICAL REFACTORING TASKS (Must be completed first):**
- Tasks 10-15: Address architectural issues identified in code review
- These tasks fix singleton patterns, simplify state management, standardize error handling
- Must be completed before continuing with frontend development

**FRONTEND DEVELOPMENT TASKS:**
- Tasks 16-21: Frontend TypeScript migration and UI improvements
- Can proceed after critical refactoring is complete

**INTEGRATION AND DEPLOYMENT:**
- Tasks 22-26: Testing, documentation, and final integration
- Should be done after both backend refactoring and frontend development

- [x] 1. Set up enhanced project structure and core configuration
  - Create new directory structure following the design specification
  - Add required Python packages using `uv add pydantic-settings structlog`
  - Implement configuration management system with pydantic-settings for environment-based settings
  - Set up structured JSON logging using structlog
  - Create custom exception hierarchy for different error types
  - _Requirements: 1.1, 1.3, 5.2, 5.4_

- [x] 2. Create abstract motor controller interface and base classes
  - Define AbstractMotorController interface with async methods
  - Create ControllerStatus, MotorPosition, and MotorCommand data models
  - Implement base controller functionality with error handling
  - Write unit tests for abstract interfaces and data models
  - _Requirements: 1.2, 2.4, 6.3_

- [x] 3. Refactor and enhance ODrive controller
  - Migrate existing ODrive controller code to new structure
  - Implement AbstractMotorController interface in ODrive controller
  - Add proper error handling and hardware detection
  - Preserve existing calibration sequence and circular setpoint functionality
  - Write unit tests with mocked ODrive hardware
  - _Requirements: 2.1, 2.2, 2.3, 6.1, 6.2, 6.4_

- [x] 4. Refactor and enhance simulation controller
  - Migrate existing PyBullet simulation code to new structure
  - Implement AbstractMotorController interface in simulation controller
  - Add configurable motor parameters and physics settings
  - Preserve existing URDF loading and physics simulation
  - Write unit tests for simulation controller
  - _Requirements: 2.1, 2.4, 6.1, 6.5_

- [x] 5. Implement motor control service layer
  - Create MotorService class that orchestrates controller operations
  - Implement automatic hardware detection and fallback to simulation
  - Add mode switching functionality between simulation and hardware
  - Implement position command processing and status reporting
  - Write unit tests for service layer with mocked controllers
  - _Requirements: 2.1, 2.2, 2.4, 3.4_

- [x] 6. Create enhanced state management system
  - Refactor existing state management into StateManager class
  - Implement thread-safe state access with proper locking
  - Add state change notifications and event handling
  - Preserve existing GPS position and manual target functionality
  - Write unit tests for concurrent state access (use "uv run pytest")
  - _Requirements: 1.2, 3.2, 6.1_

- [x] 7. Implement position calculation service
  - Extract GPS calculation logic into PositionCalculator service
  - Add proper coordinate system handling and validation
  - Implement shortest-path calculation for circular motion
  - Preserve existing GPS-to-angle conversion functionality
  - Write unit tests for position calculations with known test cases
  - _Requirements: 6.1, 6.5_

- [x] 8. Create enhanced API endpoints with proper error handling
  - Refactor existing FastAPI endpoints into organized route modules
  - Implement proper HTTP status codes and error responses
  - Add request validation using Pydantic models
  - Create health check and status endpoints
  - Write API integration tests
  - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [x] 9. Implement WebSocket for real-time updates
  - Add WebSocket support using `uv add python-socketio`
  - Replace existing Server-Sent Events with WebSocket connection
  - Add real-time position streaming and status updates
  - Implement proper connection management and error handling
  - Write integration tests for WebSocket functionality
  - _Requirements: 4.3, 4.4_

- [x] 10. **CRITICAL: Refactor motor service to remove singleton pattern**
  - Remove global singleton pattern from motor service
  - Implement proper dependency injection through FastAPI dependencies
  - Update all API endpoints to use dependency injection
  - Modify tests to work with new dependency injection pattern
  - Ensure thread safety without global state
  - _Requirements: 7.2, 7.5_

- [x] 11. **CRITICAL: Simplify and fix state management**
  - Split complex StateManager into focused state containers (MotorState, GPSState, ErrorState)
  - Remove complex event system and replace with simple state updates
  - Use only async locks for consistency (remove threading.RLock)
  - Remove backward compatibility methods that add complexity
  - Update all services to use new simplified state management
  - _Requirements: 7.3, 7.5_

- [ ] 12. **CRITICAL: Standardize error handling patterns**
  - Implement Result-based error handling throughout the codebase
  - Replace inconsistent boolean returns and exception raising with Result types
  - Update all controller interfaces to use Result types
  - Modify API layer to handle Result types consistently
  - Update tests to work with new error handling patterns
  - _Requirements: 7.1, 7.5_

- [ ] 13. Simplify controller hierarchy and interfaces
  - Merge AbstractMotorController and BaseMotorController into single interface
  - Remove unnecessary abstractions and helper methods
  - Update ODrive and simulation controllers to use simplified interface
  - Remove unused methods and properties from controller base classes
  - Update tests to work with simplified controller interface
  - _Requirements: 7.4_

- [ ] 14. Consolidate configuration management
  - Merge all configuration into single Pydantic model
  - Remove global configuration instance
  - Implement environment-specific configuration loading
  - Update all services to use consolidated configuration
  - Remove mixed dataclass/Pydantic patterns
  - _Requirements: 7.6_

- [ ] 15. Refactor WebSocket service for better separation of concerns
  - Split WebSocket service into focused components (ConnectionManager, DataBroadcaster)
  - Add circuit breaker pattern for update loop error handling
  - Simplify change detection logic
  - Remove mixing of async/sync patterns
  - Add proper error recovery and graceful degradation
  - _Requirements: 7.1, 7.5_

- [ ] 16. Set up TypeScript frontend structure
  - Install TypeScript and types using `bun install typescript @types/three`
  - Convert existing JavaScript to TypeScript
  - Create proper type definitions for API responses and motor data
  - Set up Vite build configuration with TypeScript support using bun as package manager
  - Organize code into modular components and services
  - _Requirements: 1.1, 1.4, 4.1_

- [ ] 17. Implement enhanced frontend API client
  - Install socket.io client using `bun install socket.io-client`
  - Create typed API client service for backend communication
  - Implement WebSocket client for real-time updates using socket.io
  - Add proper error handling and retry logic
  - Replace existing fetch calls with typed API client
  - Write unit tests for API client functionality
  - _Requirements: 4.1, 4.5_

- [ ] 18. Create modular UI components
  - Refactor existing UI into reusable TypeScript components
  - Create MotorControl component for position input and commands
  - Create StatusPanel component for displaying motor status and errors
  - Preserve existing Three.js visualization functionality
  - _Requirements: 4.1, 4.2, 4.5_

- [ ] 19. Enhance 3D visualization component
  - Migrate Three.js visualization code to TypeScript
  - Add proper type definitions for Three.js objects
  - Implement real-time position updates via WebSocket
  - Preserve existing URDF loading and scene setup
  - Add error state visualization for hardware issues
  - _Requirements: 4.1, 4.3, 4.4_

- [ ] 20. Implement configuration management interface
  - Create configuration endpoints for runtime parameter updates
  - Add frontend interface for motor parameter configuration
  - Implement validation for configuration changes
  - Add ability to switch between simulation and hardware modes
  - _Requirements: 5.2, 5.3_

- [ ] 21. Add comprehensive error handling and user feedback
  - Implement structured error display in frontend
  - Add toast notifications for system events
  - Create error recovery suggestions for common issues
  - Add clear indication of simulation vs hardware mode
  - _Requirements: 2.4, 3.5, 4.4, 4.5_

- [ ] 22. Create build and deployment configuration
  - Set up Makefile with uv and bun commands for development and production
  - Create Docker configuration for containerized deployment
  - Add environment configuration templates (.env.example)
  - Implement frontend build process integration using `bun run build` with Vite
  - Configure Vite to use bun as package manager in vite.config.ts
  - _Requirements: 5.1, 5.4, 5.5_

- [ ] 23. Update comprehensive test suite for refactored architecture
  - Update pytest configuration and fixtures for new architecture
  - Modify integration tests for API endpoints to work with dependency injection
  - Update hardware integration tests for new controller interface
  - Modify frontend unit tests for TypeScript components
  - Ensure test coverage is maintained after refactoring
  - _Requirements: 1.1, 2.4, 3.5, 7.1, 7.2, 7.3, 7.4_

- [ ] 24. Add logging and monitoring capabilities
  - Implement structured logging throughout the application
  - Add performance metrics collection
  - Create health check endpoints for monitoring
  - Add request/response logging for API calls
  - _Requirements: 5.4, 5.5_

- [ ] 25. Create documentation and README
  - Write comprehensive README with setup instructions
  - Document API endpoints with OpenAPI/Swagger
  - Create developer documentation for extending the system
  - Add troubleshooting guide for common issues
  - Document architectural changes and refactoring decisions
  - _Requirements: 1.4, 5.5_

- [ ] 26. Final integration and testing after refactoring
  - Integrate all refactored components and test end-to-end functionality
  - Verify hardware detection and fallback mechanisms still work
  - Test mode switching between simulation and hardware
  - Validate that all existing functionality is preserved after refactoring
  - Perform load testing and performance validation
  - Verify that architectural improvements don't impact performance
  - _Requirements: 2.1, 2.2, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_