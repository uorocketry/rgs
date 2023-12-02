#include "fill.hpp"

FillContext::FillContext(LabJack labjack) {
    this->labjack = labjack;
}

FillContext::~FillContext() {
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