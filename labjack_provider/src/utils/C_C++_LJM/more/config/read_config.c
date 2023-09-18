/**
 * Name: read_config.c
 * Desc: Demonstrates how to read configuration settings on a LabJack.
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
	int iter;

	// Set up read operation
	int numFrames = 10;
	const int noWifiNumFrames = 8;
	const char * aNames[10] = {
		"PRODUCT_ID", "HARDWARE_VERSION", "FIRMWARE_VERSION",
		"BOOTLOADER_VERSION", "SERIAL_NUMBER", "POWER_ETHERNET_DEFAULT",
		"POWER_AIN_DEFAULT", "POWER_LED_DEFAULT",
		"WIFI_VERSION", "POWER_WIFI_DEFAULT"
	};
	double aValues[10] = {0};
	int errorAddress = INITIAL_ERR_ADDRESS;

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);

	if (!DoesDeviceHaveWiFi(handle)) {
		// If WiFi is not installed, we reduce the number of frames so that
		// WIFI_VERSION and POWER_WIFI_DEFAULT are not printed
		numFrames = noWifiNumFrames;
	}

	// Read config values
	err = LJM_eReadNames(handle, numFrames, aNames, aValues, &errorAddress);
	ErrorCheckWithAddress(err, errorAddress, "LJM_eReadNames");

	printf("\nConfiguration settings:\n");
	for (iter = 0; iter < numFrames; iter++) {
		printf("    %s : %f\n", aNames[iter], aValues[iter]);
	}

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
