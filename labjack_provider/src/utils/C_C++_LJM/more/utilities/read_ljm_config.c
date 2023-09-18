/**
 * Name: read_ljm_config.c
 * Desc: Demonstrates LJM_ReadLibraryConfigS and LJM_ReadLibraryConfigStringS
**/

#include <stdio.h>

#include <LabJackM.h>

#include "../../LJM_Utilities.h"

/**
 * Desc: Prints a LJM configuration string and it's current numerical value.
 *       Exits the program upon error.
**/
void PrintConfiguration(const char * ljmConfigName);

/**
 * Desc: Prints a LJM configuration string and it's current string value.
 *       Exits the program upon error.
**/
void PrintConfigurationString(const char * ljmConfigName);

int main()
{
	PrintConfiguration(LJM_LIBRARY_VERSION);

	printf("\nConstants file locations:\n");
	PrintConfigurationString(LJM_ERROR_CONSTANTS_FILE);
	PrintConfigurationString(LJM_MODBUS_MAP_CONSTANTS_FILE);

	printf("\nStreaming:\n");
	PrintConfiguration(LJM_STREAM_TRANSFERS_PER_SECOND);

	printf("\nMisc:\n");
	PrintConfiguration(LJM_ALLOWS_AUTO_CONDENSE_ADDRESSES);
	PrintConfiguration(LJM_ALLOWS_AUTO_MULTIPLE_FEEDBACKS);
	PrintConfiguration(LJM_AUTO_RECONNECT_STICKY_CONNECTION);
	PrintConfiguration(LJM_AUTO_RECONNECT_STICKY_SERIAL);
	PrintConfiguration(LJM_ETHERNET_OPEN_TIMEOUT_MS);
	PrintConfiguration(LJM_ETHERNET_SEND_RECEIVE_TIMEOUT_MS);
	PrintConfiguration(LJM_OLD_FIRMWARE_CHECK);
	PrintConfiguration(LJM_RETRY_ON_TRANSACTION_ID_MISMATCH);
	PrintConfiguration(LJM_USB_SEND_RECEIVE_TIMEOUT_MS);
	PrintConfiguration(LJM_WIFI_OPEN_TIMEOUT_MS);
	PrintConfiguration(LJM_WIFI_SEND_RECEIVE_TIMEOUT_MS);

	printf("\nDebug logging:\n");
	PrintConfigurationString(LJM_DEBUG_LOG_FILE);
	PrintConfiguration(LJM_DEBUG_LOG_MODE);
	PrintConfiguration(LJM_DEBUG_LOG_LEVEL);
	PrintConfiguration(LJM_DEBUG_LOG_FILE_MAX_SIZE);
	PrintConfiguration(LJM_DEBUG_LOG_BUFFER_MAX_SIZE);
	PrintConfiguration(LJM_DEBUG_LOG_SLEEP_TIME_MS);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}

void PrintConfiguration(const char * ljmConfigName)
{
	double value;
	int err;

	err = LJM_ReadLibraryConfigS(ljmConfigName, &value);
	PrintErrorIfError(err, "LJM_ReadLibraryConfigStringS: %s", ljmConfigName);

	if (!err)
		printf("%s: %f\n", ljmConfigName, value);
}

void PrintConfigurationString(const char * ljmConfigName)
{
	char string[LJM_MAX_NAME_SIZE];
	int err;

	err = LJM_ReadLibraryConfigStringS(ljmConfigName, string);
	PrintErrorIfError(err, "LJM_ReadLibraryConfigStringS: %s", ljmConfigName);

	if (!err)
		printf("%s: %s\n", ljmConfigName, string);
}
