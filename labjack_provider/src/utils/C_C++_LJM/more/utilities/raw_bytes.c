/**
 * Name: raw_bytes.c
 * Desc: Shows how to read from an analog input using a LabJack
 *       using the WriteRawBytes and ReadRawBytes functions
**/

#include <stdio.h>
#include <stdlib.h>
#include <LabJackM.h>

#include "../../LJM_Utilities.h"

int main()
{
	int err;

	// Read from register 0
	#define NUM_WRITE_BYTES 12
	unsigned char writePacket[NUM_WRITE_BYTES] = {
		0x12, 0x34, // Arbitrary transaction id
		0x0, 0x0, // Protocol id
		0x0, 0x6, // Length
		0x0, // Unit id
		0x3, // Read Regs functions
		0x0, 0x0, // Address 0
		0x0, 0x2 // 2 registers
	};

	#define NUM_READ_BYTES 13
	unsigned char readPacket[NUM_READ_BYTES];
	float result;

	int handle;

	const int REGISTER_OFFSET = 0;
	const int NUM_FLOATS = 1;

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);
	printf("\n");

	// Send read request
	err = LJM_WriteRaw(handle, writePacket, NUM_WRITE_BYTES);
	ErrorCheck(err, "LJM_WriteRaw");

	// Receive read
	err = LJM_ReadRaw(handle, readPacket, NUM_READ_BYTES);
	ErrorCheck(err, "LJM_ReadRaw");

	// Convert from bytes to floating point
	LJM_ByteArrayToFLOAT32(readPacket + 9, REGISTER_OFFSET, NUM_FLOATS, &result);

	// Print results
	printf("AIN 0: %f\n", result);

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
