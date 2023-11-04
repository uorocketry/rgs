#include "main.hpp"

void WriteThread(std::string token)
{
    Json::Value j;
    j["timestamp"] = 0.0;
    j["value"] = 0.0;
    j["peripheral"] = Messages::periphrals::LOADCELL;
    // std::cout << j.toStyledString() << std::endl;
    cpr::Response r = cpr::Post(cpr::Url{"http://0.0.0.0:8090/api/collections/labjackRead/records"},
                                cpr::Body{j.toStyledString()},
                                cpr::Header{{"Content-Type", "application/json"}},
                                cpr::Bearer{token});
    std::cout << r.text << std::endl;
}

int main()
{
    float load;
    double temp;
    int angle;
    LoadCell load_cell = LoadCell("AIN2", "AIN3", 0.02);
    // Thermocouple thermocouple = Thermocouple("AIN0", ThermocoupleType::K);
    // Servo servo = Servo("FIO0", 500, 2500);
    // LabJack labjack = LabJack();
    // servo.setup_servo(labjack);
    // servo.write_angle(labjack, 0.0);

    // MillisecondSleep(5000);
    // servo.write_angle(labjack, 180.0);
    // Set up a flag to control the loop
    std::atomic<bool>
        exitFlag = false;
    // Auth with admin account on startup
    cpr::Response r = cpr::Post(cpr::Url{"http://0.0.0.0:8090/api/admins/auth-with-password"},
                                cpr::Body{"{\"identity\":\"admin@admin.com\",\"password\":\"admin\"}"},
                                cpr::Header{{"Content-Type", "application/json"}});
    std::cout << r.text << std::endl;
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
    struct Messages::Data msg;

    // Create a thread for non-blocking input
    std::thread inputThread([&exitFlag]()
                            {
        while (true) {
            std::string userInput;
            std::cout << "Enter 'q' to quit: ";

            // Set input stream to non-blocking mode
            std::cin.sync_with_stdio(false);
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');

            // Attempt to read input
            std::getline(std::cin, userInput);

            // Check if 'q' is entered
            if (userInput == "q") {
                exitFlag = true;
                break;
            }

            // Print user input
            std::cout << "You entered: " << userInput << std::endl;
        } });

    double i = 0.0;
    std::thread write_thread = std::thread(WriteThread, auth_json["token"].asString());
    // Main loop
    while (!exitFlag)
    {
        // Your main loop logic here
        // temp = thermocouple.read_temperature(handle);
        // load = load_cell.read_weight(handle);
        // std::cout << "Temp: " << temp << std::endl;
        // if (i >= 180.0) {
        //     i = 0.0;
        // }
        // servo.write_angle(handle, i);
        // std::this_thread::sleep_for(std::chrono::milliseconds(100));
        // i++;
    }

    // Wait for the input thread to finish
    inputThread.join();
    write_thread.join();
    // pub_thread.wait();
    // sub_thread.wait();

    std::cout << "Exiting the program." << std::endl;
    return 0;
}