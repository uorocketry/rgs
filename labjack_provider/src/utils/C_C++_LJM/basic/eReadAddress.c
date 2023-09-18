/**
 * Name: eReadAddress.c
 * Desc: Shows how to use the LJM_eReadAddress function
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
	int err, handle;
	double value = 0;

	const int ADDRESS = 60028; // 60028 is serial number
	const int TYPE = LJM_UINT32;

	// Open first found LabJack
	err = LJM_Open(LJM_dtANY, LJM_ctANY, "LJM_idANY", &handle);
	ErrorCheck(err, "LJM_Open");

	PrintDeviceInfoFromHandle(handle);

	err = LJM_eReadAddress(handle, ADDRESS, TYPE, &value);
	ErrorCheck(err, "LJM_eReadAddress");

	printf("\nLJM_eReadAddress result - %d (data type: %d): %f\n", ADDRESS, TYPE, value);

	err = LJM_Close(handle);
	ErrorCheck(err, "LJM_Close");

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
