/**
 * Name: set_timeout.c
 * Desc: Shows how to set the timeout for command and response
**/

#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <LabJackM.h>

#include "../../LJM_Utilities.h"

void TestTimeout(int handle, const char * shortTimeoutDescription);

int main()
{
	int err, handle;

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);
	printf("\n");

	// Set stdout to immediately print everything
	setbuf(stdout, NULL);

	// Send the command and receive the response with different timeout lengths
	TestTimeout(handle, "Default");

	err = LJM_WriteLibraryConfigS(LJM_SEND_RECEIVE_TIMEOUT_MS, 1);
	ErrorCheck(err, "Setting send/receive timeout to 1 ms");
	TestTimeout(handle, "1ms");

	err = LJM_WriteLibraryConfigS(LJM_SEND_RECEIVE_TIMEOUT_MS, 0);
	ErrorCheck(err, "Setting send/receive timeout to no timeout");
	TestTimeout(handle, "Never-timeout");

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}

void TestTimeout(int handle, const char * shortTimeoutDescription)
{
	int err;
	int errAddress = INITIAL_ERR_ADDRESS;

	// Set up the data
	// Write 1.23 to DAC0 and read from AIN0
	const char * aNames[] = {"DAC0",    "AIN0"  };
	int         aWrites[] = {LJM_WRITE, LJM_READ};
	int      aNumValues[] = {1,         1       };
	double      aValues[] = {1.23,      0.0     };
	const int NUM_FRAMES = 2;

	printf("LJM_eNames with %s timeout... ", shortTimeoutDescription);

	// Execute the command
	err = LJM_eNames(handle, NUM_FRAMES, aNames, aWrites, aNumValues,
		aValues, &errAddress);

	// Check if it timed out or not
	if (err == LJME_NO_COMMAND_BYTES_SENT)
		printf("The error LJME_NO_COMMAND_BYTES_SENT occurred, which indicates that the command timed out.\n");
	else if (err == LJME_NO_RESPONSE_BYTES_RECEIVED)
		printf("The error LJME_NO_RESPONSE_BYTES_RECEIVED occurred, which indicates that the response timed out.\n");
	else if (err == LJME_INCORRECT_NUM_RESPONSE_BYTES_RECEIVED)
		printf("The error LJME_INCORRECT_NUM_RESPONSE_BYTES_RECEIVED occurred, which indicates that the response timed out.\n");
	else if (err != LJME_NOERROR) {
		printf("An error occurred that wasn't a timeout error: ");
		ErrorCheckWithAddress(err, errAddress, "LJM_eNames");
	}
	else {
		printf("success! No timeout.\n");
		printf("  AIN 0: %f\n", aValues[1]);
	}

	printf("\n");
}
