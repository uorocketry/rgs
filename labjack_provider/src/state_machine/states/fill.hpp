#ifndef FILL_HPP
#define FILL_HPP

#include "state_machine_context.hpp"
#include "state.hpp"

class Fill : public State {
public:
    Fill(FillContext* context);
    ~Fill();
    void enter_state();
    void exit_state();
    State* step();
private:
    FillContext* context;
};


class FillContext : public StateContext {
public:
    FillContext(std::vector<std::shared_ptr<Peripheral>> peripherals, LabJack labjack);
    ~FillContext();
    std::vector<std::shared_ptr<Peripheral>> get_peripherals();
    LabJack get_labjack();
private:
    std::vector<std::shared_ptr<Peripheral>> peripherals;
    LabJack labjack; // should be a reference
};

#endif // FILL_HPP