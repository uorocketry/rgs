/**
 * Name: windows_dynamic_runtime_linking.c
 * Desc: Shows how to load LJM at runtime rather than at load time, only for
 *       machines running Windows.
 * Note: See Microsoft's "Using Run-Time Dynamic Linking":
 *       https://msdn.microsoft.com/en-us/library/windows/desktop/ms686944%28v=vs.85%29.aspx?f=255&MSPPError=-2147217396
**/

#include "Windows.h"

// For printf
#include <stdio.h>

// Because LabJackM is loaded (linked) dynamically at runtime, LabJackM.lib is
// not linked in Visual Studio's:
//   Properties -> Linker -> Input -> Additional Dependencies

// Note that #include<LabJackM.h> is not strictly required, but may be used for
// constants.

typedef int (__stdcall *OPENSFUNCTIONTYPE)(
	const char * DeviceType,
	const char * ConnectionType,
	const char * Identifier,
	int * Handle
);

typedef int (__stdcall *EREADNAMEFUNCTIONTYPE)(
	int Handle,
	int Address,
	double * Value
);

typedef int (__stdcall *CLOSEFUNCTIONTYPE) (int Handle);

void ErrorCheck(int err, const char * function)
{
	if (err != 0) {
		printf("Error on %s:  %d\n", function, err);
		printf("Press enter to continue\n");
		getchar();
		exit(err);
	}
}

int main()
{
	HINSTANCE hinstLib;
	OPENSFUNCTIONTYPE OpenSAddress;
	EREADNAMEFUNCTIONTYPE EReadNameAddress;
	CLOSEFUNCTIONTYPE CloseAddress;
	BOOL fRunTimeLinkSuccess = TRUE;
	int err, handle;
	const char * function;
	const char * NAME = "SERIAL_NUMBER";
	double value;

	// Get a handle to the LJM module.
	hinstLib = LoadLibrary(TEXT("LabJackM.dll"));

	// If the handle is valid, continue to get the function addresses.
	if (hinstLib != NULL) {

		function = "LJM_OpenS";
		OpenSAddress = (OPENSFUNCTIONTYPE) GetProcAddress(hinstLib, function);
		// If the function address is valid, call the function.
		if (NULL != OpenSAddress) {
			// Open first found LabJack
			err = (OpenSAddress) ("LJM_dtANY", "LJM_ctANY", "LJM_idANY", &handle);
			ErrorCheck(err, function);
		}
		else {
			fRunTimeLinkSuccess = FALSE;
		}

		function = "LJM_eReadName";
		EReadNameAddress = (EREADNAMEFUNCTIONTYPE) GetProcAddress(hinstLib,
																  function);
		if (NULL != EReadNameAddress) {
			err = (EReadNameAddress) (handle, NAME, &value);
			ErrorCheck(err, function);
			printf("\nLJM_eReadName result - %s: %f\n", NAME, value);
		}
		else {
			fRunTimeLinkSuccess = FALSE;
		}

		function = "LJM_Close";
		CloseAddress = (CLOSEFUNCTIONTYPE) GetProcAddress(hinstLib, function);
		if (NULL != CloseAddress) {
			err = (CloseAddress) (handle);
			ErrorCheck(err, function);
		}
		else {
			fRunTimeLinkSuccess = FALSE;
		}

		// Free the LJM module.
		FreeLibrary(hinstLib);
	}
	else {
		fRunTimeLinkSuccess = FALSE;
	}

	// If unable to call the LJM functions, print an error message.
	if (! fRunTimeLinkSuccess) {
		printf("Error finding at least one LJM function.\nPlease install LJM "
		       "at https://labjack.com/support/software/installers/ljm \n");
	}

	printf("Press enter to continue\n");
	getchar();
	return 0;
}
