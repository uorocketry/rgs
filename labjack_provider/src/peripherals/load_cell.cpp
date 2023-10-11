#include "load_cell.hpp"

LoadCell::LoadCell(const char* initialNamePos, const char* initialNameNeg, float sensitivity, int ratedLoad) : Peripheral() {
    this->name_pos = initialNamePos;
    this->name_neg = initialNameNeg;
    this->sensitivity = sensitivity;
}

void LoadCell::test_peripheral(LabJack handle) {
    int err;
    double value;
    err = LJM_eReadName(handle.get_handle(), name_pos, &value);
    assert(value >= 0.0);
    err = LJM_eReadName(handle.get_handle(), name_neg, &value);
    assert(value >= 0.0);
}


/**
 * @brief Read the weight from the load cell.
 * Returns -1.0 if there is an error.
*/
float LoadCell::read_weight(LabJack handle) {
    int err;
    double value_pos;
    double value_neg;
    err = LJM_eReadName(handle.get_handle(), name_pos, &value_pos);
    if (err != 0) {
        return -1.0;
    }
    err = LJM_eReadName(handle.get_handle(), name_neg, &value_neg);
    if (err != 0) {
        return -1.0;
    }
    return rated_load * (value_neg - value_pos) / (sensitivity * 5.0);
    // return (value_pos - value_neg) * sensitivity;
}