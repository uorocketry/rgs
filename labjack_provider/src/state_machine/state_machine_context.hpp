#ifndef STATE_MACHINE_CONTEXT_HPP
#define STATE_MACHINE_CONTEXT_HPP

#include <memory>
#include <vector>
#include "peripheral.hpp"

class StateContext {
public:
    virtual ~StateContext() {}; 
    virtual std::vector<std::shared_ptr<Peripheral>> get_peripherals() = 0;
    virtual LabJack get_labjack() = 0;
private: 
    std::vector<std::shared_ptr<Peripheral>> peripherals;
    LabJack labjack;
};

#endif // STATE_MACHINE_CONTEXT_HPP