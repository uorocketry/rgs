#ifndef STATE_HPP
#define STATE_HPP

class State {
public:
    virtual ~State() {} 
    virtual void enter_state();
    virtual void exit_state();
    virtual State* step();
};

#endif // STATE_HPP