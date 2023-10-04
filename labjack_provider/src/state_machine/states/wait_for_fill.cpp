#include "wait_for_fill.hpp"
#include "fill.hpp"

WaitForFill::WaitForFill(WaitForFillContext* context) {
    this->context = context;
}

void WaitForFill::enter_state() {
}

void WaitForFill::exit_state() {
}

State* WaitForFill::step() {
    if (true) {
        FillContext* context = new FillContext(this->context->get_peripherals(), this->context->get_labjack());
        return new Fill(context);
    }
    return this;
}