#ifndef SOLENOID_HPP
#define SOLENOID_HPP

#include <iostream>
#include <assert.h>
#include "peripheral.hpp"

class Solenoid: public Peripheral {
public:
    Solenoid(const char* initialName = "FIO0");
    void test_peripheral(LabJack handle) override;
    PeripheralStatus set_power(LabJack handle, double power);
    double get_power(LabJack handle);
private:
    const char* name;
};

#endif //SOLENOID_HPP