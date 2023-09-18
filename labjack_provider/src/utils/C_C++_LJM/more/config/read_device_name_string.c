/**
 * Name: read_device_name_string.c
 * Desc: Demonstrates how to read the device name string from a LabJack.
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
	char allocatedString[LJM_STRING_ALLOCATION_SIZE];

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);

	err = LJM_eReadNameString(handle, NAME_REGISTER, allocatedString);
	ErrorCheck(err, "LJM_eReadNameString");

	printf("\n%s : %s\n", NAME_REGISTER, allocatedString);

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
