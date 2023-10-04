#ifndef WAIT_FOR_FILL_HPP
#define WAIT_FOR_FILL_HPP

#include "state_machine_context.hpp"
#include "state.hpp"

class WaitForFill : public State {
public:
    WaitForFill(WaitForFillContext* context);
    ~WaitForFill();
    void enter_state();
    void exit_state();
    State* step();
private:
    WaitForFillContext* context;
};


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

#endif // STATE_MACHINE_HPP