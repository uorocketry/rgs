#include "state_machine.hpp"

StateMachine::StateMachine(State *initialState) {
    this->currentState = initialState;
}

/**
 * Do not misuse this function. Make sure you can delete the state if it exits elsewhere. 
 * @brief Delete the state machine.
*/
StateMachine::~StateMachine() {
    // Will we ever destruct the state machine? 
    delete currentState;
}

/**
 * @brief Run the state machine. This function should never return. 
*/
void StateMachine::run() {
    while (true) {
        if (this->currentState == nullptr) {
            // Panic and exit the state machine
            break;
        }
        State* nextState = this->currentState->step();
        if (nextState != currentState) {
            delete currentState;
            currentState = nextState;
        }
    }
}