# Labjack Provider

Allows interfacing with the Labjack T7-Pro DAQ.

## Install

Requires LJM and ZMQ C++ libraries.

## Build

### Makefile

make

### CMake

mkdir build
cd build
cmake ..
cmake --build .

### Windows

Install WSL
sudo apt update
sudo apt install build-essential cmake
tar -xf labjack_ljm_software_2019_07_16_x86_64.tar.gz labjack_ljm_software_2019_07_16_x86_64/
curl -O https://files.labjack.com/installers/LJM/Linux/x64/release/labjack_ljm_software_2019_07_16_x86_64.tar.gz
./labjack_ljm_installer.run

sudo apt-get install libjsoncpp-dev
sudo ln -s /usr/include/jsoncpp/json/ /usr/include/json
https://github.com/libcpr/cpr
sudo apt update && sudo apt upgrade && sudo apt install curl && sudo apt-get install libcurl4-openssl-dev
