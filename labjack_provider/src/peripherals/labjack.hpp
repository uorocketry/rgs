#ifndef LABJACK_HPP
#define LABJACK_HPP

#include <iostream>
#include <assert.h>
#include "peripheral.hpp"

class LabJack{
public:
    LabJack();
    ~LabJack();
    int get_handle();
private:
    int handle;
};

#endif // LABJACK_HPP