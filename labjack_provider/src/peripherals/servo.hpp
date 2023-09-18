#ifndef SERVO_HPP
#define SERVO_HPP

#include "Peripheral.hpp"

class Servo : public Peripheral {
public:
    Servo(const char* initialName = "DIO0", int min_pulse, int max_pulse);
    void test_peripheral(int handle) override;
    PeripheralStatus write_angle(int handle, double angle);
    double read_angle(int handle);
    PeripheralStatus setup_servo(int handle);
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