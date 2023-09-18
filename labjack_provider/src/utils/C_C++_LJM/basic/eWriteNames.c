/**
 * Name: eWriteNames.c
 * Desc: Shows how to use the LJM_eWriteNames function
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
	int errorAddress = INITIAL_ERR_ADDRESS;

	// write 2.5V to DAC0 and write 12345 to TEST_UINT16 (55110)

	#define NUM_FRAMES 2

	const char * aNames[NUM_FRAMES] = {"DAC0", "TEST_UINT16"};
	double aValues[NUM_FRAMES] = {2.5, 12345};

	// Open first found LabJack
	err = LJM_Open(LJM_dtANY, LJM_ctANY, "LJM_idANY", &handle);
	ErrorCheck(err, "LJM_Open");

	PrintDeviceInfoFromHandle(handle);

	printf("\nWriting:\n");
	for (i=0; i<NUM_FRAMES; i++) {
		printf("\t%f to %s\n", aValues[i], aNames[i]);
	}

	err = LJM_eWriteNames(handle, NUM_FRAMES, aNames, aValues, &errorAddress);
	ErrorCheckWithAddress(err, errorAddress, "LJM_eWriteNames");

	err = LJM_Close(handle);
	ErrorCheck(err, "LJM_Close");

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
