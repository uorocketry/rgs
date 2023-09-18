/**
 * Name: spi.c
 * Desc: Demonstrates SPI communication.
 *
 *       You can short MOSI to MISO for testing.
 *
 *       T7:
 *           MOSI    FIO2
 *           MISO    FIO3
 *           CLK     FIO0
 *           CS      FIO1
 *
 *       T4:
 *           MOSI    FIO6
 *           MISO    FIO7
 *           CLK     FIO4
 *           CS      FIO5
 *
 * If you short MISO to MOSI, then you will read back the same bytes that you
 * write.  If you short MISO to GND, then you will read back zeros.  If you
 * short MISO to VS or leave it unconnected, you will read back 255s.
**/

#include <LabJackM.h>

// For LabJackM helper functions, such as OpenOrDie, PrintDeviceInfoFromHandle,
// ErrorCheck, etc.
#include "../../LJM_Utilities.h"

void SPI(int handle);

int main()
{
	int handle;

	// GetAndPrintConfigValue is defined in LJM_Utilities.h
	GetAndPrintConfigValue(LJM_LIBRARY_VERSION);
	printf("\n");

	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);
	GetAndPrint(handle, "FIRMWARE_VERSION");
	printf("\n");

	SPI(handle);

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}

void SPI(int handle)
{
	int iter;
	const int numBytes = 4;
	const char dataWrite[4] = {0x12, 0x34, 0x56, 0x78};
	char dataRead[4] = {0};

	if (GetDeviceType(handle) == LJM_dtT4) {
		// Setting CS, CLK, MISO, and MOSI lines for the T4. FIO0 to FIO3 are
		// reserved for analog inputs, and SPI requires digital lines.
		WriteNameOrDie(handle, "SPI_CS_DIONUM", 5);  // CS is FIO5
		WriteNameOrDie(handle, "SPI_CLK_DIONUM", 4);  // CLK is FIO4
		WriteNameOrDie(handle, "SPI_MISO_DIONUM", 7);  // MISO is FIO7
		WriteNameOrDie(handle, "SPI_MOSI_DIONUM", 6);  // MOSI is FIO6
	}
	else {
		// Setting CS, CLK, MISO, and MOSI lines for the T7 and other devices.
		WriteNameOrDie(handle, "SPI_CS_DIONUM", 1);  // CS is FIO1
		WriteNameOrDie(handle, "SPI_CLK_DIONUM", 0);  // CLK is FIO0
		WriteNameOrDie(handle, "SPI_MISO_DIONUM", 3);  // MISO is FIO3
		WriteNameOrDie(handle, "SPI_MOSI_DIONUM", 2);  // MOSI is FIO2
	}

	// Selecting Mode CPHA=1 (bit 0), CPOL=1 (bit 1)
	WriteNameOrDie(handle, "SPI_MODE", 3);

	// Speed Throttle:
	// Valid speed throttle values are 1 to 65536 where 0 = 65536.
	// Configuring Max. Speed (~800 kHz) = 0
	WriteNameOrDie(handle, "SPI_SPEED_THROTTLE", 0);

	// SPI_OPTIONS:
	// bit 0:
	//     0 = Active low clock select enabled
	//     1 = Active low clock select disabled.
	// bit 1:
	//     0 = DIO directions are automatically changed
	//     1 = DIO directions are not automatically changed.
	// bits 2-3: Reserved
	// bits 4-7: Number of bits in the last byte. 0 = 8.
	// bits 8-15: Reserved

	// Enabling active low clock select pin
	WriteNameOrDie(handle, "SPI_OPTIONS", 0);

	// Read back and display the SPI settings
	printf("SPI Configuration:\n");
	printf("  ");GetAndPrint(handle, "SPI_CS_DIONUM");
	printf("  ");GetAndPrint(handle, "SPI_CLK_DIONUM");
	printf("  ");GetAndPrint(handle, "SPI_MISO_DIONUM");
	printf("  ");GetAndPrint(handle, "SPI_MOSI_DIONUM");
	printf("  ");GetAndPrint(handle, "SPI_MODE");
	printf("  ");GetAndPrint(handle, "SPI_SPEED_THROTTLE");
	printf("  ");GetAndPrint(handle, "SPI_OPTIONS");

	// Write(TX)/Read(RX) 4 bytes
	WriteNameOrDie(handle, "SPI_NUM_BYTES", numBytes);

	// Write the bytes
	WriteNameByteArrayOrDie(handle, "SPI_DATA_TX", numBytes, dataWrite);
	WriteNameOrDie(handle, "SPI_GO", 1);  // Initiate the transfer

	// Display the bytes written
	printf("\n");
	for (iter = 0; iter < numBytes; iter++) {
		printf("dataWrite[%d] = 0x%02x\n", iter, dataWrite[iter]);
	}

	// Read the bytes
	ReadNameByteArrayOrDie(handle, "SPI_DATA_RX", numBytes, dataRead);

	// Display the bytes read
	printf("\n");
	for (iter = 0; iter < numBytes; iter++) {
		printf("dataRead[%d]  = 0x%02x\n", iter, dataRead[iter]);
	}
}
