#ifndef SERVO_HPP
#define SERVO_HPP

#include <iostream>
#include <assert.h>
#include <cmath>
#include "peripheral.hpp"

class Servo : public Peripheral {
public:
    Servo(const char* initialName = "DIO0", int min_pulse = 500, int max_pulse = 2500);
    void test_peripheral(LabJack handle) override;
    PeripheralStatus write_angle(LabJack handle, double angle);
    double read_angle(); // needs to change since it just gets the software angle stored in the struct. 
    PeripheralStatus setup_servo(LabJack handle);
private:
    const char* name; 
    int min_pulse;
    int max_pulse;
    int frequency;
    int roll_value;
    int config_a;
    double angle;
};

#endif // Servo_HPP