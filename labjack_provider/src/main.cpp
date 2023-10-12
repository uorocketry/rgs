#include "main.hpp"

void PublisherThread(zmq::context_t *ctx, std::atomic<bool> *exitFlag)
{
    zmq::socket_t publisher(*ctx, zmq::socket_type::pub);
    publisher.bind("tcp://*:3003");
    std::cout << "Publisher thread started." << std::endl;
    while (!(*exitFlag))
    {
        std::string msg = "Hello";
        zmq::message_t zmq_msg(msg.size());
        memcpy(zmq_msg.data(), msg.data(), msg.size());
        publisher.send(zmq_msg, zmq::send_flags::none);
        std::cout << "Sent message: " << msg << std::endl;
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
    std::cout << "Publisher thread finished." << std::endl;
}

void SubscriberThread(zmq::context_t *ctx, std::atomic<bool> *exitFlag)
{
    zmq::socket_t subscriber(*ctx, zmq::socket_type::sub);
    subscriber.connect("tcp://localhost:3002");
    subscriber.set(zmq::sockopt::subscribe, "");
    std::cout << "Subscriber thread started." << std::endl;
    while (!(*exitFlag))
    {
        zmq::message_t zmq_msg;
        subscriber.recv(zmq_msg, zmq::recv_flags::none);
        std::string msg = std::string(static_cast<char *>(zmq_msg.data()), zmq_msg.size());
        std::cout << "Received message: " << msg << std::endl;
    }
    std::cout << "Subscriber thread finished." << std::endl;
}

int main()
{
    float load;
    double temp;
    int angle;
    // LoadCell load_cell = LoadCell("AIN2", "AIN3", 0.02);
    // Thermocouple thermocouple = Thermocouple("AIN0", ThermocoupleType::K);
    // Servo servo = Servo("DAC0", 500, 2500);
    // LabJack labjack = LabJack();
    // servo.setup_servo(labjack);
    // servo.write_angle(labjack, 0.0);
    // // MillisecondSleep(5000);
    // servo.write_angle(labjack, 180.0);
    // Set up a flag to control the loop
    std::atomic<bool> exitFlag = false;
    zmq::context_t ctx;

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
    auto pub_thread = std::async(std::launch::async, PublisherThread, &ctx, &exitFlag);
    auto sub_thread = std::async(std::launch::async, SubscriberThread, &ctx, &exitFlag);
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
    pub_thread.wait();
    sub_thread.wait();

    std::cout << "Exiting the program." << std::endl;
    return 0;
}