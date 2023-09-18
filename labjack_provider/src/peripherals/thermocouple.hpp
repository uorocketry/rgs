#ifndef THERMOCOUPLE_HPP
#define THERMOCOUPLE_HPP

#include "Peripheral.hpp" // Include the base class header

class Thermocouple : public Peripheral {
public:
    Thermocouple(const char* initialName = "AIN0", ThermocoupleType type);
    void test_peripheral(int handle) override;
    double read_temperature(int handle);
private:
    const char* name; 
    ThermocoupleType type;
};

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

#endif // THERMOCOUPLE_HPP