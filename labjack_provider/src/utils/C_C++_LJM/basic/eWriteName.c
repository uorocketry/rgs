/**
 * Name: eWriteName.c
 * Desc: Shows how to use the LJM_eWriteName function
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

	const char * NAME = "DAC0";
	double value = 2.5;

	// Open first found LabJack
	err = LJM_Open(LJM_dtANY, LJM_ctANY, "LJM_idANY", &handle);
	ErrorCheck(err, "LJM_Open");

	PrintDeviceInfoFromHandle(handle);

	printf("\nWriting %f to %s\n", value, NAME);

	err = LJM_eWriteName(handle, NAME, value);
	ErrorCheck(err, "LJM_eWriteName");

	err = LJM_Close(handle);
	ErrorCheck(err, "LJM_Close");

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
