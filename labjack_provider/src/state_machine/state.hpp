#ifndef STATE_HPP
#define STATE_HPP

#include <memory>
#include <vector>
#include "peripherals.hpp"

class StateContext {
public:
    virtual ~StateContext() {}; 
    virtual std::vector<std::shared_ptr<Peripheral>> get_peripherals() = 0;
    virtual LabJack get_labjack() = 0;
private: 
    std::vector<std::shared_ptr<Peripheral>> peripherals;
    LabJack labjack;
};


class State {
public:
    virtual ~State() {} 
    virtual void enter_state() = 0;
    virtual void exit_state() = 0;
    virtual State* step() final {
        return step_impl();
    };
private:
    virtual State* step_impl() = 0;
};

#endif // STATE_HPP