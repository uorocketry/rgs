/**
 * Name: read_ethernet_mac.c
 * Desc: Demonstrates how to read the Ethernet MAC from a LabJack.
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
	const char * MAC_NAME = "ETHERNET_MAC";
	const int MAC_ADDRESS = 60020;

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);
	printf("\n");

	// See LJM_Utilities.h for more information
	GetAndPrintMACAddressFromValueAddress(handle, MAC_NAME, MAC_ADDRESS);

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
