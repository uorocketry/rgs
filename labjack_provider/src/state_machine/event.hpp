#ifndef EVENT_HPP
#define EVENT_HPP

class Event {
public:
    virtual ~Event() {};
    virtual bool matches(const Event& other) const = 0;
};

#endif // EVENT_HPP