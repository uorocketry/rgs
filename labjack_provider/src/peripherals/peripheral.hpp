#ifndef PERIPHERAL_HPP
#define PERIPHERAL_HPP

#include <LabJackM.h>

class Peripheral {
public:
    virtual void test_peripheral(int handle) = 0;
    virtual ~Peripheral() {} 
};

enum class PeripheralStatus {
    SUCCESS,
    FAILURE
};

#endif // PERIPHERAL_HPP