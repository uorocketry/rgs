#include "labjack.hpp"

LabJack::LabJack(int handle) {
    this->handle = handle;
}

int LabJack::get_handle() {
    return this->handle;
}