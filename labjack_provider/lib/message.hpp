#ifndef MESSAGE_HPP
#define MESSAGE_HPP

class Messages
{

public:
    enum periphrals
    {
        LOADCELL,
        thermocouple,
        servo
    };

    struct Data
    {
        double timestamp;
        double value;
        periphrals peripheral;
    };
};

#endif