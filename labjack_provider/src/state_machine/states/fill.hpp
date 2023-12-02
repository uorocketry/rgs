#ifndef FILL_HPP
#define FILL_HPP

#include "../state.hpp"


class FillContext : public StateContext {
public:
    FillContext(LabJack labjack);
    ~FillContext();
    LabJack get_labjack();
private:
    std::lock_guard<std::mutex> peripheral_manager_mutex;
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
