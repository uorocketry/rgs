#include "thermocouple.hpp"

// #include <LabJackM.h>
// #include "../utils/C_C++_LJM/LJM_Utilities.h"

Thermocouple::Thermocouple(const char* initialName, ThermocoupleType type) : Peripheral() {
    this->name = initialName;
    this->type = type;
}

void Thermocouple::test_peripheral(int handle) {
    int err;
    double value;
    err = LJM_eReadName(handle, name, &value);
    // ErrorCheck(err, "LJM_eReadName");
    assert(value >= 0.0);
}

double Thermocouple::read_temperature(int handle) {
    int err;
    int LJMError;
    double value;
    double TCTempKelvin;
    err = LJM_eReadName(handle, name, &value);
    // ErrorCheck(err, "LJM_eReadName");
    LJMError = LJM_TCVoltsToTemp(static_cast<int>(type), value, 299.039, &TCTempKelvin);
    // ErrorCheck(LJMError, "LJM_TCVoltsToTemp");
    printf("Temp %f\n", TCTempKelvin - 273.15);
    return TCTempKelvin - 273.15;
}