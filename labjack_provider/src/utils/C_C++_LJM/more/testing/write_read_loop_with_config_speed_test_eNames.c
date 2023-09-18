/**
 * Name: write_read_loop_with_config_speed_test_eNames.c
 * Desc: This modified version of a basic example adds code to do interval
 *       timing.  It does the specified number of iterations and reports the
 *       average time per iteration.  Also, this version uses 1 call to eNames
 *       to write and read.
 * Note: For documentation on register names to use, see the T-series Datasheet
 *       or the Modbus Map.
**/

// For printf
#include <stdio.h>

// For the LabJackM Library
#include <LabJackM.h>

// For LabJackM helper functions, such as OpenOrDie, PrintDeviceInfoFromHandle,
// ErrorCheck, etc.
#include "../../LJM_Utilities.h"

int main()
{
	int err;
	int handle;
	int frameI, arrayI, valueI;
	int errorAddress = INITIAL_ERR_ADDRESS;
	int deviceType;
	double dacVolt;
	int fioState;
	long long timeStart;
	long long timeEnd;
	long long iterationTime;
	long long totalTime;
	long long averageTime;
	long long minTime;
	long long maxTime;

	int numIterations = 1000;
	int it = 0;

	enum { NUM_FRAMES = 4 };

	const char * aNames[NUM_FRAMES];
	int aWrites[NUM_FRAMES] = {LJM_WRITE, LJM_WRITE, LJM_READ, LJM_READ};
	int aNumValues[NUM_FRAMES] = {1, 1, 1, 1};
	double aValues[NUM_FRAMES];

	// Open first found LabJack
	err = LJM_Open(LJM_dtANY, LJM_ctANY, "LJM_idANY", &handle);
	ErrorCheck(err, "LJM_Open");

	// T7 device, Any connection, Any identifier
	// LJM_OpenS("T7", "ANY", "ANY", &handle);

	// T4 device, Any connection, Any identifier
	// LJM_OpenS("T4", "ANY", "ANY", &handle);

	PrintDeviceInfoFromHandle(handle);
	printf("\n");

	deviceType = GetDeviceType(handle);

	printf("Configuring...\n");
	if (deviceType == LJM_dtT4) {
		// LabJack T4 configuration

		// Set FIO5 (DIO5) and FIO6 (DIO6) lines to digital I/O.
		//     DIO_INHIBIT = 0xF9F, b111110011111.
		//                   Update only DIO5 and DIO6.
		//     DIO_ANALOG_ENABLE = 0x000, b000000000000.
		//                         Set DIO5 and DIO6 to digital I/O (b0).
		WriteNameOrDie(handle, "DIO_INHIBIT", 0xF9F);
		printf("    DIO_INHIBIT : 0x%x\n", 0xF9F);
		WriteNameOrDie(handle, "DIO_ANALOG_ENABLE", 0x000);
		printf("    DIO_ANALOG_ENABLE : 0x%x\n", 0x000);

		// The T4 only has single-ended analog inputs.
		// The range of AIN0-AIN3 is +/-10 V.
		// The range of AIN4-AIN11 is 0-2.5 V.
	}
	else {
		// LabJack T7 and other devices configuration.

		// Negative Channel = 199 (Single-ended)
		WriteNameOrDie(handle, "AIN0_NEGATIVE_CH", 199);
		printf("    AIN0_NEGATIVE_CH : %d\n", 199);

		// Range = +/-10 V
		WriteNameOrDie(handle, "AIN0_RANGE", 10);
		printf("    AIN0_RANGE : %d\n", 10);
	}

	// More configurations for both the T4 and T7

	// Resolution index = 1
	WriteNameOrDie(handle, "AIN0_RESOLUTION_INDEX", 1);
	printf("    AIN0_RESOLUTION_INDEX : %d\n", 1);

	// Settling = 0 (auto)
	WriteNameOrDie(handle, "AIN0_SETTLING_US", 0);
	printf("    AIN0_SETTLING_US : %d\n", 0);

	printf("\n");

	// Setup eNames to write to DAC0, and:
	//   - FIO5 (T4) or
	//   - FIO1 (T7 and other devices).

	// and setup eNames to read AIN0, and:
	//   - FIO6 (T4) or
	//   - FIO2 (T7 and other devices).

	aNames[0] = "DAC0";
	aNames[2] = "AIN0";
	if (deviceType == LJM_dtT4) {
		aNames[1] = "FIO5";
		aNames[3] = "FIO6";
	}
	else {
		aNames[1] = "FIO1";
		aNames[3] = "FIO2";
	}

	// Begin the loop

	totalTime = 0;
	for (it = 0; it < numIterations; it++) {
		timeStart = LJM_GetHostTick();

		// DAC0 will cycle ~0.0 to ~5.0 volts in 1.0 volt increments.
		// FIO5/FIO1 will toggle output high (1) and low (0) states.

		dacVolt = it % 6; // 0-5
		fioState = it % 2; // 0 or 1
		aValues[0] = dacVolt;
		aValues[1] = (double)fioState;
		err = LJM_eNames(handle, NUM_FRAMES, aNames, aWrites, aNumValues,
			aValues, &errorAddress);
		ErrorCheckWithAddress(err, errorAddress, "LJM_eNames");

		timeEnd = LJM_GetHostTick();
		iterationTime = timeEnd-timeStart;
		totalTime = totalTime + iterationTime;

		// Track the maximum and the minimum iteration times
		if (it == 0) {
			maxTime = iterationTime;
			minTime = iterationTime;
		}
		if (iterationTime < minTime)
			minTime = iterationTime;
		if (iterationTime > maxTime)
			maxTime = iterationTime;

		printf("Time for iteration %i:  %lld microseconds", it+1, iterationTime);
		printf("\n");
	}

	printf("\nLJM_eNames results of final iteration:\n");
	valueI = 0;
	for (frameI=0; frameI<NUM_FRAMES; frameI++) {
		printf("\t");
		if (aWrites[frameI] == LJM_WRITE) {
			printf("Wrote");
		}
		else {
			printf("Read ");
		}
		printf(" - %s: [", aNames[frameI]);

		for (arrayI=0; arrayI<aNumValues[frameI]; arrayI++) {
			printf(" %f", aValues[valueI++]);
		}
		printf(" ]\n");
	}

	averageTime = totalTime/numIterations;
	printf("Total time:  %lld microseconds\n", totalTime);
	printf("Average time:  %lld microseconds\n", averageTime);
	printf("Maximum time:  %lld microseconds\n", maxTime);
	printf("Minimum time:  %lld microseconds\n", minTime);

	// Close device handle
	err = LJM_Close(handle);
	ErrorCheck(err, "LJM_Close");

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
