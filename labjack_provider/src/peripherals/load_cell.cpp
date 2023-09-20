#include "load_cell.hpp"

LoadCell::LoadCell(const char* initialNamePos, const char* initialNameNeg, float sensitivity, int ratedLoad) : Peripheral() {
    this->name_pos = initialNamePos;
    this->name_neg = initialNameNeg;
    this->sensitivity = sensitivity;
}

void LoadCell::test_peripheral(int handle) {
    int err;
    double value;
    err = LJM_eReadName(handle, name_pos, &value);
    // ErrorCheck(err, "LJM_eReadName");
    assert(value >= 0.0);
    err = LJM_eReadName(handle, name_neg, &value);
    // ErrorCheck(err, "LJM_eReadName");
    assert(value >= 0.0);
}

float LoadCell::read_weight(int handle) {
    int err;
    double value_pos;
    double value_neg;
    err = LJM_eReadName(handle, name_pos, &value_pos);
    // ErrorCheck(err, "LJM_eReadName");
    err = LJM_eReadName(handle, name_neg, &value_neg);
    // ErrorCheck(err, "LJM_eReadName");
    return rated_load * (value_neg - value_pos) / (sensitivity * 5.0);
    // return (value_pos - value_neg) * sensitivity;
}