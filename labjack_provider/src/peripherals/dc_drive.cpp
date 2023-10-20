
#include "dc_drive.hpp"

DC_Drive::DC_Drive(const char* forwardName, const char* reverseName, double angle): Peripheral() {
    this->forwardName = forwardName;
    this->reverseName = reverseName;
    this->angle = angle;
}


void DC_Drive::test_peripheral(LabJack handle) {
    int err;
    double value;
    err = LJM_eReadName(handle.get_handle(), forwardName, &value);
    assert(err == 0);
    assert(value >= 0.0);
    err = LJM_eReadName(handle.get_handle(), reverseName, &value);
    assert(err == 0);
    assert(value >= 0.0);
}

void DC_Drive::forward(LabJack handle, int motorPower)
{
    direction = DCMotorDirection::Forward;
    LJM_eWriteName(handle.get_handle(),forwardName, motorPower);
    LJM_eWriteName(handle.get_handle(),reverseName, 0);
}

void DC_Drive::reverse(LabJack handle, int motorPower)
{
    direction = DCMotorDirection::Reverse;
    LJM_eWriteName(handle.get_handle(),forwardName, 0);
    LJM_eWriteName(handle.get_handle(),reverseName, motorPower);
}

void DC_Drive::stop(LabJack handle)
{
    direction = DCMotorDirection::Stopped;
    LJM_eWriteName(handle.get_handle(),this->forwardName, 0);
    LJM_eWriteName(handle.get_handle(),this->reverseName, 0);
}
void DC_Drive:: controlDCMotor(LabJack handle, int targetPosition, int motorPower)
{



        this->targetPosition = targetPosition;
        this->active = true;

        //Some function for angle propertional to time, motorPower ?

    while(active){
        if (this->angle < targetPosition)
        {
            forward(handle, motorPower);
        }
        else if (this->angle == targetPosition)
        {
            stop(handle);
            this->active=false;
        }
        else
        {
            reverse(handle, motorPower);
        }
    }
    }
    