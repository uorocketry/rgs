#include "manager.hpp"

CommunicationManager::CommunicationManager()
{
    // std::thread t(&CommunicationManager::readInput, this);
    // t.detach(); // Detach the thread to allow it to run independently

    std::cout << "CommunicationManager constructor called" << std::endl;
    cpr::Response r = cpr::Post(cpr::Url{BASE_URL + "/api/admins/auth-with-password"},
                                cpr::Body{"{\"identity\":\"admin@admin.com\",\"password\":\"admin\"}"},
                                cpr::Header{{"Content-Type", "application/json"}});
    Json::Value auth_json;
    Json::CharReaderBuilder builder;
    Json::CharReader *reader = builder.newCharReader();
    std::string errors;
    bool parsingSuccessful = reader->parse(r.text.c_str(), r.text.c_str() + r.text.size(), &auth_json, &errors);
    delete reader;
    if (!parsingSuccessful)
    {
        std::cerr << "Failed to parse JSON: " << errors << std::endl;
    }
    token = auth_json["token"].asString();
}

void CommunicationManager::readInput()
{
    try
    {
        const char *output = "../../pbcat/pbcat --record labjack_in";
        std::array<char, 1024> buffer;
        std::string result;
        std::unique_ptr<FILE, decltype(&pclose)> pipe(popen(output, "r"), pclose);

        if (!pipe)
        {
            std::cout << "Pipe: failed" << std::endl;
            throw std::runtime_error("popen() failed!");
        }
        while (fgets(buffer.data(), buffer.size(), pipe.get()) != nullptr)
        {
            std::string buf = buffer.data();
            Json::Value j;

            Json::Reader reader;
            bool parsingSuccessful = reader.parse(buf, j);
            if (parsingSuccessful)
            {
                std::unique_lock<std::mutex> lock(queueMutex);
                messageQueue.push(j);
                lock.unlock();
                queueCV.notify_one();
            }
            else
            {
                // Handle parsing failure
                std::cerr << "Failed to parse JSON: " << reader.getFormattedErrorMessages() << std::endl;
            }
        }
    }
    catch (const std::exception &e)
    {
        std::cerr << "Error: " << e.what() << std::endl;
    }
}

bool CommunicationManager::log(Messages::Data msg)
{
    Json::Value j;
    j["timestamp"] = msg.timestamp;
    j["value"] = msg.value;
    j["peripheral"] = msg.peripheral;
    cpr::Response r = cpr::Post(cpr::Url{BASE_URL + "/api/collections/labjack_log/records"},
                                cpr::Body{j.toStyledString()},
                                cpr::Header{{"Content-Type", "application/json"}},
                                cpr::Bearer{token});
    if (r.status_code == 200)
    {
        return true;
    }
    else
    {
        return false;
    }
}

struct Messages::Data CommunicationManager::read()
{
    std::unique_lock<std::mutex> lock(queueMutex);
    queueCV.wait(lock, [this]
                 { return !messageQueue.empty(); });

    Json::Value jMsg = messageQueue.front();
    messageQueue.pop();
    lock.unlock();

    Messages::Data data;
    data.timestamp = jMsg["record"]["timestamp"].asDouble();
    data.value = jMsg["record"]["value"].asDouble();
    data.peripheral = static_cast<Messages::periphrals>(jMsg["record"]["peripheral"].asInt());

    return data;
    // implement proper read function
}
