#include "fill.hpp"

Fill::Fill(FillContext* context) {
    this->context = context;
}

void Fill::enter_state() {
}

void Fill::exit_state() {
}

State* Fill::step() {
    if (true) {
        return nullptr;
    }
    return this;
}