/**
 * Name: stream_burst.c
 * Desc: Shows how to stream from a device and stop after a given number of
 *       scans.
 * Note: To run using Visual Studio 2008:
 *         - right-click on the stream_burst project in the Solution Explorer
 *         - click on the Debugging tab
 *         - add the desired number of scans to the Command Arguments field
**/

#include <stdio.h>
#include <string.h>

#include <LabJackM.h>

#include "../../LJM_StreamUtilities.h"

void StreamBurst(int handle, int numChannels, const char ** channelNames,
	double scanRate, int numScans);

void HardcodedConfigureStream(int handle);

/**
 * Global values to quickly configure some of this program's behavior
**/

enum { NUM_CHANNELS = 2 };
const char * POS_NAMES[] = {"AIN0",  "FIO_STATE"};


int main(int argc, char * argv[])
{
	int handle;
	int numScans = 0;

	// How fast to stream in Hz.
	double scanRate = 2000;

	if (argc != 2) {
		printf("Usage: %s STREAM_NUM_SCANS\n", argv[0]);
		WaitForUserIfWindows();
		exit(1);
	}

	numScans = strtol(argv[1], NULL, 10);
	if (numScans <= 0) {
		printf("STREAM_NUM_SCANS must be greater than 0\n");
		printf("Usage: %s STREAM_NUM_SCANS\n", argv[0]);
		WaitForUserIfWindows();
		exit(1);
	}

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);
	GetAndPrint(handle, "FIRMWARE_VERSION");
	printf("\n");

	DisableStreamIfEnabled(handle);

	StreamBurst(handle, NUM_CHANNELS, POS_NAMES, scanRate, numScans);

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}

void HardcodedConfigureStream(int handle)
{
	const int STREAM_TRIGGER_INDEX = 0;
	const int STREAM_CLOCK_SOURCE = 0;
	const int STREAM_RESOLUTION_INDEX = 0;
	const double STREAM_SETTLING_US = 0;
	const double AIN_ALL_RANGE = 10;
	const int AIN_ALL_NEGATIVE_CH = LJM_GND;

	printf("Writing configurations:\n");

	if (STREAM_TRIGGER_INDEX == 0) {
		printf("    Ensuring triggered stream is disabled:");
	}
	printf("    Setting STREAM_TRIGGER_INDEX to %d\n", STREAM_TRIGGER_INDEX);
	WriteNameOrDie(handle, "STREAM_TRIGGER_INDEX", STREAM_TRIGGER_INDEX);

	if (STREAM_CLOCK_SOURCE == 0) {
		printf("    Enabling internally-clocked stream:");
	}
	printf("    Setting STREAM_CLOCK_SOURCE to %d\n", STREAM_CLOCK_SOURCE);
	WriteNameOrDie(handle, "STREAM_CLOCK_SOURCE", STREAM_CLOCK_SOURCE);

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

void StreamBurst(int handle, int numChannels, const char ** channelNames,
	double scanRate, int numScans)
{
	int err;

	int * aScanList = malloc(sizeof(int) * numChannels);

	unsigned int numSamples = numChannels * numScans;
	double * aBurstSamples = malloc(sizeof(double) * numSamples);

	unsigned int timeStart, timeEnd;

	memset(aBurstSamples, 0, numSamples * sizeof(double));

	err = LJM_NamesToAddresses(numChannels, POS_NAMES, aScanList, NULL);
	ErrorCheck(err, "Getting positive channel addresses");

	HardcodedConfigureStream(handle);

	printf("\n");

	printf("Starting stream:\n");
	printf("    scan rate: %.02f Hz (%.02f sample rate)\n",
		scanRate, scanRate * numChannels);
	printf("    number of scans  : %u\n", numScans);
	printf("    number of samples: %u\n", numScans * numChannels);

	timeStart = GetCurrentTimeMS();
	err = LJM_StreamBurst(handle, numChannels, aScanList, &scanRate, numScans,
		aBurstSamples);
	timeEnd = GetCurrentTimeMS();
	ErrorCheck(err, "LJM_eStreamBurst");

	printf("\n");
	printf("Stream burst complete:\n");
	printf("    Actual scanRate was: %f\n", scanRate);
	printf("    %d scans over approximately %d milliseconds\n",
		numScans, timeEnd - timeStart);
	printf("\n");

	PrintScans(numScans, NUM_CHANNELS, POS_NAMES, aScanList, 0, 0, 0,
		aBurstSamples);

	CountAndOutputNumSkippedSamples(NUM_CHANNELS, numScans, aBurstSamples);

	free(aBurstSamples);
	free(aScanList);
}
