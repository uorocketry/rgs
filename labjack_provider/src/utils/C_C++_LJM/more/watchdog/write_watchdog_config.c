/**
 * Name: write_watchdog_config.c
 * Desc: Demonstrates how to configure the the Watchdog on a LabJack.
**/

// For printf
#include <stdio.h>

// For the LabJackM Library
#include <LabJackM.h>

// For LabJackM helper functions, such as OpenOrDie, PrintDeviceInfoFromHandle,
// ErrorCheck, etc.
#include "../../LJM_Utilities.h"

int main()
{
	int err;
	int handle;
	int i;
	int errorAddress = INITIAL_ERR_ADDRESS;

	// Set up operation to set the Ethernet configuration
	enum { NUM_FRAMES = 16 };
	const char * aNames[NUM_FRAMES] = {
		"WATCHDOG_ENABLE_DEFAULT", "WATCHDOG_ADVANCED_DEFAULT",
		"WATCHDOG_TIMEOUT_S_DEFAULT", "WATCHDOG_STARTUP_DELAY_S_DEFAULT",
		"WATCHDOG_STRICT_ENABLE_DEFAULT", "WATCHDOG_STRICT_KEY_DEFAULT",
		"WATCHDOG_RESET_ENABLE_DEFAULT", "WATCHDOG_DIO_ENABLE_DEFAULT",
		"WATCHDOG_DIO_STATE_DEFAULT", "WATCHDOG_DIO_DIRECTION_DEFAULT",
		"WATCHDOG_DIO_INHIBIT_DEFAULT", "WATCHDOG_DAC0_ENABLE_DEFAULT",
		"WATCHDOG_DAC0_DEFAULT", "WATCHDOG_DAC1_ENABLE_DEFAULT",
		"WATCHDOG_DAC1_DEFAULT", "WATCHDOG_ENABLE_DEFAULT"
	};
	double aValues[NUM_FRAMES] = {
		0, 0,
		20, 0,
		0, 0,
		1, 0,
		0, 0,
		0, 0,
		0, 0,
		0, 0
	};

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);
	printf("\n");

	// Write Ethernet config values to the LabJack
	err = LJM_eWriteNames(handle, NUM_FRAMES, aNames, aValues, &errorAddress);
	ErrorCheckWithAddress(err, errorAddress, "LJM_eReadNames");

	printf("Set Watchdog configuration:\n");
	for (i=0; i<NUM_FRAMES; i++) {
		printf("    %s : %f\n", aNames[i], aValues[i]);
	}

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
