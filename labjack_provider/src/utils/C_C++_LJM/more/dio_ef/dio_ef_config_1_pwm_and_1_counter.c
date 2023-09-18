/**
 * Name: dio_ef_config_1_pwm_and_1_counter.c
 * Desc: Enables a 10 kHz PWM output on FIO0 for the T7 or FIO6 for the T4,
 *       enables a high-speed counter on CIO2 (DIO18), waits 1 second and reads
 *       the counter. Jumper FIO0/FIO6 to CIO2 and the read value. Should return
 *       around 10000.
 *
 * DIO extended features, PWM output and high-speed counter documented here:
 *
 * https://labjack.com/support/datasheets/t-series/digital-io/extended-features
 * https://labjack.com/support/datasheets/t-series/digital-io/extended-features/pwm-out
 * https://labjack.com/support/datasheets/t-series/digital-io/extended-features/high-speed-counter
**/

// For printf
#include <stdio.h>

// For the LabJackM Library
#include <LabJackM.h>

// For LabJackM helper functions, such as OpenOrDie, PrintDeviceInfoFromHandle,
// ErrorCheck, etc.
#include "../../LJM_Utilities.h"

void dio_ef_pwm_and_counter(int handle);

int main()
{
	int handle;

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);

	dio_ef_pwm_and_counter(handle);

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}

void dio_ef_pwm_and_counter(int handle)
{
	int err;
	int errAddress = INITIAL_ERR_ADDRESS;
	int pwmDIO;
	char DIO_EF_INDEX_PLACEHOLDER[LJM_MAX_NAME_SIZE];
	char DIO_EF_CONFIG_A_PLACEHOLDER[LJM_MAX_NAME_SIZE];
	char DIO_EF_ENABLE_PLACEHOLDER[LJM_MAX_NAME_SIZE];

	// Set up for reading DIO state
	enum { NUM_FRAMES_CONFIGURE = 8 };
	const char * aNamesConfigure[NUM_FRAMES_CONFIGURE] = {
		"DIO_EF_CLOCK0_DIVISOR",
		"DIO_EF_CLOCK0_ROLL_VALUE",
		"DIO_EF_CLOCK0_ENABLE",
		DIO_EF_INDEX_PLACEHOLDER,
		DIO_EF_CONFIG_A_PLACEHOLDER,
		DIO_EF_ENABLE_PLACEHOLDER,
		"DIO18_EF_INDEX",
		"DIO18_EF_ENABLE"
	};
	double aValuesConfigure[NUM_FRAMES_CONFIGURE] = {
		1,
		8000,
		1,
		0,
		2000,
		1,
		7,
		1
	};

	// Set up for turning off PWM output and counter
	enum { NUM_FRAMES_DISABLE = 2 };
	const char * aNamesDisable[NUM_FRAMES_DISABLE] = {
		"DIO_EF_CLOCK0_ENABLE",
		DIO_EF_ENABLE_PLACEHOLDER,
	};
	double aValuesDisable[NUM_FRAMES_DISABLE] = {
		0,
		0
	};

	// Configure the PWM output and counter.
	if (GetDeviceType(handle) == LJM_dtT4) {
		// For the T4, use FIO6 (DIO6) for the PWM output
		pwmDIO = 6;
	}
	else {
		// For the T7 and other devices, use FIO0 (DIO0) for the PWM output
		pwmDIO = 0;
	}
	sprintf(DIO_EF_INDEX_PLACEHOLDER, "DIO%d_EF_INDEX", pwmDIO);
	sprintf(DIO_EF_CONFIG_A_PLACEHOLDER, "DIO%d_EF_CONFIG_A", pwmDIO);
	sprintf(DIO_EF_ENABLE_PLACEHOLDER, "DIO%d_EF_ENABLE", pwmDIO);

	err = LJM_eWriteNames(handle, NUM_FRAMES_CONFIGURE, aNamesConfigure,
		aValuesConfigure, &errAddress);
	ErrorCheckWithAddress(err, errAddress, "LJM_eWriteNames - aNamesConfigure");

	// Wait 1 second.
	MillisecondSleep(1000);

	// Read from the counter.
	printf("\nCounter - ");
	GetAndPrint(handle, "DIO18_EF_READ_A");

	// Turn off PWM output and counter
	err = LJM_eWriteNames(handle, NUM_FRAMES_DISABLE, aNamesDisable,
		aValuesDisable, &errAddress);
	ErrorCheckWithAddress(err, errAddress, "LJM_eWriteNames - aNamesDisable");
}
