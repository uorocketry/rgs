/**
 * Name: eAddresses.c
 * Desc: Shows how to use the LJM_eAddresses function
**/

// For printf
#include <stdio.h>

// For the LabJackM library
#include <LabJackM.h>

// For LabJackM helper functions, such as OpenOrDie, PrintDeviceInfoFromHandle,
// ErrorCheck, etc.
#include "../LJM_Utilities.h"

int main()
{
	int err, frameI, arrayI, valueI, handle;
	int errorAddress = INITIAL_ERR_ADDRESS;

	// Write 2.5V to DAC0,
	// write 12345 to TEST_UINT16,
	// read TEST_UINT16,
	// read serial number,
	// read product ID,
	// and read firmware version.

	#define NUM_FRAMES 6

	int aAddresses[NUM_FRAMES] = {1000, 55110, 55110, 60028, 60000, 60004};
	int aTypes[NUM_FRAMES] = {LJM_FLOAT32, LJM_UINT16, LJM_UINT16, LJM_UINT32,
							 LJM_FLOAT32, LJM_FLOAT32};
	int aWrites[NUM_FRAMES] = {LJM_WRITE, LJM_WRITE, LJM_READ, LJM_READ,
								   LJM_READ, LJM_READ};
	int aNumValues[NUM_FRAMES] = {1, 1, 1, 1, 1, 1};
	double aValues[6] = {2.5, 12345, 0.0, 0.0, 0.0, 0.0};

	// Open first found LabJack
	err = LJM_Open(LJM_dtANY, LJM_ctANY, "LJM_idANY", &handle);
	ErrorCheck(err, "LJM_Open");

	PrintDeviceInfoFromHandle(handle);

	err = LJM_eAddresses(handle, NUM_FRAMES, aAddresses, aTypes, aWrites, aNumValues,
		aValues, &errorAddress);
	ErrorCheckWithAddress(err, errorAddress, "LJM_eAddresses");

	printf("\nLJM_eAddresses results:\n");
	valueI = 0;
	for (frameI=0; frameI<NUM_FRAMES; frameI++) {
		printf("\t");
		if (aWrites[frameI] == LJM_WRITE) {
			printf("Wrote");
		}
		else {
			printf("Read ");
		}
		printf(" - % 6d: [", aAddresses[frameI]);

		for (arrayI=0; arrayI<aNumValues[frameI]; arrayI++) {
			printf(" %f", aValues[valueI++]);
		}
		printf(" ]\n");
	}

	err = LJM_Close(handle);
	ErrorCheck(err, "LJM_Close");

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
