/**
 * Name: write_wifi_config.c
 * Desc: Demonstrates how to configure the WiFi settings on a LabJack.
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
	int errorAddress = INITIAL_ERR_ADDRESS;

	// Setup to configure the default WiFi SSID on the LabJack.
	const char * SSID_REGISTER = "WIFI_SSID_DEFAULT";
	const char * NEW_SSID = "MyNetworkName";

	// Setup to configure the default WiFi password on the LabJack.
	const char * PASSWORD_REGISTER = "WIFI_PASSWORD_DEFAULT";
	const char * NEW_PASSWORD = "MyPassword1234";

	// Setup apply the new WiFi configuration on the LabJack.
	const char * APPLY_REGISTER = "WIFI_APPLY_SETTINGS";
	const double APPLY_VALUE = 1;

	// Set up operation to set the Wifi configuration
	enum { NUM_FRAMES = 4 };
	const char * aNames[NUM_FRAMES] = {"WIFI_IP_DEFAULT", "WIFI_SUBNET_DEFAULT",
		"WIFI_GATEWAY_DEFAULT", "WIFI_DHCP_ENABLE_DEFAULT"};
	double aValues[NUM_FRAMES] = {0};
	const char * wifiIP = "192.168.1.207";
	const char * wifiSubnet = "255.255.255.0";
	const char * wifiGateway = "192.168.1.1";

	aValues[0] = (double)IPToNumber(wifiIP); // WIFI_IP_DEFAULT
	aValues[1] = (double)IPToNumber(wifiSubnet); // WIFI_SUBNET_DEFAULT
	aValues[2] = (double)IPToNumber(wifiGateway); // WIFI_GATEWAY_DEFAULT
	aValues[3] = 1; // WIFI_DHCP_ENABLE_DEFAULT

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);

	if (!DoesDeviceHaveWiFi(handle)) {
		printf("This device does not have WiFi capability.\n");
		exit(1);
	}

	// Write Wifi config values to the LabJack
	err = LJM_eWriteNames(handle, NUM_FRAMES, aNames, aValues, &errorAddress);
	ErrorCheckWithAddress(err, errorAddress, "LJM_eReadNames");

	err = LJM_eWriteNameString(handle, SSID_REGISTER, NEW_SSID);
	ErrorCheck(err, "LJM_eWriteNameString - %s", SSID_REGISTER);

	err = LJM_eWriteNameString(handle, PASSWORD_REGISTER, NEW_PASSWORD);
	ErrorCheck(err, "LJM_eWriteNameString - %s", PASSWORD_REGISTER);

	err = LJM_eWriteName(handle, APPLY_REGISTER, APPLY_VALUE);
	ErrorCheck(err, "LJM_eWrite - %s", APPLY_REGISTER);

	printf("\nSet Wifi configurations:\n");
	printf("    %s : %s\n", aNames[0], wifiIP);
	printf("    %s : %s\n", aNames[1], wifiSubnet);
	printf("    %s : %s\n", aNames[2], wifiGateway);
	printf("    %s : %.0f\n", aNames[3], aValues[3]);

	printf("    %s : %s\n", SSID_REGISTER, NEW_SSID);
	printf("    %s : %s\n", PASSWORD_REGISTER, NEW_PASSWORD);
	printf("    %s : %.0f\n", APPLY_REGISTER, APPLY_VALUE);

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
