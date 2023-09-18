/**
 * Name: uart_loopback_test.c
 * Desc: Simple Asynch example uses the first found device and 9600/8/N/1.
 *       Does a write, waits 1 second, then returns whatever was read in that
 *       time. If you short RX to TX (FIO0 and FIO1 by default below), then you
 *       will read back the same bytes that you write.
**/

#include <LabJackM.h>

// For LabJackM helper functions, such as OpenOrDie, PrintDeviceInfoFromHandle,
// ErrorCheck, etc.
#include "../../LJM_Utilities.h"

double GetNameOrDie(int handle, const char * name);

void PrintAsBytes(int numValues, const double * values);

int main()
{
	int handle;
	const double writeValues[4] = {0x12, 0x34, 0x56, 0x78};
	double readValues[4];

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);
	printf("\n");

	printf("Short FIO0 and FIO1 together to read back the same bytes:\n\n");

	// Configure the T7 for loopback
	WriteNameOrDie(handle, "ASYNCH_ENABLE", 0);
	WriteNameOrDie(handle, "ASYNCH_RX_DIONUM", 0);
	WriteNameOrDie(handle, "ASYNCH_TX_DIONUM", 1);
	WriteNameOrDie(handle, "ASYNCH_BAUD", 9600);
	WriteNameOrDie(handle, "ASYNCH_NUM_DATA_BITS", 8);
	WriteNameOrDie(handle, "ASYNCH_PARITY", 0);
	WriteNameOrDie(handle, "ASYNCH_NUM_STOP_BITS", 1);
	WriteNameOrDie(handle, "ASYNCH_ENABLE", 1);

	// Write
	printf("writing: ");
	PrintAsBytes(4, writeValues);
	WriteNameOrDie(handle, "ASYNCH_NUM_BYTES_TX", 4);
	WriteNameArrayOrDie(handle, "ASYNCH_DATA_TX", 4, writeValues);

	WriteNameOrDie(handle, "ASYNCH_TX_GO", 1);

	MillisecondSleep(1000);

	// Read
	WriteNameOrDie(handle, "ASYNCH_NUM_BYTES_RX", 4);
	ReadNameArrayOrDie(handle, "ASYNCH_DATA_RX", 4, readValues);
	printf("read:    ");
	PrintAsBytes(4, readValues);

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}

double GetNameOrDie(int handle, const char * name)
{
	double value;
	int err = LJM_eReadName(handle, name, &value);
	if (err != LJME_NOERROR) {
		CouldNotRead(err, name);
	}
	return value;
}

void PrintAsBytes(int numValues, const double * values)
{
	int iter;
	printf("0x");
	for (iter = 0; iter < numValues; iter++) {
		printf("%02x ", (int)values[iter]);
	}
	printf("\n");
}
