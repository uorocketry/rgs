/**
 * Name: write_device_name_string.c
 * Desc: Demonstrates how to write the device name string to a LabJack.
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

	const char * NAME_REGISTER = "DEVICE_NAME_DEFAULT";
	const char * NAME_TO_WRITE = "My Favorite LabJack Device";

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);

	// Write
	printf("\nWriting \"%s\" to %s\n", NAME_TO_WRITE, NAME_REGISTER);
	err = LJM_eWriteNameString(handle, NAME_REGISTER, NAME_TO_WRITE);
	ErrorCheck(err, "LJM_eWriteNameString");

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
