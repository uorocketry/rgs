#include "labjack.hpp"
#include "utils/C_C++_LJM/LJM_Utilities.h"

LabJack::LabJack() {
    int handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY"); 
    this->handle = handle;
}

int LabJack::get_handle() {
    return this->handle;
}

LabJack::~LabJack() {
    CloseOrDie(this->handle);
}