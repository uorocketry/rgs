
#include "dc_drive.hpp"

//Instantiate the DC_Driver with the analogs that create the forward drive, reverse drice, and potentiometer to measure angle. 

//Including setup with angle (Don't know if there is going to be a default)

DC_Drive::DC_Drive(const char* forwardName, const char* reverseName, const char* potentiometerName, double angle): Peripheral() {
    this->forwardName = forwardName;
    this->reverseName = reverseName;
    this->potentiometerName=potentiometerName;
    this->angle = angle;
}

//Function which tests the DC Driver setup
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

//DC Driver forward function, sends the voltage of motorPower value to the forward analog

void DC_Drive::forward(LabJack handle, int motorPower)
{
    direction = DCMotorDirection::Forward;
    int err;
    err=LJM_eWriteName(handle.get_handle(),forwardName, motorPower);
    err=LJM_eWriteName(handle.get_handle(),reverseName, 0);
}

//DC Driver reverse function, send the voltage of motorPower value to the reverse analog

void DC_Drive::reverse(LabJack handle, int motorPower)
{
    direction = DCMotorDirection::Reverse;
    int err;
    err=LJM_eWriteName(handle.get_handle(),forwardName, 0);
    err=LJM_eWriteName(handle.get_handle(),reverseName, motorPower);
}

//Stops driver

void DC_Drive::stop(LabJack handle)
{
    direction = DCMotorDirection::Stopped;
    int err;
    err=LJM_eWriteName(handle.get_handle(),this->forwardName, 0);
    err=LJM_eWriteName(handle.get_handle(),this->reverseName, 0);
}

//Function to read the angle (Reads the pure labjack raw value, haven't done the conversion formula)

double DC_Drive::read_Angle(LabJack handle)
{
    double value;
    int err;
    err=LJM_eReadName(handle.get_handle(),this->potentiometerName, &value);
     if (err != 0) {
        return -1.0;
    }
    //Function to convert to angle
    return value;
}

//Function which runs and controls the DC Motor, give a target angle and power
void DC_Drive:: controlDCMotor(LabJack handle, double targetPosition, int motorPower)
{
     //Runs the motor in the direction towards the target position and sets to active
        this->targetPosition = targetPosition;
        this->active = true;
    
        if (this->angle < targetPosition)
        {
            forward(handle, motorPower);
        }
        else if (this->angle == targetPosition)
        {
            stop(handle);
        }
        else
        {
            reverse(handle, motorPower);
        }

//Control loop, Runs motor until it reaches target postition then it stops and gets flagged as inactive
        while (this->active){
             if ((this->angle < this->targetPosition && direction == DCMotorDirection::Reverse) ||
                (this->angle > this->targetPosition && direction == DCMotorDirection::Forward))
            {
                this->active=false;
                stop(handle);
            }

        }
}
    
    
    