#ifndef PERIPHERAL_MANAGER_HPP
#define PERIPHERAL_MANAGER_HPP

#include <iostream>
#include <assert.h>
#include <mutex>
#include "peripherals.hpp"

class PeripheralManager {
public:
    PeripheralManager();
    void test_peripherals(LabJack handle);
    PeripheralStatus open_feed_valve(LabJack handle);
    PeripheralStatus close_feed_valve(LabJack handle);
    PeripheralStatus open_fill_valve(LabJack handle);
    PeripheralStatus close_fill_valve(LabJack handle);
    // PeripheralStatus open_main_valve();
    // PeripheralStatus close_main_valve();
    double read_thermocouple1(LabJack handle);
    double read_thermocouple2(LabJack handle);
    
    double read_thermocouple3(LabJack handle);
    float read_main_load_cell(LabJack handle);
    float read_side_load_cell(LabJack handle);
private:
    Servo* feed_valve;
    Servo* fill_valve;
    // DCServo* main_valve;
    Thermocouple* thermocouple1;
    Thermocouple* thermocouple2;
    Thermocouple* thermocouple3;
    LoadCell* main_load_cell;
    LoadCell* side_load_cell;
};


#endif // PERIPHERAL_MANAGER_HPP