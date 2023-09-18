/**
 * Name: c-r_speed_test.c
 * Desc: Performs LabJack operations in a loop and reports the timing
 *       statistics for the operations.
 * Note: Running this program via an IDE may reduce performance, causing a
 *       significant increase in round-trip communication times. Such is the
 *       case with Visual Studio - in both Debug and Release modes.
**/

// For printf
#include <stdio.h>

#include <math.h>

// For the LabJackM Library
#include <LabJackM.h>

// For LabJackM helper functions, such as OpenOrDie, PrintDeviceInfoFromHandle,
// ErrorCheck, etc.
#include "../../LJM_Utilities.h"

#define FALSE 0
#define TRUE 1

typedef enum {
	CallTypeName = 0,
	CallTypeAddress = 1,
	CallTypeRaw = 2 // The send/receive part of CallTypeRaw is hardcoded to only
	                // read AIN0
} CallType;
const CallType CALL_TYPE = CallTypeName;

/**
 * Desc: Configures AIN settings on the device. On error, prints error, closes
 *       all devices, and exits the program.
 * Para: handle, the device to configure
 *       numAIN, the number of AINs to configure. For each numAIN, configures
 *           starting with AIN 0 and ends with AIN (numAIN minus 1). Example:
 *           numAIN == 3, AIN0, AIN1, and AIN2 are configured
 *       writeDigital, whether or not the speed test should write to DIO_STATE
 *           or not
 * Note: numAIN must be be greater than 0
**/
void ConfigureAIN(int handle, int numAIN, int writeDigital);

/**
 * Desc: Sets up parameters to be passed to LJM_eNames. From the input
 *       parameters, counts the number of frames, allocates memory for the
 *       arrays, and initializes the arrays. On error, prints error, closes all
 *       devices, and exits the program.
 * Para: numAIN, the number of AINs to read. For each numAIN, adds 1 read frame,
 *           starting with AIN 0 and ending with AIN (numAIN minus 1). Example:
 *           numAIN == 3, AIN0, AIN1, and AIN2 are read
 *       writeDACs, FALSE/0 for false, non-zero for true. If true, adds 2 frames
 *                  that write 0.0 to both DAC0 and DAC1
 *       readDigital, FALSE/0 for false, non-zero for true. If true, adds 1
 *                    frame that reads DIO_STATE
 *       writeDigital, FALSE/0 for false, non-zero for true. If true, adds 1
 *                     frame that writes 0.0 to DIO_STATE
 *       numFrames, output parameter. Gives the total number of frames created
 *       aNames, output array. Gives the names of each frame
 *       aWrites, output array. Gives the direction of each frame (read/write)
 *       aNumValues, output array. Always 1 for each frame
 *       aValues, output array. Gives the value of each frame
**/
void SetUpSpeedTest(int numAIN, int writeDACs, int readDigital,
	int writeDigital, int * numFrames, char *** aNames, int ** aWrites,
	int ** aNumValues, double ** aValues);

/**
 * Desc: Deallocates memory for the arrays
**/
void CleanUpSpeedTest(int numFrames, char ** aNames, int * aWrites,
	int * aNumValues, double * aValues);

/**
 * Desc: Calls LJM_eNames in a loop, recording how fast the loop takes to
 *       complete, and prints the results. On error, prints error, closes all
 *       devices, and exits the program.
 * Para: numIterations, the number of times to call LJM_eNames
**/
void SpeedTest(int numIterations, int handle, int numFrames,
	const char ** aNames, int * aWrites, int * aNumValues, double * aValues);

/**
 * Desc: Calls LJM_eNames or LJM_eAddresses, respectively, in a loop
 * Retr: The total amount of time it took to perform the given number of
 *       iterations
**/
unsigned int ExecuteNameIterations(int numIterations, int handle, int numFrames,
	const char ** aNames, int * aWrites, int * aNumValues, double * aValues);
unsigned int ExecuteAddressIterations(int numIterations, int handle,
	int numFrames, const char ** aNames, int * aWrites, int * aNumValues,
	double * aValues);

/**
 * Desc: Calls LJM_WriteRaw and LJM_ReadRaw in a loop
 * Retr: The total amount of time it took to perform the given number of
 *       iterations
 * Note: This test is overly simplified
**/
unsigned int ExecuteRawIterations(int numIterations, int handle);

int main()
{
	// Number of iterations to perform in the loop
	const int NUM_ITERATIONS = 1000;

	// Analog input settings for this test
	const int NUM_AIN = 8;

	// Analog output settings
	int writeDACs = FALSE;

	// Digital input/output settings
	int readDigital = FALSE;
	int writeDigital = FALSE;

	int numFrames;
	char ** aNames;
	int * aWrites;
	int * aNumValues;
	double * aValues;

	int handle;

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);
	printf("\n");

	if (NUM_AIN > 0) {
		ConfigureAIN(handle, NUM_AIN, writeDigital);
	}

	SetUpSpeedTest(NUM_AIN, writeDACs, readDigital, writeDigital,
		&numFrames, &aNames, &aWrites, &aNumValues, &aValues);

	SpeedTest(NUM_ITERATIONS, handle, numFrames, (const char **)aNames, aWrites,
		aNumValues, aValues);

	CleanUpSpeedTest(numFrames, aNames, aWrites, aNumValues, aValues);

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}

void ConfigureAIN(int handle, int numAIN, int writeDigital)
{
	int i = 0;
	enum { NUM_FRAMES = 3 };
	char range[LJM_MAX_NAME_SIZE];
	char resolutionIndex[LJM_MAX_NAME_SIZE];
	char settling[LJM_MAX_NAME_SIZE];
	char * aNames[NUM_FRAMES] = {range, resolutionIndex, settling};
	double aValues[NUM_FRAMES];
	int errorAddress = INITIAL_ERR_ADDRESS;
	int err = 0;

	// T4 analog input configuration
	double T4RangeAIN_HV = 10.0; // HV channels range
	double T4RangeAIN_LV = 2.4; // LV channels range
	double dioInhibit, dioAnalogEnable;

	// T7 and other devices analog input range
	double rangeAIN = 10.0;

	double resolutionAIN = 1;
	double settlingIndexAIN = 0;

	printf("ConfigureAIN:\n");
	printf("  resolutionAIN: %f\n", resolutionAIN);
	printf("  settlingIndexAIN: %f\n", settlingIndexAIN);
	printf("\n");

	if (numAIN < 1) {
		printf("ConfigureAIN: numAIN must be greater than 0\n");
		LJM_CloseAll();
		exit(1);
	}

	if (GetDeviceType(handle) == LJM_dtT4) {
		// Configure the channels to analog input or digital I/O
		// Update all digital I/O channels. b1 = Ignored. b0 = Affected.
		dioInhibit = 0x00000; // (b00000000000000000000)
		// Set AIN 0 to numAIN-1 as analog inputs (b1), the rest as digital I/O
		// (b0).
		dioAnalogEnable = (1 << numAIN) - 1;
		WriteNameOrDie(handle, "DIO_INHIBIT", dioInhibit);
		WriteNameOrDie(handle, "DIO_ANALOG_ENABLE", dioAnalogEnable);
		if (writeDigital) {
			// Update only digital I/O channels in future digital write calls.
			// b1 = Ignored. b0 = Affected.
			dioInhibit = dioAnalogEnable;
			WriteNameOrDie(handle, "DIO_INHIBIT", dioInhibit);
		}
	}

	for (i=0; i<numAIN; i++) {
		sprintf(range, "AIN%d_RANGE", i);
		if (GetDeviceType(handle) == LJM_dtT4) {
			if (i < 4) {
				aValues[0] = T4RangeAIN_HV;
			}
			else {
				aValues[0] = T4RangeAIN_LV;
			}
		}
		else {
			aValues[0] = rangeAIN;
		}

		sprintf(resolutionIndex, "AIN%d_RESOLUTION_INDEX", i);
		aValues[1] = resolutionAIN;

		sprintf(settling, "AIN%d_SETTLING_US", i);
		aValues[2] = settlingIndexAIN;

		err = LJM_eWriteNames(handle, NUM_FRAMES, (const char **)aNames,
			aValues, &errorAddress);
		ErrorCheckWithAddress(err, errorAddress,
			"ConfigureAIN: LJM_eWriteNames");
	}
}

void SetUpSpeedTest(int numAIN, int writeDACs, int readDigital,
	int writeDigital, int * numFramesPtr, char *** aNames, int ** aWrites,
	int ** aNumValues, double ** aValues)
{
	int i = 0;
	int frame = 0;

	// Count how many frames we need
	int numFrames = numAIN;
	if (writeDACs)
		numFrames += 2;
	if (readDigital)
		++numFrames;
	if (writeDigital)
		++numFrames;

	// Allocate for how many frames we need
	*aNames = (char **) malloc (numFrames * sizeof(char *));
	*aWrites = (int *) malloc (numFrames * sizeof(int));
	*aNumValues = (int *) malloc (numFrames * sizeof(int));
	*aValues = (double *) malloc (numFrames * sizeof(double));

	frame = 0;
	for (i=0; i<numAIN; i++) {
		(*aNames)[frame] = (char *) malloc (LJM_MAX_NAME_SIZE * sizeof(char));
		sprintf((*aNames)[frame], "AIN%d", i);
		(*aWrites)[frame] = LJM_READ;
		(*aNumValues)[frame] = 1;
		(*aValues)[frame] = 0;
		++frame;
	}

	if (readDigital) {
		(*aNames)[frame] = (char *) malloc (LJM_MAX_NAME_SIZE * sizeof(char));
		sprintf((*aNames)[frame], "DIO_STATE");
		(*aWrites)[frame] = LJM_READ;
		(*aNumValues)[frame] = 1;
		(*aValues)[frame] = 0;
		++frame;
	}

	if (writeDigital) {
		(*aNames)[frame] = (char *) malloc (LJM_MAX_NAME_SIZE * sizeof(char));
		sprintf((*aNames)[frame], "DIO_STATE");
		(*aWrites)[frame] = LJM_WRITE;
		(*aNumValues)[frame] = 1;
		(*aValues)[frame] = 0; // output-low
		++frame;
	}

	if (writeDACs) {
		for (i=0; i<2; i++) {
			(*aNames)[frame] = (char *) malloc (
				LJM_MAX_NAME_SIZE * sizeof(char));
			sprintf((*aNames)[frame], "DAC%d", i);
			(*aWrites)[frame] = LJM_WRITE;
			(*aNumValues)[frame] = 1;
			(*aValues)[frame] = 0.0; // 0.0 V
			++frame;
		}
	}

	*numFramesPtr = numFrames;
}

void CleanUpSpeedTest(int numFrames, char ** aNames, int * aWrites,
	int * aNumValues, double * aValues)
{
	int i;
	for (i=0; i<numFrames; i++) {
		free (aNames[i]);
	}
	free (aNames);
	free (aWrites);
	free (aNumValues);
	free (aValues);
}

void SpeedTest(int numIterations, int handle, int numFrames,
	const char ** aNames, int * aWrites, int * aNumValues, double * aValues)
{
	unsigned int totalMS;
	int i;
	const char * READ = "read";
	const char * WRITE = "write";
	const char * readOrWrite;

	printf("Speed test frames:\n");
	for (i=0; i<numFrames; i++) {
		if (aWrites[i] == LJM_READ) {
			readOrWrite = READ;
		}
		else {
			readOrWrite = WRITE;
		}

		printf("    %s %s\n", readOrWrite, aNames[i]);
	}

	if (CALL_TYPE == CallTypeName) {
		totalMS = ExecuteNameIterations(numIterations, handle, numFrames,
			aNames, aWrites, aNumValues, aValues);
	}
	else if (CALL_TYPE == CallTypeAddress) {
		totalMS = ExecuteAddressIterations(numIterations, handle, numFrames,
			aNames, aWrites, aNumValues, aValues);
	}
	else {
		// CALL_TYPE == CallTypeRaw
		totalMS = ExecuteRawIterations(numIterations, handle);
	}

	printf("%d iterations performed\n", numIterations);
	printf("    Approximate time taken: %d ms\n", totalMS);
	printf("    Approximate average time per iteration: %f ms\n",
		((double)totalMS)/numIterations);

	printf("\nLast results:\n");
	for (i=0; i<numFrames; i++) {
		if (aWrites[i] == LJM_READ) {
			readOrWrite = READ;
		}
		else {
			readOrWrite = WRITE;
		}

		printf("    %s %s value : %f\n", aNames[i], readOrWrite, aValues[i]);
	}
}

unsigned int ExecuteNameIterations(int numIterations, int handle, int numFrames,
	const char ** aNames, int * aWrites, int * aNumValues, double * aValues)
{
	unsigned int timeStart, timeEnd;
	int errorAddress = INITIAL_ERR_ADDRESS;
	int err;
	int i;

	printf("\nBeginning %d iterations of LJM_eNames...\n", numIterations);

	timeStart = GetCurrentTimeMS();
	for (i=0; i<numIterations; i++) {
		err = LJM_eNames(handle, numFrames, aNames, aWrites, aNumValues,
			aValues, &errorAddress);
		ErrorCheckWithAddress(err, errorAddress, "LJM_eNames");
	}
	timeEnd = GetCurrentTimeMS();

	return timeEnd - timeStart;
}

unsigned int ExecuteAddressIterations(int numIterations, int handle,
	int numFrames, const char ** aNames, int * aWrites, int * aNumValues,
	double * aValues)
{
	unsigned int timeStart, timeEnd;
	int errorAddress = INITIAL_ERR_ADDRESS;
	int err;
	int i;

	int * aAddresses = malloc(sizeof(int) * numFrames);
	int * aTypes = malloc(sizeof(int) * numFrames);

	err = LJM_NamesToAddresses(numFrames, aNames, aAddresses, aTypes);
	ErrorCheck(err, "LJM_NamesToAddresses");

	printf("\nBeginning %d iterations of LJM_eAddresses...\n", numIterations);

	timeStart = GetCurrentTimeMS();
	for (i=0; i<numIterations; i++) {
		err = LJM_eAddresses(handle, numFrames, aAddresses, aTypes, aWrites,
			aNumValues, aValues, &errorAddress);
		ErrorCheckWithAddress(err, errorAddress, "LJM_eAddresses");
	}
	timeEnd = GetCurrentTimeMS();

	free (aAddresses);
	free (aTypes);

	return timeEnd - timeStart;
}

unsigned int ExecuteRawIterations(int numIterations, int handle)
{
	unsigned int transactionID = 1;
	unsigned int timeStart, timeEnd;
	int err;
	int i;

	// Packet to read AIN0
	unsigned char readCommand[12] = {
		0x00, 0x00, 0x00, 0x00, 0x00, 0x06, 0x01, 0x4C, 0x00, 0x00, 0x00, 0x02
	};
	unsigned char readResponse[12] = {0x00};

	printf("\nCallTypeRaw: Ignoring some configurations - reading from AIN0 and ignoring its value\n");
	printf("Beginning %d iterations of LJM_WriteRaw and LJM_ReadRaw...\n", numIterations);

	timeStart = GetCurrentTimeMS();
	for (i=0; i<numIterations; i++) {
		readCommand[0] = (transactionID & 0xFF00) >> 8;
		readCommand[1] = transactionID & 0xFF;
		++transactionID;
		err = LJM_WriteRaw(handle, readCommand, 12);
		ErrorCheck(err, "LJM_WriteRaw");
		err = LJM_ReadRaw(handle, readResponse, 12);
		ErrorCheck(err, "LJM_ReadRaw");
	}
	timeEnd = GetCurrentTimeMS();

	return timeEnd - timeStart;
}
