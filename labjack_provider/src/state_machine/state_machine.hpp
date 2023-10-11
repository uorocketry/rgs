#ifndef STATE_MACHINE_HPP
#define STATE_MACHINE_HPP

#include "state.hpp"

class StateMachine {
public:
    StateMachine(State *initialState);
    ~StateMachine();
    void run();
    State* get_state();

private:
    State *currentState;
};

#endif // STATE_MACHINE_HPP