#include "Servo.hpp"
#include <iostream>
#include <assert.h>
#include <cmath>
#include <LabJackM.h>
#include "../utils/C_C++_LJM/LJM_Utilities.h"

// Bilda is min 500 us, max 2500 us
/**
 * @brief Construct a new Servo:: Servo object
 * @param initialName The name of the servo
 * @param min_pulse The minimum pulse width in microseconds
 * @param max_pulse The maximum pulse width in microseconds
*/
Servo::Servo(const char* initialName, int min_pulse, int max_pulse) : Peripheral() {
    int freq =  microsecondsToHz(max_pulse);
    this->name = initialName;
    this->min_pulse = min_pulse;
    this->max_pulse = max_pulse;
    this->config_a = duty_to_config_a(angle_to_duty(0, min_pulse, max_pulse), max_pulse, 80000000/freq); 
    this->angle = 0; 
    this->frequency = freq;
    this->roll_value = 80000000/freq;
}

int angle_to_duty(double angle, int min_pulse, int max_pulse) {
    int duty = min_pulse +
                (max_pulse - min_pulse) * (angle - 0) /
                    (300 - 0);
    return duty;
}

int duty_to_config_a(int duty, int max_pulse, int roll_value) {
    int a = (((duty/max_pulse) * 100) * roll_value) / 100;
    return a;
}

/**
 * Bilda servo max rotation is 300 degrees 
*/
PeripheralStatus Servo::write_angle(int handle, double angle) {
    int err;
    int duty;
    int a;
    int duty = angle_to_duty(angle, this->min_pulse, this->max_pulse);
    a = duty_to_config_a(duty, this->max_pulse, this->roll_value);
    err = LJM_eWriteName(handle, "DIO0_EF_CONFIG_A", a);
	ErrorCheck(err, "LJM_eWriteName");
    this->config_a = a;
    this->angle = angle;
    return PeripheralStatus::SUCCESS;
}

double Servo::read_angle(int handle) {
    return this->angle;
}

PeripheralStatus Servo::setup_servo(int handle) { 
    int err;
	int errAddress = INITIAL_ERR_ADDRESS;

	enum { NUM_FRAMES_CONFIGURE = 9 };
	const char * aNamesConfigure[NUM_FRAMES_CONFIGURE] = {
		"DIO_EF_CLOCK0_ENABLE",
		"DIO_EF_CLOCK0_DIVISOR",
		"DIO_EF_CLOCK0_ROLL_VALUE",
		"DIO_EF_CLOCK0_ENABLE",
        "DIO0_EF_ENABLE",
		"DIO0_EF_INDEX",
		"DIO0_EF_OPTIONS",
		"DIO0_EF_CONFIG_A",
		"DIO0_EF_ENABLE",
	};
	double aValuesConfigure[NUM_FRAMES_CONFIGURE] = {
		0,
		1,
		this->roll_value,
		1,
        0,
		0,
		0,
		this->config_a,
		1,
	};

    err = LJM_eWriteNames(handle, NUM_FRAMES_CONFIGURE, aNamesConfigure,
		aValuesConfigure, &errAddress);
	ErrorCheckWithAddress(err, errAddress, "LJM_eWriteNames - aNamesConfigure"); // exits if there is an error

    return PeripheralStatus::SUCCESS;
}

int microsecondsToHz(unsigned long long microseconds) {
    double seconds = static_cast<double>(microseconds) / 1000000.0;
    int frequency = static_cast<int>(std::round(1.0 / seconds));
    return frequency;
}

void Servo::test_peripheral(int handle) {
    int err;
    double value;
    err = LJM_eReadName(handle, name, &value);
    ErrorCheck(err, "LJM_eReadName");
    assert(value >= 0.0);
}