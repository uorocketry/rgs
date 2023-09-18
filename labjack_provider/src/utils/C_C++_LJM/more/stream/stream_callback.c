/**
 * Name: stream_callback.c
 * Desc: Shows how to stream using a callback to read stream, which is useful
 *       for streaming in external clock stream mode.
**/

#include <stdio.h>
#include <string.h>

#include <LabJackM.h>

#include "../../LJM_StreamUtilities.h"

#define FALSE 0
#define TRUE 1

// Set to non-zero for external stream clock
#define EXTERNAL_STREAM_CLOCK FALSE

// Set FIO0 to pulse out. See EnableFIO0PulseOut()
#define FIO0_PULSE_OUT FALSE

typedef struct StreamInfo {
	int handle;
	double scanRate;
	int scansPerRead;

	int streamLengthMS;
	int done;

	LJM_StreamReadCallback callback;

	int numChannels;
	int * aScanList;
	const char ** channelNames;

	int aDataSize;
	double * aData;

	unsigned int numScansToPrint;
} StreamInfo;

/**
 * The stream callback that LJM will call when stream data is ready.
 * Para: arg - a pointer to the given StreamInfo for stream
**/
void MyStreamReadCallback(void * arg);

/**
 * Sets up stream using MyStreamReadCallback as the stream callback that LJM
 * will call when stream data is ready.
 * Para: si - a pointer to the given StreamInfo for stream
**/
void StreamWithCallback(StreamInfo * si);

/**
 * Prints scans of the channels:
 *     "AIN0",  "FIO_STATE",  "SYSTEM_TIMER_20HZ", "STREAM_DATA_CAPTURE_16".
 * Combines SYSTEM_TIMER_20HZ and STREAM_DATA_CAPTURE_16 to create the original
 * 32-bit value of SYSTEM_TIMER_20HZ.
**/
void HardcodedPrintScans(StreamInfo * si, int deviceScanBacklog,
	int LJMScanBacklog);

int main()
{
	// Because SYSTEM_TIMER_20HZ is a 32-bit value and stream can only collect
	// 16-bit values per channel, STREAM_DATA_CAPTURE_16 is used to capture the
	// final 16 bits of SYSTEM_TIMER_20HZ. See HardcodedPrintScans().
	const char * CHANNEL_NAMES[] = \
		{"AIN0",  "FIO_STATE",  "SYSTEM_TIMER_20HZ", "STREAM_DATA_CAPTURE_16"};

	StreamInfo si;
	si.scanRate = 2000; // Set the scan rate to the fastest rate expected
	si.numChannels = 4;
	si.channelNames = CHANNEL_NAMES;
	si.scansPerRead = si.scanRate / 2;

	si.streamLengthMS = 10000;
	si.done = FALSE;

	si.callback = &MyStreamReadCallback;
	si.aData = NULL;
	si.aScanList = NULL;

	si.numScansToPrint = 1;

	// Open first found LabJack
	si.handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(si.handle);
	printf("\n");

	DisableStreamIfEnabled(si.handle);
	StreamWithCallback(&si);

	CloseOrDie(si.handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}

void StreamWithCallback(StreamInfo * si)
{
	int err;
	unsigned int t0, t1;

	const int STREAM_TRIGGER_INDEX = 0;
	const int STREAM_CLOCK_SOURCE = 0;
	const int STREAM_RESOLUTION_INDEX = 0;
	const double STREAM_SETTLING_US = 0;
	const double AIN_ALL_RANGE = 0;
	const int AIN_ALL_NEGATIVE_CH = LJM_GND;

	printf("Writing configurations:\n");

	if (STREAM_TRIGGER_INDEX == 0) {
		printf("    Ensuring triggered stream is disabled:");
	}
	printf("    Setting STREAM_TRIGGER_INDEX to %d\n", STREAM_TRIGGER_INDEX);
	WriteNameOrDie(si->handle, "STREAM_TRIGGER_INDEX", STREAM_TRIGGER_INDEX);

	if (!EXTERNAL_STREAM_CLOCK) {
		printf("    Enabling internally-clocked stream:");
		printf("    Setting STREAM_CLOCK_SOURCE to %d\n", STREAM_CLOCK_SOURCE);
		WriteNameOrDie(si->handle, "STREAM_CLOCK_SOURCE", STREAM_CLOCK_SOURCE);
	}

	// Configure the analog inputs' negative channel, range, settling time and
	// resolution.
	// Note: when streaming, negative channels and ranges can be configured for
	// individual analog inputs, but the stream has only one settling time and
	// resolution.
	printf("    Setting STREAM_RESOLUTION_INDEX to %d\n",
		STREAM_RESOLUTION_INDEX);
	WriteNameOrDie(si->handle, "STREAM_RESOLUTION_INDEX", STREAM_RESOLUTION_INDEX);

	printf("    Setting STREAM_SETTLING_US to %f\n", STREAM_SETTLING_US);
	WriteNameOrDie(si->handle, "STREAM_SETTLING_US", STREAM_SETTLING_US);

	printf("    Setting AIN_ALL_RANGE to %f\n", AIN_ALL_RANGE);
	WriteNameOrDie(si->handle, "AIN_ALL_RANGE", AIN_ALL_RANGE);

	printf("    Setting AIN_ALL_NEGATIVE_CH to ");
	if (AIN_ALL_NEGATIVE_CH == LJM_GND) {
		printf("LJM_GND");
	}
	else {
		printf("%d", AIN_ALL_NEGATIVE_CH);
	}
	printf("\n\n");
	WriteNameOrDie(si->handle, "AIN_ALL_NEGATIVE_CH", AIN_ALL_NEGATIVE_CH);

	// Variables for LJM_eStreamStart
	si->aScanList = malloc(sizeof(int) * si->numChannels);
	si->aDataSize = si->numChannels * si->scansPerRead;
	si->aData = malloc(sizeof(double) * si->aDataSize);
	memset(si->aData, 0, sizeof(double) * si->aDataSize);

	err = LJM_NamesToAddresses(si->numChannels, si->channelNames, si->aScanList, NULL);
	ErrorCheck(err, "Getting positive channel addresses");

	if (EXTERNAL_STREAM_CLOCK) {
		SetupExternalClockStream(si->handle);
	}

	// If you do not have a signal generator of some sort, you can connect a
	// wire from FIO0 to CIO3 and call EnableFIO0PulseOut to verify
	// that your program is working.
	if (FIO0_PULSE_OUT) {
		EnableFIO0PulseOut(si->handle, si->scanRate,
			si->scanRate * si->streamLengthMS / 1000 + 5000);
	}

	t0 = GetCurrentTimeMS();
	err = LJM_eStreamStart(si->handle, si->scansPerRead, si->numChannels, si->aScanList,
		&(si->scanRate));
	ErrorCheck(err, "LJM_eStreamStart");

	err = LJM_SetStreamCallback(si->handle, si->callback, si);
	ErrorCheck(err, "LJM_SetStreamCallback");

	printf("Stream running, callback set, sleeping for %d milliseconds\n", si->streamLengthMS);
	MillisecondSleep(si->streamLengthMS);

	printf("Stopping stream...\n");
	si->done = TRUE;
	err = LJM_eStreamStop(si->handle);
	t1 = GetCurrentTimeMS();
	ErrorCheck(err, "LJM_eStreamStop");

	printf("Stream stopped. %u milliseconds have elapsed since LJM_eStreamStart\n", t1 - t0);

	free(si->aScanList);
	free(si->aData);
}

void MyStreamReadCallback(void * arg)
{
	StreamInfo * si = arg;
	static int streamRead = 0;
	int deviceScanBacklog = 0;
	int LJMScanBacklog = 0;
	int err;

	// Check if stream is done so that we don't output the printf below
	if (si->done) {
		return;
	}
	printf("\niteration: % 3d    ", streamRead++);

	err = LJM_eStreamRead(si->handle, si->aData, &deviceScanBacklog, &LJMScanBacklog);
	HardcodedPrintScans(si, deviceScanBacklog, LJMScanBacklog);
	CountAndOutputNumSkippedSamples(si->numChannels,
		si->scansPerRead, si->aData);

	// If LJM has called this callback, the data is valid, but LJM_eStreamRead
	// may return LJME_STREAM_NOT_RUNNING if another thread has stopped stream,
	// such as this example program does in StreamWithCallback().
	if (err != LJME_NOERROR && err != LJME_STREAM_NOT_RUNNING) {
		PrintErrorIfError(err, "LJM_eStreamRead");

		err = LJM_eStreamStop(si->handle);
		PrintErrorIfError(err, "LJM_eStreamStop");
	}
}

void HardcodedPrintScans(StreamInfo * si, int deviceScanBacklog,
	int LJMScanBacklog)
{
	int dataI, scanI;
	unsigned int timerValue;

	const char ** chanNames = si->channelNames;
	const double * aData = si->aData;
	int numScansReceived = si->scansPerRead;
	int numChannelsPerScan = si->numChannels;
	int numScansToPrint = si->numScansToPrint;

	if (numChannelsPerScan < 4 || numChannelsPerScan > 4) {
		printf("%s:%d - HardcodedPrintScans() - unexpected numChannelsPerScan: %d\n",
			__FILE__, __LINE__, numChannelsPerScan);
		return;
	}

	printf("devBacklog: % 4d - LJMBacklog: % 4d  - %d of %d scans: \n",
		deviceScanBacklog, LJMScanBacklog, numScansToPrint, numScansReceived);
	for (scanI = 0; scanI < numScansToPrint; scanI++) {
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