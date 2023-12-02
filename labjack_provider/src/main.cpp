#include "main.hpp"

// Global variables
std::mutex event_mutex;
bool event_occurred = false;

void server_thread() {
    std::unique_lock<std::mutex> lock(event_mutex);
    while(!event_occurred) {

    }
    // Wait for event aka command. 
}

struct Message {

};

void sender_thread(Message msg) {
    // send msg from message queue 
    // lock my message queue and then use it.  
    while (true) {
        
    }
}


int main() {
    LabJack labjack = LabJack();

    PeripheralManager peripheral_manager = PeripheralManager();

    std::atomic<bool> exitFlag = false;

    // Create a thread for non-blocking input
    std::thread inputThread([&exitFlag]() {
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
        }
    });
    double i = 0.0;
    // Main loop
    while (!exitFlag) {
        // step state machine 
        // Get data from sensors 
        // Send data to server 
        peripheral_manager.open_feed_valve(labjack);
    }

    // Wait for the input thread to finish
    inputThread.join();

    std::cout << "Exiting the program." << std::endl;
    return 0;
}