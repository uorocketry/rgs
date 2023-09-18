/**
 * Name: externally_clocked_stream_test.c
 * Desc: Tests streaming the T7 in external clock stream mode.
 * Reqr: Connect a wire from FIO0 to CIO3
 * Note: Known issue - As of Feb. 2015, libusb 1.0.9 and libusb 1.0.19
 *       stall indefinitely in libusb_bulk_transfer on Mac OS X 10.5.8.
**/

#include <stdio.h>
#include <string.h>

#include <LabJackM.h>

#include "../../LJM_StreamUtilities.h"

#define SCAN_RATE 100
const int SCANS_PER_READ = SCAN_RATE / 2;

enum { NUM_CHANNELS = 4 };
const char * POS_NAMES[] = {"AIN0",  "FIO_STATE",  "SYSTEM_TIMER_20HZ", "STREAM_DATA_CAPTURE_16"};

const int NUM_LOOP_ITERATIONS = 10;

/**
 * Desc: Tests that externally clocked stream can shut down after
 *       CIO3 pulses have stopped.
**/
void TestStoppedSignal(int handle);

/**
 * Prints a scan of the channels:
 *     "AIN0",  "FIO_STATE",  "SYSTEM_TIMER_20HZ", "STREAM_DATA_CAPTURE_16".
 * Combines SYSTEM_TIMER_20HZ and STREAM_DATA_CAPTURE_16 to create the original
 * 32-bit value of SYSTEM_TIMER_20HZ.
**/
void HardcodedPrintScans(const char ** chanNames, const double * aData,
	int numScansReceived, int numChannelsPerScan, int deviceScanBacklog,
	int LJMScanBacklog);

int main()
{
	int handle;

	handle = OpenOrDie(LJM_dtANY, LJM_ctUSB, "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);
	GetAndPrint(handle, "FIRMWARE_VERSION");
	printf("\n");

	DisableStreamIfEnabled(handle);

	TestStoppedSignal(handle);

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}

void TestStoppedSignal(int handle)
{
	int err;

	// Variables for LJM_eStreamStart
	double scanRate = SCAN_RATE;
	int * aScanList = malloc(sizeof(int) * NUM_CHANNELS);

	// Variables for LJM_eStreamRead
	unsigned int aDataSize = NUM_CHANNELS * SCANS_PER_READ;
	double * aData = malloc(sizeof(double) * aDataSize);
	int deviceScanBacklog = 0;
	int LJMScanBacklog = 0;
	int streamRead = 0;

	// Configure LJM for unpredictable stream timing
	SetConfigValue(LJM_STREAM_SCANS_RETURN, LJM_STREAM_SCANS_RETURN_ALL_OR_NONE);
	SetConfigValue(LJM_STREAM_RECEIVE_TIMEOUT_MODE, LJM_STREAM_RECEIVE_TIMEOUT_MODE_MANUAL);
	SetConfigValue(LJM_STREAM_RECEIVE_TIMEOUT_MS, 1);

	// This makes it so that multiple packets are in the same iteration.
	// This is a trivial LJM implementation detail - it tests LJM's boundaries.
	SetConfigValue(LJM_STREAM_TRANSFERS_PER_SECOND, 1);

	err = LJM_NamesToAddresses(NUM_CHANNELS, POS_NAMES, aScanList, NULL);
	ErrorCheck(err, "Getting positive channel addresses");

	SetupExternalClockStream(handle);

	err = LJM_eStreamStart(handle, SCANS_PER_READ, NUM_CHANNELS, aScanList,
		&scanRate);
	ErrorCheck(err, "LJM_eStreamStart");

	EnableFIO0PulseOut(handle, SCAN_RATE, SCAN_RATE * (NUM_LOOP_ITERATIONS / 4.0));

	while (streamRead++ < NUM_LOOP_ITERATIONS) {
		VariableStreamSleep(SCANS_PER_READ, SCAN_RATE, LJMScanBacklog);

		err = LJM_eStreamRead(handle, aData, &deviceScanBacklog, &LJMScanBacklog);
		if (err == LJME_NO_SCANS_RETURNED) {
			printf(".");
			fflush(stdout);
		}
		else {
			ErrorCheck(err, "LJM_eStreamRead");
			HardcodedPrintScans(POS_NAMES, aData, SCANS_PER_READ, NUM_CHANNELS,
				deviceScanBacklog, LJMScanBacklog);
		}
	}

	err = LJM_eStreamStop(handle);
	ErrorCheck(err, "Stopping stream");

	free(aData);
	free(aScanList);

	printf("\nDone with %d iterations\n", NUM_LOOP_ITERATIONS);
}

void HardcodedPrintScans(const char ** chanNames, const double * aData,
	int numScansReceived, int numChannelsPerScan, int deviceScanBacklog,
	int LJMScanBacklog)
{
	int dataI, scanI;
	unsigned int timerValue;
	const int NUM_SCANS_TO_PRINT = 1;

	if (numChannelsPerScan < 4 || numChannelsPerScan > 4) {
		printf("%s:%d - HardcodedPrintScans() - unexpected numChannelsPerScan: %d\n",
			__FILE__, __LINE__, numChannelsPerScan);
		return;
	}

	printf("devBacklog: % 4d - LJMBacklog: % 4d  - %d of %d scans: \n",
		deviceScanBacklog, LJMScanBacklog, NUM_SCANS_TO_PRINT, numScansReceived);
	for (scanI = 0; scanI < NUM_SCANS_TO_PRINT; scanI++) {
		for (dataI = 0; dataI < 2; dataI++) {
			printf(" % 4.03f (%s),", aData[scanI * 4 + dataI], chanNames[dataI]);
		}

		if (strcmp(chanNames[2], "SYSTEM_TIMER_20HZ") != 0
			|| strcmp(chanNames[3], "STREAM_DATA_CAPTURE_16") != 0)
		{
			printf("%s:%d - HardcodedPrintScans() - unexpected register: %s and/or %s\n",
				__FILE__, __LINE__, chanNames[2], chanNames[3]);
			return;
		}

		// Combine CORE_TIMER's lower byte and STREAM_DATA_CAPTURE_16, which
		// contains CORE_TIMER's upper byte
		timerValue = ((unsigned short) aData[scanI * 4 + 3] << 16) +
			(unsigned short) aData[scanI * 4 + 2];
		printf("  0x%8X (%s)", timerValue, chanNames[2]);

		printf("\n");
	}
}
