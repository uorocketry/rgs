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

# Set the LabJackM library path
link_directories(vendor/labjack/lib)

# Add executable target
add_executable(${PROJECT_NAME} ${SOURCES})

# Link against LabJackM library (adjust the library name if needed)
target_link_libraries(${PROJECT_NAME} LabJackM)
# target_link_libraries(${PROJECT_NAME} PRIVATE ${CMAKE_SOURCE_DIR}/vendor/labjack/lib/libLabJackM.so)

# Set the output directory for the executable
set_target_properties(${PROJECT_NAME} PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
)

# Copy LabJackM shared library to the output directory
#add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
#    COMMAND ${CMAKE_COMMAND} -E copy_if_different
#        $<TARGET_FILE:LabJackM>
#        $<TARGET_FILE_DIR:${PROJECT_NAME}>
#)