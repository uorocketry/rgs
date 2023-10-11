#include "fill.hpp"

FillContext::FillContext(std::vector<std::shared_ptr<Peripheral>>, LabJack labjack) {
    this->peripherals = peripherals;
    this->labjack = labjack;
}

FillContext::~FillContext() {
}
 
std::vector<std::shared_ptr<Peripheral>> FillContext::get_peripherals() {
    return this->peripherals;
}

LabJack FillContext::get_labjack() {
    return this->labjack;
}

Fill::Fill(FillContext* context) {
    this->context = context;
}

Fill::~Fill() {
}

void Fill::enter_state() {
}

void Fill::exit_state() {
}

State* Fill::step_impl() {
    if (true) {
        return nullptr;
    }
    return this;
}