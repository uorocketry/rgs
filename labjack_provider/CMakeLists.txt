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
    vendor/labjack/include
)

include(FetchContent)
FetchContent_Declare(cpr GIT_REPOSITORY https://github.com/libcpr/cpr.git/ GIT_TAG 1.10.5)
FetchContent_MakeAvailable(cpr)

FetchContent_Declare(jsoncpp GIT_REPOSITORY https://github.com/open-source-parsers/jsoncpp GIT_TAG 1.9.5)
FetchContent_MakeAvailable(jsoncpp)

# Set the LabJackM library path
link_directories(vendor/labjack/lib)

# Add executable target
add_executable(${PROJECT_NAME} ${SOURCES})

# Link against LabJackM library (adjust the library name if needed)
target_link_libraries(${PROJECT_NAME} PRIVATE ${CMAKE_SOURCE_DIR}/vendor/labjack/lib/libLabJackM.so)

# Link against JsconCpp library
target_link_libraries(${PROJECT_NAME} PRIVATE jsoncpp)

target_link_libraries(${PROJECT_NAME} PRIVATE cpr::cpr)

# Set the output directory for the executable
set_target_properties(${PROJECT_NAME} PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
)
