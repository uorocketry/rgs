# Labjack Provider

Allows interfacing with the Labjack T7-Pro DAQ.

## Requirements

> If you're on a non-apt based distribution you'll need to find the equivalent packages.

- Before everything update you system packages
  - `sudo apt update`
- LJM (Labjack driver)
  - For LJM you need to go to the [./vendor/labjack](./vendor/labjack) folder and run `./install.sh`, which will install required files to your `share` folder (there is also an equivalent `uninstall.sh` script).
- Jsoncpp
  - This is automatically installed in cmake
- cpr
  - This is automatically installed in cmake

In summary:

```bash
sudo apt update
sudo apt install build-essential cmake libusb-1.0-0-dev libudev-dev
cd ./vendor/labjack
./vendor/labjack/install.sh
cd ../../
```

## Build

```bash
mkdir build
cd build
cmake ..
cmake --build .
```

### Legacy Install (Not Recommended)

If you're on windows make sure to have WSL installed

```bash
sudo apt update
sudo apt install build-essential cmake libusb-1.0-0-dev
tar -xf labjack_ljm_software_2019_07_16_x86_64.tar.gz labjack_ljm_software_2019_07_16_x86_64/
curl -O https://files.labjack.com/installers/LJM/Linux/x64/release/labjack_ljm_software_2019_07_16_x86_64.tar.gz
./labjack_ljm_installer.run
```
