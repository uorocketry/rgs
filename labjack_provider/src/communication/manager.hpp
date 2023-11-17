#ifndef COMMUNICATION_MANAGER_HPP
#define COMMUNICATION_MANAGER_HPP

#include <iostream>

#include <json/json.h>
#include <cpr/cpr.h>
// #include <uwebsockets>

#include "message.hpp"

class CommunicationManager
{
public:
    CommunicationManager();
    ~CommunicationManager();
    bool log(Messages::Data msg);
    struct Messages::Data read();
    void readInput();

private:
    const std::string BASE_URL = "http://127.0.0.1:8090";
    std::string token;
    std::queue<Json::Value> messageQueue;
    std::mutex queueMutex;
    std::condition_variable queueCV;
};

#endif
