#ifndef THERMOCOUPLE_HPP
#define THERMOCOUPLE_HPP

#include <iostream>
#include <assert.h>
#include "peripheral.hpp" 

enum class ThermocoupleType : long {
    B = 6001,
    E = 6002,
    J = 6003,
    K = 6004,
    N = 6005,
    R = 6006,
    S = 6007,
    T = 6008,
    C = 6009
};

class Thermocouple : public Peripheral {
public:
    Thermocouple(const char* initialName = "AIN0", ThermocoupleType type = ThermocoupleType::K);
    void test_peripheral(LabJack handle) override;
    double read_temperature(LabJack handle);   
private:
    const char* name; 
    ThermocoupleType type;
};

#endif // THERMOCOUPLE_HPP