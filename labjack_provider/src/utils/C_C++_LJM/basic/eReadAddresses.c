/**
 * Name: eReadAddresses.c
 * Desc: Shows how to use the LJM_eReadAddresses function
**/

// For printf
#include <stdio.h>

// For the LabJackM Library
#include <LabJackM.h>

// For LabJackM helper functions, such as OpenOrDie, PrintDeviceInfoFromHandle,
// ErrorCheck, etc.
#include "../LJM_Utilities.h"

int main()
{
	int err, i, handle;

	// Read serial number, product ID, and then firmware version.

	#define NUM_FRAMES 3

	int aAddresses[NUM_FRAMES] = {60028, 60000, 60004};
	int aTypes[NUM_FRAMES] = {LJM_UINT32, LJM_FLOAT32, LJM_FLOAT32};
	double aValues[NUM_FRAMES] = {0.0, 0.0, 0.0};

	int errorAddress = INITIAL_ERR_ADDRESS;

	// Open first found LabJack
	err = LJM_Open(LJM_dtANY, LJM_ctANY, "LJM_idANY", &handle);
	ErrorCheck(err, "LJM_Open");

	PrintDeviceInfoFromHandle(handle);

	err = LJM_eReadAddresses(handle, NUM_FRAMES, aAddresses, aTypes, aValues, &errorAddress);
	ErrorCheckWithAddress(err, errorAddress, "LJM_eReadAddresses");

	// Print results
	printf("\nLJM_eReadAddresses results:\n");
	for (i = 0; i<NUM_FRAMES; i++) {
		printf("\tAddress - %d, type - %d: %f\n", aAddresses[i], aTypes[i], aValues[i]);
	}

	err = LJM_Close(handle);
	ErrorCheck(err, "LJM_Close");

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
