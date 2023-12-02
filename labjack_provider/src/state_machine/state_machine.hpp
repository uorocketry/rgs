#ifndef STATE_MACHINE_HPP
#define STATE_MACHINE_HPP

#include "state.hpp"
#include "event.hpp"
#include <queue>

class StateMachine {
public:
    StateMachine(State *initialState);
    ~StateMachine();
    void run();
    State* get_state();

private:
    State *currentState;
    std::queue<Event*> eventQueue;
};

#endif // STATE_MACHINE_HPP