/**
 * Name: thermocouple_example.c
 * Desc: Demonstrates using LJM_TCVoltsToTemp, based on
 *       https://labjack.com/support/app-notes/thermocouples
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
	double TCVolts, CJTempK, TCTempK, TempC, TempF;
	int err, handle, i;
	const double CJ_TEMP_CORRECTION = 3.0;

	printf("This program expects a type K thermocouple connected to the AIN0 and GND screw terminals\n\n");

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);

	// Set the resolution index to the highest available
	err = LJM_eWriteName(handle, "AIN0_RESOLUTION_INDEX", 0);
	ErrorCheck(err, "Setting AIN0 to default resolution index");

	// Set the range to 0.1
	err = LJM_eWriteName(handle, "AIN0_RANGE", 0.1);
	ErrorCheck(err, "Setting AIN0 to the 0.1 range");

	printf("\nPress ctrl + c to stop\n");
	for (i=0; ; i++) {
		err = LJM_eReadName(handle, "AIN0", &TCVolts);
		ErrorCheck(err, "Reading AIN0");

		err = LJM_eReadName(handle, "AIN14", &CJTempK);
		ErrorCheck(err, "Reading AIN14");

		err = LJM_TCVoltsToTemp(LJM_ttK, TCVolts, CJTempK + CJ_TEMP_CORRECTION, &TCTempK);
		ErrorCheck(err, "Calculating TCTempK");

		TempC = TCTempK-273.15;
		TempF = (1.8*TCTempK)-459.67;
		printf("TCVolts: %lf,\tCJTempK: %lf,\tTCTempK: %lf,\tdeg C: %lf,\tdeg F: %lf\n",
			TCVolts, CJTempK, TCTempK, TempC, TempF);

		MillisecondSleep(1000);
	}

	WaitForUserIfWindows();

	return LJME_NOERROR;
}
