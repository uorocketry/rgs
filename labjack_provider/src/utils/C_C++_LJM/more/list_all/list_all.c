/**
 * Name: list_all.c
 * Desc: Shows how to use LJM_ListAll
**/

#ifdef _WIN32
	#include <winsock2.h>
	#include <ws2tcpip.h>
#else
	#include <arpa/inet.h>  // For inet_ntoa()
#endif
#include <stdio.h>

#include <LabJackM.h>

#include "../../LJM_Utilities.h"

int main()
{
	int err;
	int i;
	int DeviceType = LJM_dtANY;
	int ConnectionType = LJM_ctANY;

	int aDeviceTypes[LJM_LIST_ALL_SIZE];
	int aConnectionTypes[LJM_LIST_ALL_SIZE];
	int aSerialNumbers[LJM_LIST_ALL_SIZE];
	int aIPAddresses[LJM_LIST_ALL_SIZE];
	int NumFound = 0;

	char IPv4String[LJM_IPv4_STRING_SIZE];

	printf("Calling LJM_ListAll with device type: %s, connection type: %s\n",
		NumberToDeviceType(DeviceType), NumberToConnectionType(ConnectionType));
	err = LJM_ListAll(DeviceType, ConnectionType, &NumFound, aDeviceTypes, aConnectionTypes,
		aSerialNumbers, aIPAddresses);
	ErrorCheck(err, "LJM_ListAll with device type: %s, connection type: %s",
		NumberToDeviceType(DeviceType), NumberToConnectionType(ConnectionType));

	printf("Found %d device connections\n", NumFound);
	for (i=0; i<NumFound; i++) {
		err = LJM_NumberToIP(aIPAddresses[i], IPv4String);
		ErrorCheck(err, "LJM_NumberToIP");
		printf("    [%3d] - aDeviceTypes: %s, aConnectionTypes: %s\n",
			i, NumberToDeviceType(aDeviceTypes[i]), NumberToConnectionType(aConnectionTypes[i]));
		printf("           aSerialNumbers: %d, aIPAddresses: %s (%u)\n",
			aSerialNumbers[i], IPv4String, aIPAddresses[i]);
	}

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
