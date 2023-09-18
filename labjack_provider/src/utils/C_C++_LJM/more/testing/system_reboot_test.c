/**
 * Name: system_reboot_test.c
 * Desc: Test writing to SYSTEM_REBOOT.
**/

#include <stdio.h>
#include <string.h>

#include <LabJackM.h>

#include "../../LJM_Utilities.h"

int main()
{
	int err;
	int handle;
	double val;
	int hitReconnectError = 0;

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);

	GetAndPrint(handle, "AIN0");

	printf("SYSTEM_REBOOT\n");
	WriteNameOrDie(handle, "SYSTEM_REBOOT", 0x4C4A0000);

	while (1) {
		printf(" . ");
		fflush(stdout);
		MillisecondSleep(100);

		err = LJM_eReadName(handle, "AIN0", &val);
		PrintErrorIfError(err, "AIN0");
		if (err == LJME_NOERROR) {
			printf("AIN0: %f\n", val);

			if (hitReconnectError == 1) {
				printf("Device has rebooted and is reconnected.\n");
				break;
			}
		}
		else if (err == LJME_RECONNECT_FAILED) {
			hitReconnectError = 1;
		}
	}

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
