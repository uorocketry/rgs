/**
 * Name: lua_script_basic.c
 * Desc: Loads a LUA script on a T7
**/

#ifdef _WIN32
	#include <winsock2.h>
	#include <ws2tcpip.h>
#else
	#include <arpa/inet.h>  // For inet_ntoa()
#endif
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

#include <LabJackM.h>

#include "../../LJM_Utilities.h"

void LoadLuaScript(int handle, const char * luaScript);

void ReadLuaInfo(int handle);

int main()
{
	int handle;

	// To place Lua scripts directly in a c-string:
	//   http://stackoverflow.com/questions/1135841/c-multiline-string-literal
	// Note that the new lines have to be manually inserted using \n
	const char * luaScript =
		"LJ.IntervalConfig(0, 1000)\n"
		"while true do\n"
		"  if LJ.CheckInterval(0) then\n"
		"    print(LJ.Tick())\n"
		"  end\n"
		"end\n"
		"\0";

	// Open first found LabJack
	handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
	// handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

	PrintDeviceInfoFromHandle(handle);
	GetAndPrint(handle, "FIRMWARE_VERSION");
	printf("\n");

	LoadLuaScript(handle, luaScript);

	GetAndPrint(handle, "LUA_RUN");
	GetAndPrint(handle, "LUA_DEBUG_NUM_BYTES");

	ReadLuaInfo(handle);

	CloseOrDie(handle);

	WaitForUserIfWindows();

	return LJME_NOERROR;
}

void LoadLuaScript(int handle, const char * luaScript)
{
	const unsigned scriptLength = strlen(luaScript) + 1;

	const char * LUA_SOURCE_WRITE = "LUA_SOURCE_WRITE";

	int ErrorAddress = INITIAL_ERR_ADDRESS;
	int err = 0;

	printf("Script length: %u\n", scriptLength);

	// LUA_RUN must be written to twice to disable a currently running script.
	WriteNameOrDie(handle, "LUA_RUN", 0);
	// Then, wait for the Lua VM to shut down. Some T7 firmware versions need
	// a longer time to shut down than others.
	MillisecondSleep(600);
	WriteNameOrDie(handle, "LUA_RUN", 0);

	WriteNameOrDie(handle, "LUA_SOURCE_SIZE", scriptLength);
	err = LJM_eWriteNameByteArray(
		handle,
		LUA_SOURCE_WRITE,
		scriptLength,
		luaScript,
		&ErrorAddress
	);
	ErrorCheckWithAddress(
		err,
		ErrorAddress,
		"LJM_eWriteNameByteArray(%d, %s, %d, ...",
		handle,
		LUA_SOURCE_WRITE,
		scriptLength
	);
	WriteNameOrDie(handle, "LUA_DEBUG_ENABLE", 1);
	WriteNameOrDie(handle, "LUA_DEBUG_ENABLE_DEFAULT", 1);
	WriteNameOrDie(handle, "LUA_RUN", 1);
}

void ReadLuaInfo(int handle)
{
	int i, byteIter, err;
	double numBytes;
	char * aBytes;
	int errorAddress;
	for (i = 0; i < 20; i++) {
		// The script sets the interval length with LJ.IntervalConfig.
		// Note that LJ.IntervalConfig has some jitter and that this program's
		// interval (set by MillisecondSleep) will have some minor drift from
		// LJ.IntervalConfig.
		MillisecondSleep(1000);

		GetAndPrint(handle, "LUA_RUN");
		numBytes = 0;
		err = LJM_eReadName(handle, "LUA_DEBUG_NUM_BYTES", &numBytes);
		ErrorCheck(err, "LJM_eReadName(%d, LUA_DEBUG_NUM_BYTES, ...)", handle);

		if ((int)numBytes == 0) {
			continue;
		}

		printf("LUA_DEBUG_NUM_BYTES: %d\n", (int)numBytes);

		aBytes = malloc(sizeof(char) * (int)numBytes);
		errorAddress = INITIAL_ERR_ADDRESS;
		err = LJM_eReadNameByteArray(
			handle,
			"LUA_DEBUG_DATA",
			numBytes,
			aBytes,
			&errorAddress
		);
		if (err == LJME_NOERROR) {
			printf("LUA_DEBUG_DATA: ");
			for (byteIter = 0; byteIter < numBytes; byteIter++) {
				printf("%c", aBytes[byteIter]);
			}
			printf("\n");
		}
		free(aBytes);
		ErrorCheck(err, "LJM_eReadNameByteArray(%d, LUA_DEBUG_DATA, ...", handle);
	}
}
