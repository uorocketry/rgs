/**
 * Name: read_wifi_rssi.c
 * Desc: Demonstrates how to read the WiFI RSSI from a LabJack.
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

	// Set up for reading RSSI value
	double Value = 0;
	const char * Name = "WIFI_RSSI";

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);

	if (!DoesDeviceHaveWiFi(handle)) {
		printf("This device does not have WiFi capability.\n");
		exit(1);
	}

	err = LJM_eReadName(handle, Name, &Value);
	ErrorCheck(err, "LJM_eReadName");

	printf("\n%s: %f\n", Name, Value);

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
