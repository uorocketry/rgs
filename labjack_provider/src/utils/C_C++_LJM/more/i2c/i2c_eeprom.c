/**
 * Name: i2c_eeprom.c
 * Desc: Demonstrates I2C communication using the LJM driver.
 *       The demonstration uses a LJTick-DAC connected to FIO0/FIO1 for the T7
 *       or FIO4/FIO5 for the T4 and configures the I2C settings.
 *       This example configures I2C communication on the device, reads user
 *       memory on the LJTick-DAC, writes random bytes to user memory on the
 *       LJTick-DAC, then reads the user memory again.
**/

#include <stdio.h>
#include <math.h>
#include <time.h>

#include <LabJackM.h>

// For LabJackM helper functions, such as OpenOrDie, PrintDeviceInfoFromHandle,
// ErrorCheck, etc.
#include "../../LJM_Utilities.h"

void i2c_eeprom(int handle);

int main()
{
	int handle;

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);
	printf("\n");

	i2c_eeprom(handle);

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}

void i2c_eeprom(int handle)
{
	int i;

	// Variables for eNames
	const char * I2C_WRITE_NAME = "I2C_DATA_TX";
	const char * I2C_READ_NAME = "I2C_DATA_RX";
	int numBytes;
	char aBytes[32] = {0}; // TX/RX bytes will go here

	// Configure the I2C communication.
	if (GetDeviceType(handle) == LJM_dtT4) {
		// For the T4, using FIO4 and FIO5 for SCL and SDA pins. FIO0 to FIO3 are
		// reserved for analog inputs, and digital lines are required.
		WriteNameOrDie(handle, "I2C_SDA_DIONUM", 5);  // SDA pin number = 5 (FIO5)
		WriteNameOrDie(handle, "I2C_SCL_DIONUM", 4);  // SCL pin number = 4 (FIO4)
	}
	else {
		// For the T7 and other devices, using FIO0 and FIO1 for the SCL and SDA
		// pins.
		WriteNameOrDie(handle, "I2C_SDA_DIONUM", 1);  // SDA pin number = 1 (FIO1)
		WriteNameOrDie(handle, "I2C_SCL_DIONUM", 0);  // SCL pin number = 0 (FIO0)
	}

	// Speed throttle is inversely proportional to clock frequency. 0 = max.
	WriteNameOrDie(handle, "I2C_SPEED_THROTTLE", 0);

	// Options bits:
	//   bit0: Reset the I2C bus.
	//   bit1: Restart w/o stop
	//   bit2: Disable clock stretching.
	WriteNameOrDie(handle, "I2C_OPTIONS", 0);

	// Slave Address of the I2C chip = 80 (0x50)
	WriteNameOrDie(handle, "I2C_SLAVE_ADDRESS", 80);

	// Initial read of EEPROM bytes 0-3 in the user memory area. We need a
	// single I2C transmission that writes the chip's memory pointer and then
	// reads the data.
	WriteNameOrDie(handle, "I2C_NUM_BYTES_TX", 1); // Set the number of bytes to transmit
	WriteNameOrDie(handle, "I2C_NUM_BYTES_RX", 4); // Set the number of bytes to receive

	// Set the TX bytes. We are sending 1 byte for the address.
	numBytes = 1;
	aBytes[0] = 0; // Byte 0: Memory pointer = 0
	WriteNameByteArrayOrDie(handle, I2C_WRITE_NAME, numBytes, aBytes);

	WriteNameOrDie(handle, "I2C_GO", 1); // Do the I2C communications.

	// Read the RX bytes.
	numBytes = 4;
	for (i = 0; i < 4; i++) {
		aBytes[i] = 0;
	}
	ReadNameByteArrayOrDie(handle, I2C_READ_NAME, numBytes, aBytes);

	printf("Read  User Memory [0-3] = ");
	for (i = 0; i < 4; i++) {
		printf("%d ", (unsigned char)aBytes[i]);
	}
	printf("\n");

	// Write EEPROM bytes 0-3 in the user memory area, using the page write technique. Note
	// that page writes are limited to 16 bytes max, and must be aligned with the 16-byte
	// page intervals. For instance, if you start writing at address 14, you can only write
	// two bytes because byte 16 is the start of a new page.
	WriteNameOrDie(handle, "I2C_NUM_BYTES_TX", 5); // Set the number of bytes to transmit
	WriteNameOrDie(handle, "I2C_NUM_BYTES_RX", 0); // Set the number of bytes to receive

	// Set the TX bytes.
	numBytes = 5;
	aBytes[0] = 0; // Byte 0: Memory pointer = 0
	// Create 4 new random numbers to write (aBytes[1-4]).
	srand((unsigned)time(NULL)); // Seeding the random number generator with the current time
								 // for different values each run.
	for (i = 1; i < 5; i++) {
		aBytes[i] = (char)(rand() % 256); // "% 256" gives the range 0 to 255
	}
	WriteNameByteArrayOrDie(handle, I2C_WRITE_NAME, numBytes, aBytes);

	WriteNameOrDie(handle, "I2C_GO", 1); // Do the I2C communications.

	printf("Write User Memory [0-3] = ");
	for (i = 1; i < 5; i++) {
		printf("%d ", (unsigned char)aBytes[i]);
	}
	printf("\n");

	// Final read of EEPROM bytes 0-3 in the user memory area.
	// We need a single I2C transmission that writes the address and then reads
	// the data.
	WriteNameOrDie(handle, "I2C_NUM_BYTES_TX", 1); // Set the number of bytes to transmit
	WriteNameOrDie(handle, "I2C_NUM_BYTES_RX", 4); // Set the number of bytes to receive

	// Set the TX bytes. We are sending 1 byte for the address.
	numBytes = 1;
	aBytes[0] = 0; // Byte 0: Memory pointer = 0
	WriteNameByteArrayOrDie(handle, I2C_WRITE_NAME, numBytes, aBytes);

	WriteNameOrDie(handle, "I2C_GO", 1); // Do the I2C communications.

	// Read the RX bytes.
	numBytes = 4;
	for (i = 0; i < 4; i++) {
		aBytes[i] = 0;
	}
	ReadNameByteArrayOrDie(handle, I2C_READ_NAME, numBytes, aBytes);

	printf("Read  User Memory [0-3] = ");
	for (i = 0; i < 4; i++) {
		printf("%d ", (unsigned char)aBytes[i]);
	}
	printf("\n");
}
