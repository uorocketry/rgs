cmake_minimum_required(VERSION 3.12)
project(labjack)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)

# Specify the source files
file(GLOB_RECURSE SOURCES src/*.cpp)

# Include directories
include_directories(
    src
    src/peripherals
    src/utils/C_C++_LJM
)

# Find cppzmq package
find_package(cppzmq REQUIRED)

# find_package(LabJackM REQUIRED)
find_package(jsoncpp REQUIRED)

# find cpr 
find_package(cpr REQUIRED)

# pkg_check_modules(JSONCPP jsoncpp)
# link_libraries(${JSONCPP_LIBRARIES})

# Add executable target
add_executable(${PROJECT_NAME} ${SOURCES})

# Link against LabJackM library (adjust the library name if needed)
target_link_libraries(${PROJECT_NAME} LabJackM)

# Link against cppzmq library
target_link_libraries(${PROJECT_NAME} cppzmq)

# Link against JsconCpp library
target_link_libraries(${PROJECT_NAME} jsoncpp)

target_link_libraries(${PROJECT_NAME}  cpr::cpr)

# Set the output directory for the executable
set_target_properties(${PROJECT_NAME} PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
)