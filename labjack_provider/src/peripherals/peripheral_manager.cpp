#include "peripheral_manager.hpp"

PeripheralManager::PeripheralManager() {
    feed_valve = new Servo("DAC0", 0.0, 5.0);
    fill_valve = new Servo("DAC1", 0.0, 5.0);
    // main_valve = new DCServo("FIO0", 0.0, 5.0);
    thermocouple1 = new Thermocouple("AIN0");
    thermocouple2 = new Thermocouple("AIN1");
    thermocouple3 = new Thermocouple("AIN2");
    main_load_cell = new LoadCell("AIN3", "AIN4", 0.0005, 1000);
    side_load_cell = new LoadCell("AIN5", "AIN6", 0.0005, 1000);
}

void PeripheralManager::test_peripherals(LabJack handle) {
    feed_valve->test_peripheral(handle);
    fill_valve->test_peripheral(handle);
    // main_valve->test_peripheral(handle);
    thermocouple1->test_peripheral(handle);
    thermocouple2->test_peripheral(handle);
    thermocouple3->test_peripheral(handle);
    main_load_cell->test_peripheral(handle);
    side_load_cell->test_peripheral(handle);
}

PeripheralStatus PeripheralManager::open_feed_valve(LabJack handle) {
    return feed_valve->write_angle(handle, 100.0);
}

PeripheralStatus PeripheralManager::close_feed_valve(LabJack handle) {
    return feed_valve->write_angle(handle, 0.0);
}

PeripheralStatus PeripheralManager::open_fill_valve(LabJack handle) {
    return fill_valve->write_angle(handle, 100.0);
}

PeripheralStatus PeripheralManager::close_fill_valve(LabJack handle) {
    return fill_valve->write_angle(handle, 0.0);
}

// Why use pointer if not using pointer for LabJack? 
double static read_thermocouple(LabJack handle, Thermocouple* thermocouple) {
    return thermocouple->read_temperature(handle);
}

double PeripheralManager::read_thermocouple1(LabJack handle) {
    return thermocouple1->read_temperature(handle);
}