#ifndef LABJACK_HPP
#define LABJACK_HPP

#include <iostream>
#include <assert.h>
#include <LabJackM.h>
// #include "utils/C_C++_LJM/LJM_Utilities.h"

class LabJack{
public:
    LabJack();
    ~LabJack();
    int get_handle();
private:
    int handle;
};

#endif // LABJACK_HPP