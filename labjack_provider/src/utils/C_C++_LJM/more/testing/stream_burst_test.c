/**
 * Name: stream_burst_test.c
 * Desc: Tests a few pseudo-random stream burst configurations.
 * Note: Connect AIN0 to any constant voltage to check that it is streaming
 *       correctly.
**/

#include <stdio.h>
#include <string.h>

#include <LabJackM.h>

#include "../../LJM_StreamUtilities.h"

enum { NUM_DIO = 4 };
static const char * DIO_DIRECTION_NAMES[NUM_DIO] = {
	"FIO_DIRECTION",
	"EIO_DIRECTION",
	"CIO_DIRECTION",
	"MIO_DIRECTION"
};
static const char * DIO_STATE_NAMES[NUM_DIO] = {
	"FIO_STATE",
	"EIO_STATE",
	"CIO_STATE",
	"MIO_STATE"
};
static const double DIO_STATE_INITIAL_VALUES[NUM_DIO] = {
	0xFF,
	0xF0,
	0x0F,
	0x00
};

enum { NUM_CHANNELS = 5 };
static const char * CHANNELS[NUM_CHANNELS] = {
	"AIN0",
	"FIO_STATE",
	"EIO_STATE",
	"CIO_STATE",
	"MIO_STATE"
};
static const double CHANNEL_DELTAS[NUM_CHANNELS] = {
	0.01,
	0,
	0,
	0,
	0
};

typedef struct StreamTest {
	int handle;
	double scanRate;
	int scansPerRead;
	int numScans;

	const char * testName;

	int numChannels;
	const char ** channelNames;
	double * channelNormalValues;
	const double * channelDeltas;
} StreamTest;

void StreamBurst(StreamTest test);

void ConfigureDIO(int handle, const char ** dio_direction_names,
	const char ** dio_state_names, const double * dio_state_initial_values,
	int num_dio);

void ReadExpectedValues(int handle, const char ** CHANNELS,
	const double * deltas, const int NUM_CHANNELS, double * channelNormalValues);

void VerifyChannelData(StreamTest test, int readOffset, const double * aData,
	int aDataSize);

int main(int argc, char * argv[])
{
	StreamTest test;
	double CHANNEL_NORMAL_VALUES[NUM_CHANNELS];

	// Open first found LabJack
	test.handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// test.handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(test.handle);
	GetAndPrint(test.handle, "FIRMWARE_VERSION");
	printf("\n");

	DisableStreamIfEnabled(test.handle);

	printf("Writing configurations:\n");

	printf("    Ensuring triggered stream is disabled. (Setting STREAM_TRIGGER_INDEX to 0)\n");
	WriteNameOrDie(test.handle, "STREAM_TRIGGER_INDEX", 0);

	printf("    Enabling internally-clocked stream. (Setting STREAM_CLOCK_SOURCE to 0)\n");
	WriteNameOrDie(test.handle, "STREAM_CLOCK_SOURCE", 0);

	printf("\n");

	ConfigureDIO(test.handle, DIO_DIRECTION_NAMES, DIO_STATE_NAMES,
		DIO_STATE_INITIAL_VALUES, NUM_DIO);

	ReadExpectedValues(test.handle, CHANNELS, CHANNEL_DELTAS, NUM_CHANNELS,
		CHANNEL_NORMAL_VALUES);

	test.numChannels = NUM_CHANNELS;
	test.channelNames = CHANNELS;
	test.channelDeltas = CHANNEL_DELTAS;
	test.channelNormalValues = CHANNEL_NORMAL_VALUES;

	test.scanRate = 10;

	test.numScans = 2;
	test.scansPerRead = 1;
	test.testName = "2 burst scans";
	StreamBurst(test);

	test.numScans = 3;
	test.scansPerRead = 2;
	test.testName = "3 burst scans";
	StreamBurst(test);

	test.numScans = 80;
	test.scansPerRead = 40;
	test.testName = "80 burst scans";
	StreamBurst(test);

	test.numScans = 80;
	test.scansPerRead = 80;
	test.testName = "80 burst scans with 80 scansPerRead";
	StreamBurst(test);

	test.numScans = 222;
	test.scansPerRead = 111;
	test.testName = "222 burst scans";
	StreamBurst(test);

	// test.scanRate = 100;
	// test.numScans = 9999;
	// test.scansPerRead = 9999;
	// test.testName = "9999 burst scans";
	// StreamBurst(test);

	CloseOrDie(test.handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}

void StreamBurst(StreamTest test)
{
	int err, readOffset;
	int totalSkippedScans = 0;
	int deviceScanBacklog = 0;
	int LJMScanBacklog = 0;

	int * aScanList = malloc(sizeof(int) * test.numChannels);

	unsigned int aDataSize = test.numChannels * test.scansPerRead;
	double * aData = malloc(sizeof(double) * aDataSize);
	unsigned int timeStart, timeEnd;

	static const int STREAM_BURST_COMPLETE = 2944;

	printf("Test: %s\n", test.testName);

	err = LJM_NamesToAddresses(test.numChannels, test.channelNames, aScanList, NULL);
	ErrorCheck(err, "Getting positive channel addresses");

	// printf("channels:\n");
	// for (i=0; i<numChannels; i++) {
	// 	printf("    %s (%d)\n", CHANNELS[i], aScanList[i]);
	// }
	// printf("\n");

	// printf("Writing %d to STREAM_NUM_SCANS to limit the number of scans performed\n",
	// 	numScans);
	WriteNameOrDie(test.handle, "STREAM_NUM_SCANS",  test.numScans);

	// printf("Starting stream:\n");
	// printf("    scan rate: %.02f Hz (%.02f sample rate)\n",
	// 	scanRate, scanRate * numChannels);
	// printf("    scansPerRead: %d\n", scansPerRead);
	// printf("    ");GetAndPrint(handle, "STREAM_RESOLUTION_INDEX");

	err = LJM_eStreamStart(test.handle, test.scansPerRead, test.numChannels,
		aScanList, &test.scanRate);
	ErrorCheck(err, "LJM_eStreamStart");

	// printf("Stream started. Actual scanRate: %f\n", scanRate);
	// printf("\n");

	// err = LJM_eReadName(handle, "STREAM_BUFFER_SIZE_BYTES", &deviceBufferBytes);
	// ErrorCheck(err, "Reading STREAM_BUFFER_SIZE_BYTES");
	// deviceWarningScansNum = deviceBufferBytes / numChannels / 2 / 8; // 1/8th of the total scans
	// printf("STREAM_BUFFER_SIZE_BYTES: %f, deviceWarningScansNum: %d\n", deviceBufferBytes,
	// 	deviceWarningScansNum);
	// printf("LJM_WARNING_SCANS_NUM: %d\n", LJM_WARNING_SCANS_NUM);

	// // Read the scans
	// printf("Now performing reads until the device is done\n");
	timeStart = GetCurrentTimeMS();
	err = LJME_NOERROR;
	readOffset = 0;
	while (err == LJME_NOERROR) {
		memset(aData, 0, sizeof(double) * aDataSize);

		err = LJM_eStreamRead(test.handle, aData, &deviceScanBacklog,
			&LJMScanBacklog);
		if (err == STREAM_BURST_COMPLETE) {
			break;
		}
		PrintErrorIfError(err, "LJM_eStreamRead");

		totalSkippedScans += CountAndOutputNumSkippedSamples(test.numChannels,
			test.scansPerRead, aData);

		VerifyChannelData(test, readOffset, aData, aDataSize);

		++readOffset;
	}
	timeEnd = GetCurrentTimeMS();

	VerifyChannelData(test, readOffset, aData, aDataSize);

	if (totalSkippedScans) {
		printf("totalSkippedScans: %d\n", totalSkippedScans);
	}

	err = LJM_eStreamStop(test.handle);
	ErrorCheck(err, "Stopping stream");

	free(aData);
	free(aScanList);
}

void ConfigureDIO(int handle, const char ** dio_direction_names,
	const char ** dio_state_names, const double * dio_state_initial_values,
	int num_dio)
{
	int nameI = 0;
	static const int OUTPUT = 1;
	printf("Setting DIO direction...");
	fflush(stdout);
	for (nameI = 0; nameI < num_dio; nameI++) {
		WriteNameOrDie(handle, dio_direction_names[nameI], OUTPUT);
		WriteNameOrDie(handle, dio_state_names[nameI],
			dio_state_initial_values[nameI]);
	}
	printf("done\n");
}

void ReadExpectedValues(int handle, const char ** CHANNELS,
	const double * deltas, const int NUM_CHANNELS, double * channelNormalValues)
{
	int nameI = 0;
	printf("Expecting:\n");
	for (nameI = 0; nameI < NUM_CHANNELS; nameI++) {
		printf("    delta of %f  --  ", deltas[nameI]);
		channelNormalValues[nameI] = GetAndPrint(handle, CHANNELS[nameI]);
	}
}

void VerifyChannelData(StreamTest test, int readOffset, const double * aData,
	int aDataSize)
{
	int scanOffset, chanOffset, sampleOffset, pass;
	double expected, actual, delta;

	for (scanOffset = 0; scanOffset < test.scansPerRead; scanOffset++) {
		for (chanOffset = 0; chanOffset < test.numChannels; chanOffset++) {
			sampleOffset = scanOffset * test.numChannels + chanOffset;

			actual = aData[sampleOffset];
			delta = test.channelDeltas[chanOffset];

			expected = test.channelNormalValues[chanOffset];
			if (scanOffset + readOffset * test.scansPerRead >= test.numScans) {
				expected = LJM_DUMMY_VALUE;
				delta = 0;
			}

			if (delta == 0) {
				pass = (expected == actual);
			}
			else {
				pass = EqualFloats(expected, actual, delta);
			}

			if (!pass) {
				printf("%s - readOffset %d, scanOffset %d - Expected chan[%d] %f within delta %f, but was aData[%d] %f\n",
					test.testName, readOffset, scanOffset, chanOffset, expected, delta, sampleOffset, actual);
			}
		}
	}
}
