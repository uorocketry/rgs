#include "solenoid.hpp"

Solenoid::Solenoid(const char* initialName){
    this->name = initialName;
}

/**
 * Gets the current power of the solenoid
 * Returns -10000 if there is an error
*/
double Solenoid::get_power(LabJack handle){
    int err;
    double power;
    err = LJM_eReadName(handle.get_handle(), name, &power);
    if (err !=0){
        return -10000
    }
    return power;

}

/** 
 * Sets the power of the solenoid
 * Power must be 0 or 1
*/
PeripheralStatus Solenoid::set_power(LabJack handle, double power){    
    int err;
    err = LJM_eWriteName(handle.getHandle(), name, power);
    if (err != 0) {
        return PeripheralStatus::FAILURE;
    }
    return PeripheralStatus::SUCCESS;    

}

void Solenoid::test_peripheral(LabJack handle){
    int err;
    double value;
    err = LJM_eWriteName(handle.get_handle(), name, &value);
    assert(err == 0);
    err = LJM_eReadName(handle.get_handle(), name, &value);
    assert(err == 0);
    assert(value >= 0.0);
    
}
