/**
 * Name: stream_out_only.c
 * Desc: Sets up stream-out and manually reads the output.
**/

#include <stdio.h>
#include <string.h>

#include <LabJackM.h>

#include "../../LJM_StreamUtilities.h"

void StreamOut(int handle, double scanRate, int numSeconds);

/**
 * Desc: Configures the device to do stream out
**/
void SetupStreamOut(int handle, const char * targetName);


/**
 * Global values to quickly configure some of this program's behavior
**/

// How long to stream for
const int NUM_SECONDS = 10;

// The stream-out register to update
const char * TARGET = "DAC0";

int main()
{
	int handle;

	// How fast to stream in Hz
	double scanRate = 2;
	// This scan rate is slow so that we can easily and manually read TARGET
	// while stream out is running.

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);
	GetAndPrint(handle, "FIRMWARE_VERSION");
	printf("\n");

	DisableStreamIfEnabled(handle);
	SetupStreamOut(handle, TARGET);
	StreamOut(handle, scanRate, NUM_SECONDS);

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}

void StreamOut(int handle, double scanRate, int NUM_SECONDS)
{
	int err, i;
	int scansPerRead = 1;
	const char * BUFFER_STATUS_NAME = "STREAM_OUT0_BUFFER_STATUS";
	double bufferStatus, targetValue;
	int NUM_READS = CalculateNumReads(NUM_SECONDS, scanRate, scansPerRead);
	unsigned int timeStart, timeEnd;
	unsigned int t0, t1;
	unsigned int sleepTimeMS;
	enum { NUM_OUT_CHANNELS = 1 };
	const int aScanList[NUM_OUT_CHANNELS] = {
		GetAddressFromNameOrDie("STREAM_OUT0")
	};

	printf("\n");
	printf("Writing configurations:\n");

	printf("    Ensuring triggered stream is disabled. (Setting STREAM_TRIGGER_INDEX to 0)\n");
	WriteNameOrDie(handle, "STREAM_TRIGGER_INDEX", 0);

	printf("    Enabling internally-clocked stream. (Setting STREAM_CLOCK_SOURCE to 0)\n");
	WriteNameOrDie(handle, "STREAM_CLOCK_SOURCE", 0);

	printf("\n");

	err = LJM_eStreamStart(handle, scansPerRead, NUM_OUT_CHANNELS, aScanList, &scanRate);
	ErrorCheck(err, "LJM_eStreamStart");

	printf("Started stream:\n");
	printf("    actual scan rate: %.02f Hz\n", scanRate);
	printf("\n");

	// Read the scans
	printf("Now performing %d reads, expected to take approximately %d seconds\n",
		NUM_READS, NUM_SECONDS);
	timeStart = GetCurrentTimeMS();
	for (i = 0; i < NUM_READS; i++) {
		t0 = GetCurrentTimeMS();

		err = LJM_eReadName(handle, TARGET, &targetValue);
		ErrorCheck(err, "LJM_eReadName(Handle=%d, Name=%s, ...)", handle, TARGET);
		err = LJM_eReadName(handle, BUFFER_STATUS_NAME, &bufferStatus);
		ErrorCheck(err, "LJM_eReadName(Handle=%d, Name=%s, ...)", handle, BUFFER_STATUS_NAME);

		printf("%s: %+.05f        %s: %.00f\n", TARGET, targetValue,
			BUFFER_STATUS_NAME, bufferStatus);

		t1 = GetCurrentTimeMS();
		sleepTimeMS = 1000 / (double)scanRate - (t1 - t0);
		MillisecondSleep(sleepTimeMS);
	}
	timeEnd = GetCurrentTimeMS();

	printf("\nFinished:\n\t%d iterations over approximately %d milliseconds\n",
		i, timeEnd - timeStart);

	err = LJM_eStreamStop(handle);
	ErrorCheck(err, "Stopping stream");
}

void SetupStreamOut(int handle, const char * targetName)
{
	enum { streamOut0LoopSize = 6 };
	double STREAM_OUT0_LOOP_VALUES[] = {
		0, 1, 2, 3, 4, 5
	};
	int targetAddress;
	int err = LJM_NameToAddress(targetName, &targetAddress, NULL);
	ErrorCheck(err, "LJM_NameToAddress(%s, ...)", targetName);

	// Allocate memory for the stream-out buffer
	WriteNameOrDie(handle, "STREAM_OUT0_TARGET", targetAddress);
	WriteNameOrDie(handle, "STREAM_OUT0_BUFFER_SIZE", 512);
	WriteNameOrDie(handle, "STREAM_OUT0_ENABLE", 1);

	// Write values to the stream-out buffer
	WriteNameOrDie(handle, "STREAM_OUT0_LOOP_SIZE", streamOut0LoopSize);
	WriteNameArrayOrDie(handle, "STREAM_OUT0_BUFFER_F32", streamOut0LoopSize,
		STREAM_OUT0_LOOP_VALUES);

	WriteNameOrDie(handle, "STREAM_OUT0_SET_LOOP", 1);

	GetAndPrint(handle, "STREAM_OUT0_BUFFER_STATUS");
}
