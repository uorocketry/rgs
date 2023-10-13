#ifndef STATE_HPP
#define STATE_HPP

#include <memory>
#include <vector>
#include <mutex>
#include "peripheral_manager.hpp"

class StateContext {
public:
    virtual ~StateContext() {}; 
    virtual LabJack get_labjack() = 0;
private: 
    std::lock_guard<std::mutex> peripheral_manager_mutex;
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