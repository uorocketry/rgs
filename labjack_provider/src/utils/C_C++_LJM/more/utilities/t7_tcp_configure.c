/**
 * Name: tcp_configure.c
 * Desc: Configures a LabJack's TCP connectivity via a USB connection,
 *       then performs some basic reads and writes via a TCP connection
**/

#ifdef _WIN32
	#include <Winsock2.h>
	#include <ws2tcpip.h>
#else
	#include <arpa/inet.h>  // For inet_ntoa()
#endif

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include "../../LJM_Utilities.h"
#include <LabJackM.h>

// Additional Ethernet config registers
#define MA_ETH_NUM502      49111
#define MA_ETH_DEF_NUM502  49161
#define DESIRED_NUM502 2

// WiFi statuses
// (some of these are commented out to prevent unused variable warnings)
static const int ASSOCIATED = 2900;
// static const int ASSOCIATING = 2901;
static const int ASSOCIATION_FAILED = 2902;
// static const int UNPOWERED = 2903;
// static const int BOOTING = 2904;
static const int START_FAILED = 2905;
// static const int APPLYING_SETTINGS = 2906;
// static const int DHCP_STARTED = 2907;
// static const int OTHER = 2909;
// static const int CONFIGURING = 2920;
// static const int UPGRADING = 2921;
// static const int REBOOTING = 2923;
static const int UPGRADE_SUCCESS = 2924;
static const int UPGRADE_FAILED = 2925;


// Sets device Ethernet to a static IP or enables DHCP and sets argIP to the resulting IP
void SetEthernetViaUSB(char * argIP);

/**
 * Name: SetWifiViaUSB
 * Desc: Configures WIFI for the first T7 found connected via USB
 * Para: NewIP, Sets the IP address of the device to be static if this is
 *           non-NULL. Otherwise, if NewIP is NULL, the device is set to
 *           a DHCP IP address
 *       SSID, the name of the network the device should connect to
 *       PASS, the password of the network
 *       WifiVersion, the WifiVersion to upgrade to. 0.0 is do-not-upgrade
**/
void SetWifiViaUSB(char * NewIP, const char * SSID, const char * PASS, float WifiVersion);

/**
 * Desc: Writes the SSID and PASS to the device and initiates the associate/join process,
 *       printing any errors
**/
void AssociateToNetwork(int handle, const char * SSID, const char * PASS);

// Helper for SetWifiViaUSB. Sets the IP address of the device to be static
void SetStaticWifiIP(const char * NewIP, int handle);

// Reads the firmware, does some simple writes and reads
// and displays the results
void BasicWritesReadsViaTCP(const char * IPAddress);

void Usage();

const int IP_INDEX = 1;
const int CONN_INDEX = 2;
const int SSID_INDEX = 3;
const int PASS_INDEX = 4;

const char * ETH_FLAG = "--ethernet";
const char * ETH_ALIAS = "-e";
const char * WIFI_FLAG = "--wifi";
const char * WIFI_ALIAS = "-w";
const char * TEST_FLAG = "--test";
const char * TEST_ALIAS = "-t";
const char * SSID_FLAG = "--ssid";
const char * SSID_ALIAS = "-s";
const char * PASS_FLAG = "--pass";
const char * PASS_ALIAS = "-p";
const char * HELP_FLAG = "--help";
const char * HELP_ALIAS = "-h";
const char * ADDR_FLAG = "--address";
const char * ADDR_ALIAS = "-a";
const char * UPDATE_FLAG = "--wifi-update";
const char * UPDATE_ALIAS = "-u";

const int INVALID = -1;

const char * ProgramName;
const char * WIFI_IP_REGISTER = "WIFI_IP";
const char * DHCP = "DHCP";

const double GOOGLE_DNS = 0x08080808;
const double GOOGLE_ALTDNS = 0x08080404;

#ifndef TRUE
const int TRUE = 1;
#endif
#ifndef FALSE
const int FALSE = 0;
#endif

void CopyToIP(const char * input, char * outputIP)
{
	memset(outputIP, '\0', LJM_IPv4_STRING_SIZE);
	memcpy(outputIP, input, strlen(input));
}

int Equal(const char * arg0, const char * arg1)
{
	return strcmp(arg0, arg1) == 0;
}

int BadToken(const char * arg)
{
	if (arg[0] == '-') {
		return TRUE;
	}

	return FALSE;
}

// Helper function to make a semi-intellegent guess at what the gateway shoud be, given an IP
unsigned int GuessGateway(unsigned int numericalIP)
{
	char gatewayString[LJM_IPv4_STRING_SIZE];
	int err;

	unsigned int gateway = numericalIP & 0xFFFFFF00;
	gateway += 0x1;
	err = LJM_NumberToIP(gateway, gatewayString);
	ErrorCheck(err, "LJM_IPToNumber getting gateway");
	printf("Making a guess at what the gateway should be: %s\n", gatewayString);
	// TODO: Accept a Gateway param and/or set to a more intelligent value!

	return gateway;
}

int main(int argc, char * argv[])
{
	// Process user input
	int connType = INVALID;
	int i;

	char IPAddress[LJM_IPv4_STRING_SIZE];
	char * SSID = NULL;
	char * PASS = NULL;
	int test = FALSE;

	float WifiUpdate = 0.0;

	char * arg;
	ProgramName = argv[0];

	// Set default IP to DHCP
	CopyToIP(DHCP, IPAddress);

	// Make sure the config flags are not overlapping
	if (INVALID == LJM_ctETHERNET || INVALID == LJM_ctWIFI) {
		printf("Error: Please change INVALID (%d) to not overlap the other flags", INVALID);
	}

	// Parse input/flags
	for (i=1; i<argc; i++) {
		arg = argv[i];

		// IP flag
		if (Equal(arg, ADDR_FLAG) || Equal(arg, ADDR_ALIAS)) {
			if (BadToken(argv[i+1])) {
				printf("%s: Error next argument to %s/%s must be a static IPv4 address or %s. ",
					ProgramName, ADDR_FLAG, ADDR_ALIAS, DHCP);
				printf("Argument was: %s\n", argv[i+1]);
				Usage();
			}

			CopyToIP(argv[++i], IPAddress);
		}

		// Wifi Update
		else if (Equal(arg, UPDATE_FLAG) || Equal(arg, UPDATE_ALIAS)) {
			if (BadToken(argv[i+1])) {
				printf("%s: Error next argument to %s/%s must be a floating point version number. ",
					ProgramName, UPDATE_FLAG, UPDATE_ALIAS);
				printf("Argument was: %s\n", argv[i+1]);
				Usage();
			}

			WifiUpdate = atof(argv[++i]);
		}

		// Configuration types
		else if (Equal(arg, ETH_FLAG) || Equal(arg, ETH_ALIAS)) {
			connType = LJM_ctETHERNET;
		}
		else if (Equal(arg, WIFI_FLAG) || Equal(arg, WIFI_ALIAS)) {
			connType = LJM_ctWIFI;
		}

		// Test
		else if (Equal(arg, TEST_FLAG) || Equal(arg, TEST_ALIAS)) {
			test = TRUE;
		}

		// Network/Password
		else if (Equal(arg, SSID_FLAG) || Equal(arg, SSID_ALIAS)) {
			if (BadToken(argv[i+1])) {
				printf("%s: Error next argument to %s/%s must be SSID. Argument was: %s\n",
					ProgramName, SSID_FLAG, SSID_ALIAS, argv[i+1]);
				Usage();
			}
			if (SSID != NULL) {
				printf("%s: Cannot specify multiple SSID/network names", ProgramName);
				Usage();
			}
			SSID = argv[++i];
		}
		else if (Equal(arg, PASS_FLAG) || Equal(arg, PASS_ALIAS)) {
			if (BadToken(argv[i+1])) {
				printf("%s: Error next argument to %s/%s must be password. Argument was: %s\n",
					ProgramName, PASS_FLAG, PASS_ALIAS, argv[i+1]);
				Usage();
			}
			if (PASS != NULL) {
				printf("%s: Cannot specify multiple network passwords", ProgramName);
				Usage();
			}
			PASS = argv[++i];
		}

		// Help
		else if (Equal(arg, HELP_FLAG) || Equal(arg, HELP_ALIAS)) {
			printf("%s: A program to configure your T7 for TCP connections. Configures via USB connection.\n\n",
				ProgramName);
			Usage();
		}
		else {
			printf("%s: Unrecognized flag: %s\n", ProgramName, argv[i]);
			Usage();
		}
	} // end flag parsing

	// Validate input
	if (connType == INVALID && !(test && !Equal(IPAddress, DHCP))) {
		printf("%s: No configuration_type specified\n", ProgramName);
		Usage();
	}

	if (connType == LJM_ctWIFI && SSID == NULL) {
		printf("%s: WiFi network SSID not provided: ", ProgramName);
		if (SSID == NULL) {
			printf("SSID");
		}
		if (SSID == NULL && PASS == NULL) {
			printf(" and ");
		}
		if (PASS == NULL) {
			printf("password (TODO: Take password as invisible input)");
		}
		printf("\n");
		Usage();
	}

	// Begin!
	if (connType == LJM_ctETHERNET) {
		SetEthernetViaUSB(IPAddress);
	}
	if (connType == LJM_ctWIFI) {
		SetWifiViaUSB(IPAddress, SSID, PASS, WifiUpdate);
	}

	if (test) {
		printf("Testing IPAddress: %s\n", IPAddress);
		WaitForUser();
		BasicWritesReadsViaTCP(IPAddress);
	}

	WaitForUserIfWindows();

	return LJME_NOERROR;
}

void Usage(const char * errorDescription)
{
	printf("Usage:\n");
	printf("%s <configuration_type> [(%s | %s) ip_address] [wifi_network] [(%s | %s)]\n",
		ProgramName, ADDR_ALIAS, ADDR_FLAG, TEST_ALIAS, TEST_FLAG);
	printf("    [wifi_update]\n");
	printf("\n");
	printf("  configuration_type:\n");
	printf("    (%s | %s)\n        Configure the device to connect via ethernet\n", ETH_FLAG, ETH_ALIAS);
	printf("\n");
	printf("    (%s | %s)\n        Configure the device to connect via wifi.\n", WIFI_FLAG, WIFI_ALIAS);
	printf("        ssid and password must be supplied if configuration_type is WiFi\n");
	printf("        (see wifi_network)\n");
	printf("\n");
	printf("  (%s | %s)\n        Test configuration of the device\n", TEST_FLAG, TEST_ALIAS);
	printf("\n");
	printf("  (%s | %s) <ip_address>:\n", ADDR_FLAG, ADDR_ALIAS);
	printf("        ip_address can be:\n");
	printf("        1. static IPv4 address such as 192.168.0.207\n");
	printf("        2. the word (in uppercase) 'DHCP' to indicate that a dynamic address\n");
	printf("           will be used\n");
	printf("\n");
	printf("  wifi_network:\n");
	printf("    (%s | %s)\n        SSID/Network name (example: %s MyNetwork)\n", SSID_FLAG,
		SSID_ALIAS, SSID_ALIAS);
	printf("    (%s | %s)\n        Network password (example: %s MyPassword)\n", PASS_FLAG,
		PASS_ALIAS, PASS_ALIAS);
	printf("\n");
	printf("  wifi_update:\n");
	printf("    (%s | %s) <desired_firmware_version>\n", UPDATE_FLAG, UPDATE_ALIAS);
	printf("        Wifi firmware update. desired_firmware_version is a floating point\n");
	printf("        number such as 1.23\n");
	printf("\n");

	WaitForUserIfWindows();
	exit(1);
}

void SetEthernetStatic(int handle, const char * StaticIP)
{
	int err;
	int errAddress = INITIAL_ERR_ADDRESS;
	// const double HARDCODED_GATEWAY = 0xC0A80101; // 192.168.1.1
	const double SET_THIS_LATER = 0.0; // We need to declare everything in C before we can figure out
	// the numerical IP (for some compilers).

	// ConfigNames[i] corresponds to aConfigValues[i]
	int numFrames = 6;
	const char * ConfigNames[] = {
		"ETHERNET_IP_DEFAULT",
		"ETHERNET_SUBNET_DEFAULT",
		"ETHERNET_GATEWAY_DEFAULT",
		"ETHERNET_DNS_DEFAULT",
		"ETHERNET_ALTDNS_DEFAULT",
		"ETHERNET_DHCP_ENABLE_DEFAULT"
	};
	double aConfigValues[] = {SET_THIS_LATER, 0xFFFFFF00, SET_THIS_LATER, GOOGLE_DNS, GOOGLE_ALTDNS, 0.0};

	unsigned int numericalIP;
	unsigned int gateway;
	err = LJM_IPToNumber(StaticIP, &numericalIP);
	ErrorCheck(err, "LJM_IPToNumber");

	gateway = GuessGateway(numericalIP);

	// Set the SET_THIS_LATER values
	aConfigValues[0] = (double)numericalIP; // ETHERNET_IP_DEFAULT
	aConfigValues[2] = (double)gateway; // ETHERNET_GATEWAY_DEFAULT

	// Begin
	printf("Setting static IPv4: %s...\n", StaticIP);

	if (LJM_Log(9, "HEY!")) {
		printf("Log error\n");
	}
	err = LJM_eWriteNames(handle, numFrames, ConfigNames, aConfigValues, &errAddress);
	ErrorCheckWithAddress(err, errAddress, "Setting the configurations");

}

void SetEthernetDHCP(int handle, char * IPResult)
{
	int err;

	// Begin
	printf("Setting device to DHCP IP...\n");

	err = LJM_eWriteName(handle, "ETHERNET_DHCP_ENABLE_DEFAULT", 1.0);
	ErrorCheck(err, "Turning on DHCP");

	err = LJM_eWriteName(handle, "ETHERNET_DNS_DEFAULT", GOOGLE_DNS);
	ErrorCheck(err, "LJM_eWriteName: ETHERNET_DNS_DEFAULT");

	err = LJM_eWriteName(handle, "ETHERNET_ALTDNS_DEFAULT", GOOGLE_ALTDNS);
	ErrorCheck(err, "LJM_eWriteName: ETHERNET_ALTDNS_DEFAULT");
}

void SetEthernetViaUSB(char * argIP)
{
	int err = 0;
	int handle, i;
	double ip;
	const char * IP_REGISTER = "ETHERNET_IP";
	char ipString[LJM_IPv4_STRING_SIZE];
	char errString[LJM_MAX_NAME_SIZE];
	double value;

	err = LJM_OpenS("LJM_dtT7", "LJM_ctUSB", "LJM_idANY", &handle);
	ErrorCheck(err, "initial LJM_OpenS");

	// Get the device's IP address
	err = LJM_eReadName(handle, IP_REGISTER, &ip);
	ErrorCheck(err, "Reading IP address");

	if (Equal(argIP, DHCP)) {
		SetEthernetDHCP(handle, argIP);
	}
	else {
		SetEthernetStatic(handle, argIP);
	}

	// Checking additional settings...
	err = LJM_eReadAddress(handle, MA_ETH_DEF_NUM502, LJM_UINT16, &value);
	ErrorCheck(err, "Reading MA_ETH_DEF_NUM502");

	if ((int)value != DESIRED_NUM502) {
		printf("MA_ETH_DEF_NUM502 was %d,\n", (int)value);
		printf("Writing MA_ETH_DEF_NUM502 to be %d (to enable the 502 port)\n", DESIRED_NUM502);

		err = LJM_eWriteAddress(handle, MA_ETH_DEF_NUM502, LJM_UINT16, DESIRED_NUM502);
		ErrorCheck(err, "Setting MA_ETH_DEF_NUM502 to DESIRED_NUM502");
	}

	err = LJM_eReadName(handle, "POWER_ETHERNET_DEFAULT", &value);
	ErrorCheck(err, "Reading POWER_ETHERNET_DEFAULT");
	if (!value) {
		printf("POWER_ETHERNET_DEFAULT is currently %d.\n", (int)value);
		printf("You can set POWER_ETHERNET_DEFAULT to 1 to make your device power up Ethernet by default.\n");
	}

	// Restart Ethernet
	printf("Please wait while the device's Ethernet is restarted\n");
	err = LJM_eWriteName(handle, "POWER_ETHERNET", 0);
	ErrorCheck(err, "Turning POWER_ETHERNET off");
	MillisecondSleep(200);

	err = LJM_eWriteName(handle, "POWER_ETHERNET", 1);
	ErrorCheck(err, "Turning POWER_ETHERNET back on");
	// Although the start up time seems to take 2 seconds or less,
	// FW .9013 seems to take about 4 seconds to reliably start up and be connectable
	for (i=0; i<20; i++) {
		MillisecondSleep(200);
		printf(".");
		fflush(stdout);
	}
	printf("\n");

	// Checking the value we may have set earlier
	err = LJM_eReadAddress(handle, MA_ETH_NUM502, LJM_UINT16, &value);
	ErrorCheck(err, "Reading MA_ETH_NUM502");
	if ((int)value != DESIRED_NUM502) {
		printf("*** MA_ETH_NUM502 is %d ***\n", (int)value);
		printf("*** You may need to power cycle your device before Ethernet will work. ***\n");
	}

	err = LJM_eReadName(handle, "ETHERNET_IP", &ip);
	if (err != LJME_NOERROR) {
		LJM_ErrorToString(err, errString);
		printf("Error reading %s: %s (%d)\n", IP_REGISTER, errString, err);
		return;
	}

	err = LJM_NumberToIP((unsigned int)ip, ipString);
	ErrorCheck(err, "Converting ip from device to a string");
	printf("%s: %s\n", IP_REGISTER, ipString);

	if (Equal(argIP, DHCP)) {
		CopyToIP(ipString, argIP);
	}

	CloseOrDie(handle);
}

void SetStaticWifiIP(const char * NewIP, int handle)
{
	int err;
	double ip;
	int errAddress = INITIAL_ERR_ADDRESS;
	char ipString[LJM_IPv4_STRING_SIZE];

	const double SET_THIS_LATER = 0.0; // We need to declare everything in C before we can figure out
	// the numerical IP (for some compilers).

	// ConfigNames[i] corresponds to aConfigValues[i]
	int numFrames = 4;
	const char * ConfigNames[] = {
		"WIFI_IP_DEFAULT",
		"WIFI_SUBNET_DEFAULT",
		"WIFI_GATEWAY_DEFAULT",
		"WIFI_DHCP_ENABLE_DEFAULT"
	};
	double aConfigValues[] = {SET_THIS_LATER, 0xFFFFFF00, SET_THIS_LATER, 0};

	unsigned int numericalIP;
	unsigned int gateway;

	err = LJM_IPToNumber(NewIP, &numericalIP);
	ErrorCheck(err, "LJM_IPToNumber");

	gateway = GuessGateway(numericalIP);

	// Set the SET_THIS_LATER values
	aConfigValues[0] = (double)numericalIP;
	aConfigValues[2] = (double)gateway;

	// Begin
	printf("SetStaticWifiIP(%s) beginning...\n", NewIP);

	err = LJM_OpenS("LJM_dtT7", "LJM_ctUSB", "LJM_idANY", &handle);
	ErrorCheck(err, "initial LJM_OpenS");

	// Get the device's IP address
	err = LJM_eReadName(handle, WIFI_IP_REGISTER, &ip);
	ErrorCheck(err, "Reading IP address");

	// Print the device IP address
	err = LJM_NumberToIP((unsigned int)ip, ipString);
	ErrorCheck(err, "Converting ip from device to a string");
	printf("%s before writing new IP Address: %s\n", WIFI_IP_REGISTER, ipString);

	err = LJM_eWriteNames(handle, numFrames, ConfigNames, aConfigValues, &errAddress);
	ErrorCheckWithAddress(err, errAddress, "Setting the configurations");

}

void AssociateToNetwork(int handle, const char * SSID, const char * PASS)
{
	int err;
	double status;
	int i = 0;
	int ready = 0;

	// Set the SSID and password
	err = LJM_eWriteNameString(handle, "WIFI_SSID_DEFAULT", SSID);
	ErrorCheck(err, "Setting SSID");
	if (PASS != NULL) {
		err = LJM_eWriteNameString(handle, "WIFI_PASSWORD_DEFAULT", PASS);
		ErrorCheck(err, "Setting PASS");
	}

	// Apply changes
	err = LJM_eWriteName(handle, "WIFI_APPLY_SETTINGS", 1);
	ErrorCheck(err, "WIFI_APPLY_SETTINGS");

	printf("Please wait while the device attempts to join the %s network", SSID);
	fflush(stdout);

	// Join the network
	i = 0;
	ready = 0;
	while (!ready) {
		MillisecondSleep(1000);

		err = LJM_eReadName(handle, "WIFI_STATUS", &status);
		ErrorCheck(err, "Getting WIFI_STATUS");

		if ((int)status == ASSOCIATED) {
			ready = 1;
			break;
		}

		if ((int)status == START_FAILED) {
			fprintf(stderr, "\nStatus returned: %d. The Wifi module failed to start.\n",
				START_FAILED);
			fprintf(stderr, "Please check that you have connected to a T7-Pro device, as T7 non-Pro devices do not have Wifi capabilities.\n");
			GetAndPrint(handle, "WIFI_STATUS");
			GetAndPrint(handle, "WIFI_RSSI");
			exit(1);
		}

		if ((int)status == ASSOCIATION_FAILED) {
			fprintf(stderr, "\nWIFI_STATUS reports a failed association: %d\n", (int)status);
			fprintf(stderr, "Please check your SSID and password.\n");
			GetAndPrint(handle, "WIFI_STATUS");
			exit(1);
		}

		if (i > 60) {
			break;
		}
		++i;
		printf(".");
		fflush(stdout);
	}
	printf("\n");

	if (ready) {
		printf("Devices successfully associated with %s.\n", SSID);
	}
	else {
		printf("\nWarning! Either could not save the WIFI changes or could not join the network with the credentials supplied.\n");
		GetAndPrint(handle, "WIFI_STATUS");
		GetAndPrint(handle, "WIFI_RSSI");
		printf("Exiting\n");
		LJM_CloseAll();
		WaitForUserIfWindows();
		exit(1);
	}
}

void SetWifiViaUSB(char * NewIP, const char * SSID, const char * PASS, float WifiVersion)
{
	int err, handle;
	double ip, status;
	char ipString[LJM_IPv4_STRING_SIZE];
	char errString[LJM_MAX_NAME_SIZE];
	int i = 0;
	int ready = 0;

	err = LJM_OpenS("LJM_dtT7", "LJM_ctUSB", "LJM_idANY", &handle);
	ErrorCheck(err, "initial LJM_OpenS");

	GetAndPrint(handle, "WIFI_VERSION");
	GetAndPrint(handle, "WIFI_RSSI");

	if (!Equal(NewIP, DHCP)) {
		SetStaticWifiIP(NewIP, handle);
	}
	else {
		err = LJM_eWriteName(handle, "WIFI_DHCP_ENABLE_DEFAULT", 1);
		ErrorCheck(err, "Turning WIFI_DHCP_ENABLE_DEFAULT on");
	}

	err = LJM_eWriteName(handle, "POWER_WIFI", 1);
	ErrorCheck(err, "Turning POWER_WIFI back on");
	MillisecondSleep(100);

	AssociateToNetwork(handle, SSID, PASS);

	if (WifiVersion) {
		err = LJM_eWriteName(handle, "WIFI_FIRMWARE_UPDATE_TO_VERSIONX", WifiVersion);
		ErrorCheck(err, "WIFI_FIRMWARE_UPDATE_TO_VERSIONX, WifiVersion: %f", WifiVersion);

		printf("Please wait while the device updates to the %f Wifi firmware version", WifiVersion);
		fflush(stdout);

		ready = 0;
		i = 0;
		while (!ready) {
			err = LJM_eReadName(handle, "WIFI_FIRMWARE_UPDATE_STATUS", &status);
			ErrorCheck(err, "Error reading WIFI_IP_REGISTER: %s (%d)\n", errString, err);

			// Using == or != could give inaccurate results
			if (EqualFloats(status, UPGRADE_SUCCESS, 0.1)) {
				ready = 1;
				break;
			}

			if (EqualFloats(status, UPGRADE_FAILED, 0.1)) {
				fprintf(stderr,
					"\nWifi firmware update to version %f failed with WIFI_FIRMWARE_UPDATE_STATUS %d.\n",
					WifiVersion, UPGRADE_FAILED);
				fprintf(stderr, "Please check that the desired Wifi firmware version is available.\n");
				LJM_CloseAll();
				WaitForUserIfWindows();
				exit(1);
			}

			if (i > 30) {
				break;
			}
			++i;
			MillisecondSleep(1000);
			printf(".");
			fflush(stdout);
		}

		if (!ready) {
			fprintf(stderr, "\nFailed to upgrade the Wifi firmware in the given time.\n");
			GetAndPrint(handle, "WIFI_FIRMWARE_UPDATE_STATUS");
			GetAndPrint(handle, "WIFI_STATUS");
			GetAndPrint(handle, "WIFI_RSSI");
			LJM_CloseAll();
			WaitForUserIfWindows();
			exit(1);
		}

		printf("\nDevice reported success, reading back WIFI_VERSION");
		fflush(stdout);

		i = 0;
		status = 0;
		while ((int)status == 0 && i < 20) {
			MillisecondSleep(1000);
			printf(".");
			fflush(stdout);
			err = LJM_eReadName(handle, "WIFI_VERSION", &status);
			ErrorCheck(err, "Reading WIFI_VERSION");
			++i;
		}
		printf("\nWIFI_VERSION: %f\n", status);

		printf("Rejoining... ");
		AssociateToNetwork(handle, SSID, PASS);
	}

	printf("Reading new IP address");
	fflush(stdout);
	ip = 0.0;
	i = 0;
	ready = 0;
	// Sometimes it takes a few seconds for the WIFI_IP_REGISTER to initialize
	while (!ready) {
		err = LJM_eReadName(handle, WIFI_IP_REGISTER, &ip);
		if (err != LJME_NOERROR) {
			LJM_ErrorToString(err, errString);
			printf("Error reading %s: %s (%d)\n", WIFI_IP_REGISTER, errString, err);
			return;
		}

		// Check if ip address is not 0.0.0.0
		if (ip > 0.5 || ip < -0.5) {
			ready = 1;
			break;
		}

		if (i > 30) {
			break;
		}
		++i;
		MillisecondSleep(1000);
		printf(".");
		fflush(stdout);
	}
	printf("\n");

	err = LJM_NumberToIP((unsigned int)ip, ipString);
	ErrorCheck(err, "Converting ip from device to a string");
	printf("%s is now: %s\n", WIFI_IP_REGISTER, ipString);

	if (!ready && WifiVersion) {
		fprintf(stderr,
			"\nWarning: The new Wifi firmware version may not be compatible with the current T7 firmware.\n");
		err = LJM_eReadName(handle, "FIRMWARE_VERSION", &status);
		ErrorCheck(err, "Reading FIRMWARE_VERSION");
		fprintf(stderr, "FIRMWARE_VERSION: %f\n", status);
		WaitForUser();
	}

	if (!Equal(NewIP, DHCP) && !Equal(NewIP, ipString)) {
		printf("Error: IP address is %s, but should be %s\n", ipString, NewIP);
		WaitForUser();
	}
	else {
		CopyToIP(ipString, NewIP);
	}

	CloseOrDie(handle);
}

void BasicWritesReadsViaTCP(const char * IPAddress)
{
	int err = 0;
	int handle;
	double val, firmware, total;
	const double DAC_0_VALUE = 1.23;

	unsigned int i = 0;
	unsigned int timeStart, timeEnd;
	const unsigned int NUM_ITERATIONS = 100;

	printf("BasicWritesReadsViaTCP(%s) beginning...\n", IPAddress);

	// Open LabJack
	if (IPAddress == NULL || Equal(IPAddress, DHCP)) {
		printf("No IP address provided, trying for the first-found TCP T7\n");
		err = LJM_OpenS("LJM_dtT7", "LJM_ctTCP", "LJM_idANY", &handle);
	}
	else {
		err = LJM_OpenS("LJM_dtT7", "LJM_ctTCP", IPAddress, &handle);
		if (err) {
			char errorString[LJM_MAX_NAME_SIZE];
			LJM_ErrorToString(err, errorString);
			printf("First open failed: %s. Trying again.\n", errorString);
			err = LJM_OpenS("LJM_dtT7", "LJM_ctTCP", IPAddress, &handle);
		}
	}
	if (err) {
		printf("Test failure (try power-cycling the device):\n");
	}
	ErrorCheck(err, "LJM_OpenS by ip address");
	PrintDeviceInfoFromHandle(handle);

	// Read firmware version
	err = LJM_eReadName(handle, "FIRMWARE_VERSION", &firmware);
	ErrorCheck(err, "Reading firmware");

	printf("firmware version: %f\n", firmware);

	// Write to DAC0
	err = LJM_eWriteName(handle, "DAC0", DAC_0_VALUE);
	ErrorCheck(err, "Writing DAC_0_VALUE to DAC0");

	// Make sure POWER_AIN is on
	err = LJM_eReadName(handle, "POWER_AIN", &val);
	ErrorCheck(err, "Reading POWER_AIN");
	if ((int)val == 0) {
		printf("Turning Analog on..\n");
		err = LJM_eWriteName(handle, "POWER_AIN", 1);
		ErrorCheck(err, "Writing 1 to POWER_AIN");
	}

	// It's good to wait here, both for if POWER_AIN is turned on or for the DAC
	// to get set up.
	MillisecondSleep(50);

	printf("Connect success. Now doing %d reads.\n", NUM_ITERATIONS);
	WaitForUser();
	printf("Reading...\n");

	// Read AIN0
	total = 0;
	timeStart = GetCurrentTimeMS();
	for (i=0; i<NUM_ITERATIONS; i++) {
		err = LJM_eReadName(handle, "AIN0", &val);
		if (err) {
			timeEnd = GetCurrentTimeMS();
			printf("Failure after %d iterations over %d milliseconds\n", i, timeEnd - timeStart);
			LJM_CloseAll();
			exit(err);
		}
		total += val / NUM_ITERATIONS;

		if (i%500 == 0)
			printf("i: %d\n", i);
	}
	timeEnd = GetCurrentTimeMS();

	printf("Finished:\n\t%d iterations over approximately %d milliseconds\n", NUM_ITERATIONS, timeEnd - timeStart);
	printf("\t%u ms/packet\n\n", (timeEnd - timeStart)/NUM_ITERATIONS);

	// Print results
	printf("If you have a wire connected from DAC0 to AIN0, AIN0 should be ");
	printf("pretty close to %f.\n", DAC_0_VALUE);
	printf("The last AIN0: %f\n", val);
	printf("Approximate average AIN0: %f\n", total);

	CloseOrDie(handle);

	printf("\nSuccess.\n");
}
