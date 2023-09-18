/**
 * Name: write_ethernet_config.c
 * Desc: Demonstrates how to set ethernet configuration settings on a LabJack.
**/

// For printf
#include <stdio.h>

// For the LabJackM Library
#include <LabJackM.h>

// For LabJackM helper functions, such as OpenOrDie, PrintDeviceInfoFromHandle,
// ErrorCheck, etc.
#include "../../LJM_Utilities.h"

void WriteEthernetConfig(int handle);

int main()
{
	int handle;

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);

	WriteEthernetConfig(handle);

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}

void WriteEthernetConfig(int handle)
{
	int err;
	int errorAddress = INITIAL_ERR_ADDRESS;

	// Set up operation to set the Ethernet configuration
	enum { NUM_FRAMES = 4 };
	const char * aNames[NUM_FRAMES] = {"ETHERNET_IP_DEFAULT", "ETHERNET_SUBNET_DEFAULT",
		"ETHERNET_GATEWAY_DEFAULT", "ETHERNET_DHCP_ENABLE_DEFAULT"};
	double aValues[NUM_FRAMES] = {0};
	const char * ethernetIP = "192.168.1.207";
	const char * ethernetSubnet = "255.255.255.0";
	const char * ethernetGateway = "192.168.1.1";

	aValues[0] = (double)IPToNumber(ethernetIP); // ETHERNET_IP_DEFAULT
	aValues[1] = (double)IPToNumber(ethernetSubnet); // ETHERNET_SUBNET_DEFAULT
	aValues[2] = (double)IPToNumber(ethernetGateway); // ETHERNET_GATEWAY_DEFAULT
	aValues[3] = 1; // ETHERNET_DHCP_ENABLE_DEFAULT

	// Write Ethernet config values to the LabJack
	err = LJM_eWriteNames(handle, NUM_FRAMES, aNames, aValues, &errorAddress);
	ErrorCheckWithAddress(err, errorAddress, "LJM_eReadNames");

	printf("\nSet Ethernet configurations:\n");

	printf("    %s : %s\n", aNames[0], ethernetIP);
	printf("    %s : %s\n", aNames[1], ethernetSubnet);
	printf("    %s : %s\n", aNames[2], ethernetGateway);
	printf("    %s : %f\n", aNames[3], aValues[3]);
}
