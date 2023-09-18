/**
 * Name: single_ain_with_config.c
 * Desc: Demonstrates configuring and reading a single analog input (AIN) with a LabJack.
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

	// Set up for configuring the AIN
	// AIN0:
	//   Negative channel = single ended (199)
	//   Range: +/-10.0 V (10.0). T4 note: Only AIN0-AIN3 can support +/-10 V range.
	//   Resolution index = Default (0)
	//   Settling, in microseconds = Auto (0)
	enum { NUM_FRAMES_CONFIG = 4 };
	const char * aNamesConfig[NUM_FRAMES_CONFIG] = \
		{"AIN0_NEGATIVE_CH", "AIN0_RANGE", "AIN0_RESOLUTION_INDEX", "AIN0_SETTLING_US"};
	const double aValuesConfig[NUM_FRAMES_CONFIG] = {199, 10, 0, 0};
	int errorAddress = INITIAL_ERR_ADDRESS;

	// Set up for reading AIN value
	double value = 0;
	const char * NAME = "AIN0";

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);
	printf("\n");

	// Setup and call eWriteNames to configure AIN0 on the LabJack.
	err = LJM_eWriteNames(handle, NUM_FRAMES_CONFIG, aNamesConfig, aValuesConfig,
		&errorAddress);
	ErrorCheckWithAddress(err, errorAddress, "LJM_eWriteNames");

	printf("Set configuration:\n");
	for (i=0; i<NUM_FRAMES_CONFIG; i++) {
		printf("    %s : %f\n", aNamesConfig[i], aValuesConfig[i]);
	}

	// Read AIN0 from the LabJack
	err = LJM_eReadName(handle, NAME, &value);
	ErrorCheck(err, "LJM_eReadName");

	// Print results
	printf("\n%s : %f V\n", NAME, value);

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
