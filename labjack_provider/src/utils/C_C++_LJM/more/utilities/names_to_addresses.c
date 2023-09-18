/**
 * Name: names_to_addresses.c
 * Desc: Shows LJM_NamesToAddresses in action
**/

#include <stdio.h>
#include <stdlib.h>
#include <string.h> // For memset and strncpy

#include "../../LJM_Utilities.h"

#include <LabJackM.h>

void PrintNamesToAddressOutput(int NumFrames, const char ** Names, int * aAddresses,
	int * aTypes, int err);

void PrintRegisterConstantsExample();

void DynamicallyAllocatedDemo();

int main()
{
	int err;

	// Should work
	enum { NUM_NAMES = 2 };
	const char * aNames[] = {"DAC0", "SERIAL_NUMBER"};
	int aAddresses[NUM_NAMES];
	int aTypes[NUM_NAMES];
	int NumFrames = NUM_NAMES;

	// Should fail
	const char * aNamesBad[] = {"NOT_A_VALID_REGISTER_NAME", "SERIAL_NUMBER"};

	printf("Example that should work:\n");
	err = LJM_NamesToAddresses(NumFrames, aNames, aAddresses, aTypes);
	PrintNamesToAddressOutput(NumFrames, aNames, aAddresses, aTypes, err);
	printf("\n");

	printf("Example where the first name fails, so the first address becomes equal to LJM_INVALID_NAME_ADDRESS:\n");
	err = LJM_NamesToAddresses(NumFrames, aNamesBad, aAddresses, aTypes);
	PrintNamesToAddressOutput(NumFrames, aNamesBad, aAddresses, aTypes, err);
	printf("\n");

	printf("Example of dynamically allocated strings example:\n");
	DynamicallyAllocatedDemo();
	printf("\n");

	printf("Example of LJM_LookupConstantValue and LJM_LookupConstantName:\n");
	PrintRegisterConstantsExample();

	WaitForUserIfWindows();

	return LJME_NOERROR;
}

void DynamicallyAllocatedDemo()
{
	// Allocate the array to hold the strings
	enum { NUM_NAMES = 2 };
	char ** aNamesDyn = (char**) malloc(NUM_NAMES * sizeof(char*));

	int * aAddresses = (int*) malloc(NUM_NAMES * sizeof(int));
	int * aTypes = (int*) malloc(NUM_NAMES * sizeof(int));

	int err;

	// Allocate the strings
	// Make sure to malloc enough for the extra null-termination character
	aNamesDyn[0] = (char*) malloc(20 * sizeof(char));
	aNamesDyn[1] = (char*) malloc(20 * sizeof(char));

	// Not necessary, but keeps things safe
	memset(aNamesDyn[0], '\0', 20);
	memset(aNamesDyn[1], '\0', 20);

	// Copy the names to the string array
	strncpy(aNamesDyn[0], "DAC1", 20);
	strncpy(aNamesDyn[1], "FIRMWARE_VERSION", 20);

	err = LJM_NamesToAddresses(NUM_NAMES, (const char **)aNamesDyn,
		aAddresses, aTypes);
	PrintNamesToAddressOutput(NUM_NAMES, (const char **)aNamesDyn, aAddresses,
		aTypes, err);

	// Free the memory from malloc
	free(aTypes);
	free(aAddresses);
	free(aNamesDyn[0]);
	free(aNamesDyn[1]);
	free(aNamesDyn);
}

void PrintNamesToAddressOutput(int NumFrames, const char ** Names, int * aAddresses,
	int * aTypes, int err)
{
	int i;
	for (i=0; i<NumFrames; i++) {
		printf("%s - address: %d, type: %d\n", Names[i], aAddresses[i], aTypes[i]);
	}

	PrintErrorIfError(err, "   ");
}

void PrintRegisterConstantsExample()
{
	char * Scope = "WIFI_STATUS";
	char ConstantName[LJM_MAX_NAME_SIZE];
	double ConstantValue;
	int err;

	strncpy(ConstantName, "ASSOCIATED", LJM_MAX_NAME_SIZE);
	err = LJM_LookupConstantValue(Scope, ConstantName, &ConstantValue);
	ErrorCheck(err, "LJM_LookupConstantValue(%s, %s, ...)", Scope, ConstantName);
	printf("Scope: %s, ConstantName: %s  =>  ConstantValue: %.00f\n", Scope, ConstantName, ConstantValue);

	ConstantValue = 2901;
	err = LJM_LookupConstantName(Scope, ConstantValue, ConstantName);
	ErrorCheck(err, "LJM_LookupConstantName(%s, %f, ...)", Scope, ConstantValue);
	printf("Scope: %s, ConstantValue: %.00f  =>  ConstantName: %s\n", Scope, ConstantValue, ConstantName);
}
