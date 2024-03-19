#ifndef DCDRIVE_HPP
#define DCDRIVE_HPP

#include <iostream>
#include <assert.h>
#include "peripheral.hpp" 


enum DCMotorDirection
{
    Forward,
    Reverse,
    Stopped
};


class DC_Drive : public Peripheral {
    DC_Drive(const char* forwardName, const char* reverseName, const char* potentiometerName, double angle);
    void test_peripheral(LabJack handle) override;
    void forward(LabJack handle, int motorPower);
    void reverse(LabJack handle, int motorPower);
    void stop(LabJack handle);
    double read_Angle(LabJack handle);
    void controlDCMotor(LabJack handle, double targetPosition, int motorPower);

    
private:
    const char* forwardName; 
    const char* reverseName;
    double angle;
    bool active = false;
    int targetPosition = 0;
    DCMotorDirection direction = DCMotorDirection::Stopped;
    const char* potentiometerName;
};



#endif