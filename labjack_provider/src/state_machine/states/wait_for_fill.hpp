#ifndef WAIT_FOR_FILL_HPP
#define WAIT_FOR_FILL_HPP

#include "../state.hpp"

class WaitForFillContext : public StateContext {
public:
    WaitForFillContext(std::vector<std::shared_ptr<Peripheral>> peripherals, LabJack labjack);
    ~WaitForFillContext();
    std::vector<std::shared_ptr<Peripheral>> get_peripherals();
    LabJack get_labjack();
private:
    std::vector<std::shared_ptr<Peripheral>> peripherals;
    LabJack labjack; // should be a reference
};

class WaitForFill : public State {
public:
    WaitForFill(WaitForFillContext* context);
    ~WaitForFill();
    void enter_state();
    void exit_state();
private:
    State* step_impl();
    WaitForFillContext* context;
};

#endif // STATE_MACHINE_HPP