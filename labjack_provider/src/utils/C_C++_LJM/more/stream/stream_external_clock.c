/**
 * Name: stream_external_clock.c
 * Desc: Shows how to stream with the T7 in external clock stream mode.
 * Note: Similar to stream_callback.c, which uses a callback to read from stream.
**/

#include <stdio.h>
#include <string.h>

#include <LabJackM.h>

#include "../../LJM_StreamUtilities.h"

// Set FIO0 to pulse out. See EnableFIO0PulseOut()
#define FIO0_PULSE_OUT 1

#define SCAN_RATE 1000
const int SCANS_PER_READ = SCAN_RATE / 2;

enum { NUM_CHANNELS = 4 };

// Because SYSTEM_TIMER_20HZ is a 32-bit value and stream can only collect
// 16-bit values per channel, STREAM_DATA_CAPTURE_16 is used to capture the
// final 16 bits of SYSTEM_TIMER_20HZ. See HardcodedPrintScans().
const char * POS_NAMES[] = {
	"AIN0",  "FIO_STATE",  "SYSTEM_TIMER_20HZ", "STREAM_DATA_CAPTURE_16"
};

const int NUM_LOOP_ITERATIONS = 50;

void StreamReturnAllOrNone(int handle);

/**
 * Prints a scan of the channels:
 *     "AIN0",  "FIO_STATE",  "SYSTEM_TIMER_20HZ", "STREAM_DATA_CAPTURE_16".
 * Combines SYSTEM_TIMER_20HZ and STREAM_DATA_CAPTURE_16 to create the original
 * 32-bit value of SYSTEM_TIMER_20HZ.
**/
void HardcodedPrintScans(const char ** chanNames, const double * aData,
	int numScansReceived, int numChannelsPerScan, int deviceScanBacklog,
	int LJMScanBacklog);

void HardcodedConfigureStream(int handle);

int main()
{
	int handle;

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);
	GetAndPrint(handle, "FIRMWARE_VERSION");
	printf("\n");

	if (GetDeviceType(handle) == LJM_dtT4) {
		printf("The T4 does not support externally clocked stream.\n");
		printf("Exiting now.\n");
		exit(1);
	}

	DisableStreamIfEnabled(handle);

	StreamReturnAllOrNone(handle);

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}

void HardcodedConfigureStream(int handle)
{
	const int STREAM_TRIGGER_INDEX = 0;
	const int STREAM_RESOLUTION_INDEX = 0;
	const double STREAM_SETTLING_US = 0;
	const double AIN_ALL_RANGE = 0;
	const int AIN_ALL_NEGATIVE_CH = LJM_GND;

	printf("Writing configurations:\n");

	if (STREAM_TRIGGER_INDEX == 0) {
		printf("    Ensuring triggered stream is disabled:");
	}
	printf("    Setting STREAM_TRIGGER_INDEX to %d\n", STREAM_TRIGGER_INDEX);
	WriteNameOrDie(handle, "STREAM_TRIGGER_INDEX", STREAM_TRIGGER_INDEX);

	// Configure the analog inputs' negative channel, range, settling time and
	// resolution.
	// Note: when streaming, negative channels and ranges can be configured for
	// individual analog inputs, but the stream has only one settling time and
	// resolution.
	printf("    Setting STREAM_RESOLUTION_INDEX to %d\n",
		STREAM_RESOLUTION_INDEX);
	WriteNameOrDie(handle, "STREAM_RESOLUTION_INDEX", STREAM_RESOLUTION_INDEX);

	printf("    Setting STREAM_SETTLING_US to %f\n", STREAM_SETTLING_US);
	WriteNameOrDie(handle, "STREAM_SETTLING_US", STREAM_SETTLING_US);

	printf("    Setting AIN_ALL_RANGE to %f\n", AIN_ALL_RANGE);
	WriteNameOrDie(handle, "AIN_ALL_RANGE", AIN_ALL_RANGE);

	printf("    Setting AIN_ALL_NEGATIVE_CH to ");
	if (AIN_ALL_NEGATIVE_CH == LJM_GND) {
		printf("LJM_GND");
	}
	else {
		printf("%d", AIN_ALL_NEGATIVE_CH);
	}
	printf("\n");
	WriteNameOrDie(handle, "AIN_ALL_NEGATIVE_CH", AIN_ALL_NEGATIVE_CH);
}

void StreamReturnAllOrNone(int handle)
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
	SetConfigValue(LJM_STREAM_RECEIVE_TIMEOUT_MS, 100);

	err = LJM_NamesToAddresses(NUM_CHANNELS, POS_NAMES, aScanList, NULL);
	ErrorCheck(err, "Getting positive channel addresses");

	HardcodedConfigureStream(handle);

	SetupExternalClockStream(handle);

	if (FIO0_PULSE_OUT) {
		EnableFIO0PulseOut(handle, SCAN_RATE, SCAN_RATE * NUM_LOOP_ITERATIONS + 5000);
	}

	err = LJM_eStreamStart(handle, SCANS_PER_READ, NUM_CHANNELS, aScanList,
		&scanRate);
	ErrorCheck(err, "LJM_eStreamStart");

	while (streamRead++ < NUM_LOOP_ITERATIONS) {
		VariableStreamSleep(SCANS_PER_READ, SCAN_RATE, LJMScanBacklog);

		err = LJM_eStreamRead(handle, aData, &deviceScanBacklog, &LJMScanBacklog);
		if (err == LJME_NO_SCANS_RETURNED) {
			// printf("Stream has not collected %d scans yet.\n", SCANS_PER_READ);
			printf(".");
			fflush(stdout);
		}
		else {
			ErrorCheck(err, "LJM_eStreamRead");
			printf("\n");
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

		// Combine SYSTEM_TIMER_20HZ's lower 16 bits and STREAM_DATA_CAPTURE_16, which
		// contains SYSTEM_TIMER_20HZ's upper 16 bits
		timerValue = ((unsigned short) aData[scanI * 4 + 3] << 16) +
			(unsigned short) aData[scanI * 4 + 2];
		printf("  0x%8X (%s)", timerValue, chanNames[2]);

		printf("\n");
	}
}
