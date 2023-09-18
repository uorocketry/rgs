/**
 * Name: error.c
 * Desc: Demonstrates LJM_ErrorToString
**/

#include <stdio.h>
#include <LabJackM.h>

#include "../../LJM_Utilities.h"

void PrintErrorToString(int err)
{
	char errName[LJM_MAX_NAME_SIZE];
	LJM_ErrorToString(err, errName);
	printf("LJM_ErrorToString(%d) returned %s\n", err, errName);
}

int main()
{
	printf("Manual values:\n");
	PrintErrorToString(0);
	PrintErrorToString(LJME_CONSTANTS_FILE_NOT_FOUND);
	PrintErrorToString(LJME_INVALID_CONSTANTS_FILE);
	PrintErrorToString(LJME_TRANSACTION_ID_ERR);
	PrintErrorToString(LJME_WARNINGS_BEGIN);
	PrintErrorToString(LJME_U3_NOT_SUPPORTED_BY_LJM);
	PrintErrorToString(199); // non-existent error
	PrintErrorToString(2330); // T7 error

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
