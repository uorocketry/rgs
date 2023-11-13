#include "main.hpp"

std::string exec(const char *cmd)
{
    std::array<char, 128> buffer;
    std::string result;
    std::unique_ptr<FILE, decltype(&pclose)> pipe(popen(cmd, "r"), pclose);
    if (!pipe)
    {
        throw std::runtime_error("popen() failed!");
    }
    while (fgets(buffer.data(), buffer.size(), pipe.get()) != nullptr)
    {
        // Buffer data has a json string
        std::string buf = buffer.data();

        // TODO: Convert this to a c++ object(?)
    }
    return result;
}

int main()
{
    try
    {
        std::string output = exec("../../../dbmim/main --record posts"); // Replace with your program's path
        std::cout << "Output of the program:\n"
                  << output << std::endl;
    }
    catch (const std::exception &e)
    {
        std::cerr << "Error: " << e.what() << std::endl;
    }

    return 0;

    float load;
    double temp;
    int angle;
    LoadCell load_cell = LoadCell("AIN2", "AIN3", 0.02);
    Thermocouple thermocouple = Thermocouple("AIN0", ThermocoupleType::K);
    Servo servo = Servo("DAC0", 500, 2500);
    LabJack labjack = LabJack();
    servo.setup_servo(labjack);
    servo.write_angle(labjack, 0.0);
    // MillisecondSleep(5000);
    servo.write_angle(labjack, 180.0);
    // Set up a flag to control the loop
    std::atomic<bool> exitFlag = false;

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

    std::cout << "Exiting the program." << std::endl;
    return 0;
}
