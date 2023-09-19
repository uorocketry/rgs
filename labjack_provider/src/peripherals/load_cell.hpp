#ifndef LOADCELL_HPP
#define LOADCELL_HPP

#include <iostream>
#include <assert.h>
#include "peripheral.hpp"

class LoadCell : public Peripheral {
public:
    LoadCell(const char* initialNamePos = "AIN2", const char* initialNameNeg = "AIN3", float sensitivity = 0.02);
    void test_peripheral(int handle) override;
    float read_weight(int handle);
private:
    const char* name_pos; 
    const char* name_neg;
    float sensitivity;
};

#endif // LOADCELL_HPP