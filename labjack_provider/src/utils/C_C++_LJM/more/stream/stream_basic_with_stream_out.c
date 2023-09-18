/**
 * Name: stream_basic_with_stream_out.c
 * Desc: Sets up stream-in and stream-out together, then reads stream-in values
 *       while updating stream-out with loop data.
 * Note: You can connect a wire from AIN0 to DAC0 and from AIN1 to DAC1 to see
 *       the effect of stream-out on stream-in.
 * Note: General stream out documentation:
 *       https://labjack.com/support/datasheets/t-series/communication/stream-mode/stream-out
 * Note: Description of stream out, with diagrams:
 *       https://labjack.com/support/datasheets/t-series/communication/stream-mode/stream-out/stream-out-description
**/

#include <stdio.h>
#include <string.h>

#include <LabJackM.h>

#include "../../LJM_StreamUtilities.h"

/**
 * Desc: Structure to encapsulate a single stream out channel.
 *       targetName, the stream out target (e.g. "DAC0")
 *       targetLoopSize, the number of target loop values
 *       targetBufferValues, an array of stream out values. Must be of size
 *           targetLoopSize or greater
**/
typedef struct StreamOutChannel {
	const char * targetName;
	const int targetLoopSize;
	double * targetBufferValues;
	int targetType;
} StreamOutChannel;

/**
 * Desc: Structure to encapsulate multiple stream out channels.
 *       numTargets, the number of stream out targets
**/
typedef struct StreamOutInfo {
	const int numTargets;
	StreamOutChannel * streamOutChannels;
} StreamOutInfo;

/**
 * Desc: Configures stream. Edit the function definition to change stream
 *       configuration.
**/
void HardcodedConfigureStream(int handle);

/**
 * Desc: Initializes / fills an array with stream channel addresses.
 * Para: numInChannels, the number of stream-in channels
 *       channelInNames, the stream-in channel names
 *       numOutChannels, the number of stream-out channels
 *       aScanList, the output list of stream channel addresses. aScanList is a
 *           pointer to an array of addresses
**/
void InitializeAllocatedScanList(const int numInChannels,
	const char ** channelInNames, const int numOutChannels, int ** aScanList);

/**
 * Desc: Sets up stream out and streams in data while continuously updating
 *       stream out.
**/
void StreamOutAndIn(int handle, int numInChannels, const char ** channelInNames,
	StreamOutInfo streamOutInfo, double scanRate, int scansPerRead,
	int numSeconds);

/**
 * Desc: Configures the device to do one or more stream out channels.
**/
void SetUpStreamOut(int handle, StreamOutInfo streamOutInfo);

/**
 * Desc: Set up a single stream out channel.
**/
void SetUpStreamOutTarget(int handle, int soOffset, StreamOutChannel soChannel);

/**
 * Desc: Updates all stream channels, multiplying all stream out values by a
 *       scalar.
**/
void UpdateStreamOutChannels(int handle, StreamOutInfo streamOutInfo,
double scalar);

/**
 * Desc: Updates a single stream out channel, multiplying all stream out
 *       values by a scalar.
**/
void UpdateStreamOutChannel(int handle, int soOffset,
	StreamOutChannel streamOut, double scalar);


int main()
{
	int handle;

	// How fast to stream in Hz
	double INIT_SCAN_RATE = 8;

	// How many scans to get per call to LJM_eStreamRead. INIT_SCAN_RATE/2 is
	// recommended
	int SCANS_PER_READ = (int)(INIT_SCAN_RATE / 2);

	// How many times to call LJM_eStreamRead before calling LJM_eStreamStop
	const int NUM_READS = 10;

	// Channels/Addresses to stream in.
	enum { NUM_IN_CHANNELS = 2 };
	const char * CHANNEL_IN_NAMES[] = {"AIN0", "AIN1"};
	enum { NUM_OUT_CHANNELS = 2 };

	// Set up the values for stream out.
	// The number of values written to a stream out buffer can be larger than
	// the loop size for that stream out buffer; here the number of values and
	// the loop size are equal for simplicity.
	enum { STREAM_OUT0_LOOP_SIZE = 2 };
	enum { STREAM_OUT1_LOOP_SIZE = 4 };
	double STREAM_OUT0_BUFFER_VALUES [STREAM_OUT0_LOOP_SIZE] = {
		0.1, 1.0,
	};
	double STREAM_OUT1_BUFFER_VALUES [STREAM_OUT1_LOOP_SIZE] = {
		0.1, 1.0,
		2.0, 3.0
	};

	StreamOutChannel STREAM_OUT_CHANNELS[NUM_OUT_CHANNELS] = {
		{
			"DAC0",
			STREAM_OUT0_LOOP_SIZE,
			STREAM_OUT0_BUFFER_VALUES,
			LJM_FLOAT32,
		},
		{
			"DAC1",
			STREAM_OUT1_LOOP_SIZE,
			STREAM_OUT1_BUFFER_VALUES,
			LJM_FLOAT32,
		}
	};
	StreamOutInfo streamOutInfo = {
		NUM_OUT_CHANNELS,
		STREAM_OUT_CHANNELS
	};

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);
	printf("\n");

	StreamOutAndIn(handle, NUM_IN_CHANNELS, CHANNEL_IN_NAMES, streamOutInfo,
		INIT_SCAN_RATE, SCANS_PER_READ, NUM_READS);

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
	const double AIN_ALL_RANGE = 0;
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

void StreamOutAndIn(int handle, int numInChannels,
	const char ** channelInNames, StreamOutInfo streamOutInfo, double scanRate,
	int scansPerRead, int numReads)
{
	int err, iteration, channel, scan, dataIter;
	int numSkippedScans = 0;
	int totalSkippedScans = 0;
	int deviceScanBacklog = 0;
	int LJMScanBacklog = 0;
	double sequenceOffset, scalar;

	const int TOTAL_NUM_CHANNELS = numInChannels + streamOutInfo.numTargets;

	int * aScanList = malloc(sizeof(int) * TOTAL_NUM_CHANNELS);

	unsigned int aDataSize = numInChannels * scansPerRead;
	double * aData = malloc(sizeof(double) * aDataSize);

	SetUpStreamOut(handle, streamOutInfo);

	InitializeAllocatedScanList(numInChannels, channelInNames,
		streamOutInfo.numTargets, &aScanList);
	printf("\n");

	HardcodedConfigureStream(handle);

	printf("\n");
	printf("Starting stream...\n");
	err = LJM_eStreamStart(handle, scansPerRead, TOTAL_NUM_CHANNELS, aScanList,
		&scanRate);
	ErrorCheck(err, "LJM_eStreamStart");
	printf("Stream started. Actual scan rate: %.02f Hz (%.02f sample rate)\n",
		scanRate, scanRate * numInChannels);
	printf("\n");

	// Read the scans
	printf("Now performing %d reads\n", numReads);
	printf("\n");
	for (iteration = 0; iteration < numReads; iteration++) {
		err = LJM_eStreamRead(handle, aData, &deviceScanBacklog,
			&LJMScanBacklog);
		ErrorCheck(err, "LJM_eStreamRead");

		printf("iteration: %d - deviceScanBacklog: %d, LJMScanBacklog: %d\n",
			iteration, deviceScanBacklog, LJMScanBacklog);

		dataIter = 0;
		numSkippedScans = 0;
		for (scan = 0; scan < scansPerRead; scan++) {
			printf("    ");
			for (channel = 0; channel < numInChannels; channel++) {
				if (aData[dataIter] == LJM_DUMMY_VALUE) {
					++numSkippedScans;
				}
				printf("%s = %0.5f  ", channelInNames[channel],
					aData[dataIter]);
				dataIter += 1;
			}
			printf("\n");
		}

		// (iteration % 10) gives us [0, 1, ..., 8, 9]
		sequenceOffset = (iteration % 10);
		// The point is to get a value in [0.1, 0.2, ..., 0.9, 1.0]
		scalar = 1.0 - .1 * sequenceOffset;
		printf("Updating stream out with scalar: %f\n", scalar);
		UpdateStreamOutChannels(handle, streamOutInfo, scalar);

		if (numSkippedScans) {
			printf("  %d skipped scans in this LJM_eStreamRead\n",
				numSkippedScans);
			totalSkippedScans += numSkippedScans;
		}
		printf("\n");
	}

	if (totalSkippedScans) {
		printf("\n****** Total number of skipped scans: %d ******\n\n",
			totalSkippedScans);
	}

	printf("Stopping stream\n");
	err = LJM_eStreamStop(handle);
	ErrorCheck(err, "Stopping stream");

	free(aData);
	free(aScanList);
}

void SetUpStreamOut(int handle, StreamOutInfo streamOutInfo)
{
	int i;
	for (i = 0; i < streamOutInfo.numTargets; i++) {
		SetUpStreamOutTarget(handle, i, streamOutInfo.streamOutChannels[i]);
	}
}

void PrintAndWriteNameOrDie(int handle, const char * name, double value)
{
	printf("Write: %s = %f\n", name, value);
	WriteNameOrDie(handle, name, value);
}

void SetUpStreamOutTarget(int handle, int soOffset, StreamOutChannel soChannel)
{
	int targetAddress = GetAddressFromNameOrDie(soChannel.targetName);

	// Set up the names
	char STREAM_OUT_TARGET[50];
	char BUFFER_ALLOCATE_NUM_BYTES[50];
	char STREAM_OUT_ENABLE[50];
	char STREAM_OUT_BUFFER_STATUS[50];
	sprintf(STREAM_OUT_TARGET, "STREAM_OUT%d_TARGET", soOffset);
	sprintf(BUFFER_ALLOCATE_NUM_BYTES, "STREAM_OUT%d_BUFFER_ALLOCATE_NUM_BYTES", soOffset);
	sprintf(STREAM_OUT_ENABLE, "STREAM_OUT%d_ENABLE", soOffset);
	sprintf(STREAM_OUT_BUFFER_STATUS, "STREAM_OUT%d_BUFFER_STATUS", soOffset);

	// Allocate memory for the stream-out buffer
	PrintAndWriteNameOrDie(handle, STREAM_OUT_TARGET, targetAddress);
	PrintAndWriteNameOrDie(handle, BUFFER_ALLOCATE_NUM_BYTES, 512);
	PrintAndWriteNameOrDie(handle, STREAM_OUT_ENABLE, 1);

	UpdateStreamOutChannel(handle, soOffset, soChannel, 1);

	GetAndPrint(handle, STREAM_OUT_BUFFER_STATUS);
}

void UpdateStreamOutChannels(int handle, StreamOutInfo streamOutInfo,
	double scalar)
{
	int i;
	for (i = 0; i < streamOutInfo.numTargets; i++) {
		UpdateStreamOutChannel(handle, i, streamOutInfo.streamOutChannels[i],
			scalar);
	}
}

void UpdateStreamOutChannel(int handle, int soOffset,
	StreamOutChannel soChannel, double scalar)
{
	int valueI;
	double * aValues;

	// Set up the names
	char streamOutLoopSize[50];
	char streamOutBufferValues[50];
	char streamOutSetLoop[50];
	sprintf(streamOutLoopSize, "STREAM_OUT%d_LOOP_NUM_VALUES", soOffset);
	switch(soChannel.targetType) {
	// The two data types of of stream out are unsigned 16-bit integers or
	// 32-bit floating point.
	// https://labjack.com/support/datasheets/t-series/communication/stream-mode/stream-out
	case 0: // LJM_UINT16
		sprintf(streamOutBufferValues, "STREAM_OUT%d_BUFFER_U16", soOffset);
		break;
	case 3: // LJM_FLOAT32
		sprintf(streamOutBufferValues, "STREAM_OUT%d_BUFFER_F32", soOffset);
		break;
	default:
		printf("%s:%d: Unrecognized data type: %d\n", __FILE__, __LINE__,
			soChannel.targetType);
		exit(1);
	}

	sprintf(streamOutSetLoop, "STREAM_OUT%d_SET_LOOP", soOffset);

	aValues = malloc(sizeof(double) * soChannel.targetLoopSize);
	for (valueI = 0; valueI < soChannel.targetLoopSize; valueI++) {
		aValues[valueI] = scalar * soChannel.targetBufferValues[valueI];
	}

	WriteNameArrayOrDie(handle, streamOutBufferValues, soChannel.targetLoopSize,
	    aValues);

	// If this returns the error STREAM_OUT_LOOP_TOO_BIG, increase
	// BUFFER_ALLOCATE_NUM_BYTES (see SetUpStreamOutTarget)
	WriteNameOrDie(handle, streamOutLoopSize, soChannel.targetLoopSize);

	WriteNameOrDie(handle, streamOutSetLoop, 1);

	free(aValues);
}

void InitializeAllocatedScanList(const int numInChannels,
	const char ** channelInNames, const int numOutChannels, int ** aScanList)
{
	int i, err;

	// Fill aScanList with stream-in addresses
	err = LJM_NamesToAddresses(numInChannels, channelInNames,
		*aScanList, NULL);
	ErrorCheck(err,
		"%s:%d - InitializeAllocatedScanList() - Getting channel addresses",
		__FILE__, __LINE__);

	for (i = 0; i < numOutChannels; i++) {
		char streamOutName[50];
		sprintf(streamOutName, "STREAM_OUT%d", i);

		// aScanList[0] up to aScanList[numInChannels - 1] is filled with
		// stream in channels, so here we fill aScanList[numInChannels] up
		// to aScanList[TOTAL_NUM_CHANNELS - 1]
		(*aScanList)[numInChannels + i] =
			GetAddressFromNameOrDie(streamOutName);
	}
}
