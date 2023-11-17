#include "manager.hpp"

CommunicationManager::CommunicationManager()
{
    // std::thread t(&CommunicationManager::readInput, this);
    // t.detach(); // Detach the thread to allow it to run independently

    std::cout << "CommunicationManager constructor called" << std::endl;
    cpr::Response r = cpr::Post(cpr::Url{BASE_URL + "/api/admins/auth-with-password"},
                                cpr::Body{"{\"identity\":\"admin@admin.com\",\"password\":\"admin\"}"},
                                cpr::Header{{"Content-Type", "application/json"}});
    std::cout << "text returned: " + r.text << std::endl;
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

CommunicationManager::~CommunicationManager()
{
    std::cout << "CommunicationManager destructor called" << std::endl;
}

void CommunicationManager::readInput()
{
    try
    {
        const char *output = "../../dbmim/main --record Labjack";
        std::array<char, 1024> buffer;
        std::string result;
        std::unique_ptr<FILE, decltype(&pclose)> pipe(popen(output, "r"), pclose);
        std::cout << "Pipe: called application should be runnung" << std::endl;

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
    cpr::Response r = cpr::Post(cpr::Url{BASE_URL + "/api/collections/labjackLog/records"},
                                cpr::Body{j.toStyledString()},
                                cpr::Header{{"Content-Type", "application/json"}},
                                cpr::Bearer{token});
    std::cout << r.text << std::endl;
    if (r.status_code == 200)
    {
        return true;
    }
    else
    {
        return false;
    }

    // cpr::Response r = cpr::Get(cpr::Url{"http://www.httpbin.org/get"});
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
    data.timestamp = jMsg["timestamp"].asDouble();
    data.value = jMsg["value"].asDouble();
    data.peripheral = static_cast<Messages::periphrals>(jMsg["peripheral"].asInt());

    return data;
    // implement proper read function
}
