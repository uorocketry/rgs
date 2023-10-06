#ifndef FILL_HPP
#define FILL_HPP

#include "../state.hpp"


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


class Fill : public State {
public:
    Fill(FillContext* context);
    ~Fill();
    void enter_state();
    void exit_state();
private:
    State* step_impl();
    FillContext* context;
};

#endif // FILL_HPP