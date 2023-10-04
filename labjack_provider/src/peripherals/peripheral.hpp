#ifndef PERIPHERAL_HPP
#define PERIPHERAL_HPP

#include <LabJackM.h>
#include "labjack.hpp"

class Peripheral {
public:
    virtual void test_peripheral(LabJack handle) = 0;
    virtual ~Peripheral() {} 
};

enum class PeripheralStatus {
    SUCCESS,
    FAILURE
};

#endif // PERIPHERAL_HPP