/**
 * Name: stepwise_feedback.c
 * Desc: Shows how to read from a few analog inputs using LJM_AddressesToMBFB,
 *       LJM_MBFBComm, and LJM_UpdateValues.
 * Note: The "LJM_e" functions, such as LJM_eWriteName / LJM_eAddresses / etc.
 *       each fulfill the same purpose as calling LJM_AddressesToMBFB,
 *       LJM_MBFBComm, and LJM_UpdateValues together. The "LJM_e" functions are
 *       easier to use. LJM_AddressesToMBFB, LJM_MBFBComm, and LJM_UpdateValues
 *       are for manually altering Modbus feedback packets.
**/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <LabJackM.h>

#include "../../LJM_Utilities.h"

// Prints the Feedback command or response
void PrintFeedbackCommand(const unsigned char * aMBFB,
	const char * description);
void PrintFeedbackResponse(const unsigned char * aMBFB,
	const char * description);
void PrintFeedbackBytes(const unsigned char * aMBFB, const char * description,
	int commandOrResponse);

int main()
{
	int handle, err;

	// Just something that isn't positive so we know
	// errAddress has or hasn't been modified
	int errAddress = -2;

	// Set up the data
	enum { NUM_FRAMES = 2 };
	int numFrames = NUM_FRAMES;

	const char * ADDRESS_STRINGS[NUM_FRAMES] =
		{"DAC0", "AIN0"};
	const double VALUE_0 = 1.23;
	const double VALUE_1 = 0.0;

	int aAddresses[NUM_FRAMES];
	int     aTypes[NUM_FRAMES];
	int    aWrites[NUM_FRAMES] = {LJM_WRITE, LJM_READ };
	int aNumValues[NUM_FRAMES] = {1,         1        };

	enum { NUM_VALUES = 2 };
	double aValues[NUM_VALUES] = {VALUE_0,   VALUE_1  };

	int MaxBytesPerMBFB = LJM_DEFAULT_FEEDBACK_ALLOCATION_SIZE;
	unsigned char aMBFB[LJM_DEFAULT_FEEDBACK_ALLOCATION_SIZE];

	unsigned char UnitID = LJM_DEFAULT_UNIT_ID;

	// Fill out aAddresses
	err = LJM_NamesToAddresses(NUM_FRAMES, ADDRESS_STRINGS,
		aAddresses, aTypes);
	ErrorCheck(err, "LJM_NamesToAddresses");

	// Open first found LabJack
	err = LJM_Open(LJM_dtANY, LJM_ctANY, "LJM_idANY", &handle);
	ErrorCheck(err, "LJM_Open");

	PrintDeviceInfoFromHandle(handle);

	err = LJM_AddressesToMBFB(MaxBytesPerMBFB, aAddresses,
		aTypes, aWrites, aNumValues, aValues, &numFrames, aMBFB);
	ErrorCheck(err, "LJM_AddressesToMBFB");

	printf("\nLJM_MBFBComm will overwrite the Transaction ID and Unit ID of the following command\n");
	PrintFeedbackCommand(aMBFB, "Feedback command");

	// Send the command and receive the response
	err = LJM_MBFBComm(handle, UnitID, aMBFB, &errAddress);
	ErrorCheckWithAddress(err, errAddress, "LJM_MBFBComm");

	PrintFeedbackResponse(aMBFB, "Feedback response");

	// Get the data back in a readable form
	err = LJM_UpdateValues(aMBFB, aTypes, aWrites,
		aNumValues, numFrames, aValues);
	ErrorCheck(err, "LJM_UpdateValues");

	// Print results
	printf("%s: %f\n", ADDRESS_STRINGS[1], aValues[1]);

	// Close
	err = LJM_Close(handle);
	ErrorCheck(err, "LJM_Close");

	WaitForUserIfWindows();

	return LJME_NOERROR;
}

void PrintFeedbackCommand(const unsigned char * aMBFB, const char * description)
{
	PrintFeedbackBytes(aMBFB, description, COMMAND);
}

void PrintFeedbackResponse(const unsigned char * aMBFB,
	const char * description)
{
	PrintFeedbackBytes(aMBFB, description, RESPONSE);
}

void PrintFeedbackBytes(const unsigned char * aMBFB, const char * description,
	int commandOrResponse)
{
	int i, frameSize, frameOffset, frameCounter, numRemainingBytes;
	int reportedSize = (int)((int)aMBFB[4]+(int)aMBFB[5]);

	printf("%s:\n", description);
	printf("\tHeader:   ");
	for (i = 0; i<8; i++) {
		printf("0x%.2x ", aMBFB[i]);
	}
	printf("\n");
	if (reportedSize < 3) {
		printf("\t(No frames)\n");
	}
	else {
		if (commandOrResponse == COMMAND) {
			frameOffset = 8;
			frameCounter = 0;
			numRemainingBytes = reportedSize - 2;
			while (numRemainingBytes > 0) {
				if (aMBFB[frameOffset] == 1) {
					// If it's a write frame, it has data to output
					frameSize = aMBFB[frameOffset + 3] * 2 + 4;
				}
				else {
					// Else it's a read frame and is just a frame header
					frameSize = 4;
				}
				printf("\tframe %02d: ", frameCounter);
				for (i = 0; i<frameSize; i++) {
					printf("0x%.2x ", aMBFB[i+frameOffset]);
				}
				printf("\n");
				frameOffset += frameSize;
				numRemainingBytes -= frameSize;
				frameCounter++;
			}
		}
		else { // Response
			numRemainingBytes = reportedSize - 2;
			printf("\tdata:     ");
			for (i = 8; i<numRemainingBytes+8; i++) {
				printf("0x%.2x ", aMBFB[i]);
			}
			printf("\n");
		}
	}
}
