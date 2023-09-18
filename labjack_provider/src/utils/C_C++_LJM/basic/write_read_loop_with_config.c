/**
 * Name: write_read_loop_with_config.c
 * Desc: Performs an initial call to eWriteNames to write configuration values,
 *       and then calls eWriteNames and eReadNames repeatedly in a loop.
 * Note: For documentation on register names to use, see the T-series Datasheet
 *       or the Modbus Map.
**/

// For printf
#include <stdio.h>

// For the LabJackM Library
#include <LabJackM.h>

// For LabJackM helper functions, such as OpenOrDie, PrintDeviceInfoFromHandle,
// ErrorCheck, etc., such as OpenOrDie, PrintDeviceInfoFromHandle,
// ErrorCheck, etc.
#include "../LJM_Utilities.h"

int main()
{
	int err;
	int handle;
	int i;
	int errorAddress = INITIAL_ERR_ADDRESS;
	int skippedIntervals;
	int deviceType;
	double dacVolt;
	int fioState;

	const int INTERVAL_HANDLE = 1;
	int it = 0;

	// How many milliseconds per interval?
	int msDelay = 1000;

	enum { MAX_FRAMES = 2 };
	// The largest NumFrames for eReadNames or eWriteNames is 2, for either the
	// T4 or the T7. (See the while loop below.)

	// To be filled out later during eReadNames and eWriteNames:
	int numFrames;
	char * aNames[MAX_FRAMES];
	double aValues[MAX_FRAMES];

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

	// Setup and call eWriteNames to configure AIN0.
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

	// Resolution index = 0 (default)
	WriteNameOrDie(handle, "AIN0_RESOLUTION_INDEX", 0);
	printf("    AIN0_RESOLUTION_INDEX : %d\n", 0);

	// Settling = 0 (auto)
	WriteNameOrDie(handle, "AIN0_SETTLING_US", 0);
	printf("    AIN0_SETTLING_US : %d\n", 0);

	printf("\n");

	// Begin the loop
	printf("Starting loop.  Press Ctrl+c to stop.\n\n");
	// The LabJackM (LJM) library will catch the Ctrl+c signal, close
	// all open devices, then exit the program.

	err = LJM_StartInterval(INTERVAL_HANDLE, msDelay * 1000);
	ErrorCheck(err, "LJM_StartInterval");

	while (1) {
		// Setup and call eWriteNames to write to DAC0, and:
		//   - FIO5 (T4) or
		//   - FIO1 (T7 and other devices).
		// DAC0 will cycle ~0.0 to ~5.0 volts in 1.0 volt increments.
		// FIO5/FIO1 will toggle output high (1) and low (0) states.
		numFrames = 2;
		aNames[0] = "DAC0";
		if (deviceType == LJM_dtT4) {
			aNames[1] = "FIO5";
		}
		else {
			aNames[1] = "FIO1";
		}
		dacVolt = it % 6; // 0-5
		fioState = it % 2; // 0 or 1
		aValues[0] = dacVolt;
		aValues[1] = (double)fioState;
		err = LJM_eWriteNames(handle, numFrames, (const char **)aNames, aValues,
			&errorAddress);
		ErrorCheckWithAddress(err, errorAddress, "LJM_eWriteNames");
		printf("eWriteNames :");
		for (i = 0; i < numFrames; i++) {
			printf(" %s = %.4f  ", aNames[i], aValues[i]);
		}
		printf("\n");

		// Setup and call eReadNames to read AIN0, and:
		//   - FIO6 (T4) or
		//   - FIO2 (T7 and other devices).
		numFrames = 2;
		aNames[0] = "AIN0";
		if (deviceType == LJM_dtT4) {
			aNames[1] = "FIO6";
		}
		else {
			aNames[1] = "FIO2";
		}
		aValues[0] = dacVolt;
		aValues[1] = (double)fioState;
		err = LJM_eReadNames(handle, numFrames, (const char **)aNames, aValues,
			&errorAddress);
		ErrorCheckWithAddress(err, errorAddress, "LJM_eReadNames");
		printf("eReadNames  :");
		for (i = 0; i < numFrames; i++) {
			printf(" %s = %.4f  ", aNames[i], aValues[i]);
		}
		printf("\n");

		++it;

		err = LJM_WaitForNextInterval(INTERVAL_HANDLE, &skippedIntervals);
		ErrorCheck(err, "LJM_WaitForNextInterval");
		if (skippedIntervals > 0) {
			printf("SkippedIntervals: %d\n", skippedIntervals);
		}
		printf("\n");
	}

	// Close interval and device handles
	err = LJM_CleanInterval(INTERVAL_HANDLE);
	ErrorCheck(err, "LJM_CleanInterval");

	err = LJM_Close(handle);
	ErrorCheck(err, "LJM_Close");

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
