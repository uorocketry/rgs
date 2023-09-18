/**
 * Name: read_wifi_mac.c
 * Desc: Demonstrates how to read the WiFi MAC from a LabJack.
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
	int handle;
	const char * MAC_NAME = "WIFI_MAC";
	const int macAddress = 60024;

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);
	printf("\n");

	if (!DoesDeviceHaveWiFi(handle)) {
		printf("This device does not have WiFi capability.\n");
		exit(1);
	}

	// See LJM_Utilities.h for more information
	GetAndPrintMACAddressFromValueAddress(handle, MAC_NAME, macAddress);

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
