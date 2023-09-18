/**
 * Name: single_ain.c
 * Desc: Demonstrates reading a single analog input (AIN) from a LabJack.
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

	// Set up for reading AIN value
	double value = 0;
	const char * NAME = "AIN0";

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);
	printf("\n");

	// Read AIN from the LabJack
	err = LJM_eReadName(handle, NAME, &value);
	ErrorCheck(err, "LJM_eReadName");

	// Print results
	printf("%s: %f V\n", NAME, value);

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
