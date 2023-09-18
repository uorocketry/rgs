/**
 * Name: 1-wire.c
 * Desc: Demonstrates 1-Wire communication with a DS1822 sensor using the LJM
 *       driver.
 *       - Searches for and displays the ROM ID and path of the any
 *         connected 1-Wire device on EIO0.
 *       - Then, (see section "DS1822 sensor - Read temperature") reads
 *         temperature from a DS1822 sensor.
**/

#include <stdio.h>

// The LJM driver
#include <LabJackM.h>

// For LabJackM helper functions, such as OpenOrDie, PrintDeviceInfoFromHandle,
// ErrorCheck, etc.
#include "../../LJM_Utilities.h"

/**
 * Desc: Perform a 1-Wire operation.
 *       Outputs the ROM ID via romH and romL,
 *       outputs the path via pathH and pathL.
 *       Also outputs received data via rxData if rxData is not the null
 *       pointer.
 *
 * Functions:
 *      Search 0xF0
 *      Skip   0xCC
 *      Match  0x55
 *      Read   0x33
 *
 * Searching for a 1-Wire Probe ROM Id:
 * 1. Configure SENS channel,
 *      0: FIO0
 *      1: FIO1
 *      8: EIO0
 *      9: EIO1
 *     10: EIO2
 *     11: EIO3
 *     12: EIO4
 *     13: EIO5
 *     14: EIO6
 *     15: EIO7
 *      etc.
 * 2. Set the `function` parameter to 0xF0
 * 3. Run the program.
 * 4. "ONEWIRE_ROM_BRANCHS_FOUND_H" reports the upper bytes and
 *    "ONEWIRE_ROM_BRANCHS_FOUND_L" reports the lower bytes of the 1-wire chip
 *    ID.
**/
void oneWire(
    int handle,
    double sens,
    double dpu,
    double options,
    double function,
    double numTx,
    double numRx,
    double * romH,
    double * romL,
    double * pathH,
    double * pathL,
    const char * txData,
    char * rxData
);

/**
 * Desc: Performs a read and displays the results in hex. Returns the read
 *       values via aValues. aValues must be NumFrames or larger in size.
**/
void ReadAndPrintResults(int handle, int NumFrames, const char * aNames[],
    double * aValues);

/**
 * Desc: Reads and prints bytes from device. Outputs those bytes via rxData,
 *       unless rxData is the null pointer, in which case this function only
 *       prints bytes from device. If rxData is not the null pointer, it must be
 *       numBytesRx or greater in size.
**/
void ReadAndPrintRx(int handle, const char * nameRx, int numBytesRx,
    char * rxData);

int main()
{
    int handle;

    // Default: sens = 8 and function 0xF0 searches on EIO0
    double sens     = 8;
    double dpu      = 0.0;
    double options  = 0.0;
    double function = 0xF0;
    double numTx    = 0.0;
    double numRx    = 0.0;
    double romH     = 0.0;
    double romL     = 0.0;
    double pathH    = 0.0;
    double pathL    = 0.0;
    const char * txData = NULL;

    // Variable declarations for DS1822 sensor temperature read
    const char txDataDS1822_startBinary[] = {0x44};
    const char txDataDS1822_readBinaryTemperature[] = {0xBE};
    enum { rxNumBytesDS1822 = 2 };
    char rxDataDS1822[rxNumBytesDS1822];
    unsigned int temp = 0;
    double temperatureDS1822 = 0;

    // Open first found LabJack
    handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
    // handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

    PrintDeviceInfoFromHandle(handle);
    printf("\n");

    oneWire(
        handle,
        sens,
        dpu,
        options,
        function,
        numTx,
        numRx,
        &romH,
        &romL,
        &pathH,
        &pathL,
        txData,
        NULL
    );

    // DS1822 sensor - Read temperature.
    // See: https://labjack.com/support/datasheets/t-series/digital-io/1-wire
    printf("DS1822 sensor - Set up binary temperature read\n");
    oneWire(
        handle,
        sens,
        dpu,
        options,
        0x55,
        1,
        0,
        &romH,
        &romL,
        &pathH,
        &pathL,
        txDataDS1822_startBinary,
        NULL
    );
    printf("DS1822 sensor - Read binary temperature\n");
    oneWire(
        handle,
        sens,
        dpu,
        options,
        0x55,
        1,
        rxNumBytesDS1822,
        &romH,
        &romL,
        &pathH,
        &pathL,
        txDataDS1822_readBinaryTemperature,
        rxDataDS1822
    );
    temp = ((unsigned char)rxDataDS1822[0]) +
           ((unsigned char)rxDataDS1822[1] << 8);
    temperatureDS1822 = (int)temp * 0.0625;
    printf("DS1822 temperature: %f C\n", temperatureDS1822);
    if (temp == 0x0550) {
        printf("The DS1822 power on reset value of the temperature register is 85 C.\n");
        printf("Read again get the real temperature.\n");
    }

    CloseOrDie(handle);

    WaitForUserIfWindows();

    return LJME_NOERROR;
}

void ReadAndPrintResults(int handle, int NumFrames, const char * aNames[],
    double * aValues)
{
    int err;
    int errorAddress = INITIAL_ERR_ADDRESS;
    int frameI;

    err = LJM_eReadNames(handle, NumFrames, aNames, aValues, &errorAddress);
    PrintErrorWithAddressIfError(err, errorAddress,
        "LJM_eReadNames(Handle=%d, NumFrames=%d, aNames=[%s, ...], ...)",
        handle, NumFrames, aNames[0]);
    printf("LJM_eReadNames:\n");
    for (frameI = 0; frameI < NumFrames; frameI++) {
        printf("  %s: 0x%x\n", aNames[frameI], (unsigned int)(aValues[frameI]));
    }
}

void ReadAndPrintRx(int handle, const char * nameRx, int numBytesRx,
    char * rxData)
{
    int byteI;
    char * aBytesRx = rxData;
    if (rxData == NULL) {
        aBytesRx = malloc(sizeof(char) * numBytesRx);
    }
    ReadNameByteArrayOrDie(handle, nameRx, numBytesRx, (char *)aBytesRx);
    printf("%s:\n", nameRx);
    for (byteI = 0; byteI < numBytesRx; byteI++) {
        printf("  0x%x\n", (unsigned char)(aBytesRx[byteI]));
    }
    if (rxData == NULL) {
        free(aBytesRx);
    }
}

void oneWire(
    int handle,
    double sens,
    double dpu,
    double options,
    double function,
    double numTx,
    double numRx,
    double * romH,
    double * romL,
    double * pathH,
    double * pathL,
    const char * txData,
    char * rxData
) {
    enum { NumFramesConfig = 10 };
    const char * aNamesConfig[NumFramesConfig] = {
        "ONEWIRE_DQ_DIONUM",
        "ONEWIRE_DPU_DIONUM",
        "ONEWIRE_OPTIONS",
        "ONEWIRE_FUNCTION",
        "ONEWIRE_NUM_BYTES_TX",
        "ONEWIRE_NUM_BYTES_RX",
        "ONEWIRE_ROM_MATCH_H",
        "ONEWIRE_ROM_MATCH_L",
        "ONEWIRE_PATH_H",
        "ONEWIRE_PATH_L"
    };
    const double aValuesConfig[NumFramesConfig] = {
        sens,
        dpu,
        options,
        function,
        numTx,
        numRx,
        *romH,
        *romL,
        *pathH,
        *pathL
    };

    enum { NumFramesResult = 4 };
    const char * aNamesResult[NumFramesResult] = {
        "ONEWIRE_SEARCH_RESULT_H",
        "ONEWIRE_SEARCH_RESULT_L",
        "ONEWIRE_ROM_BRANCHS_FOUND_H",
        "ONEWIRE_ROM_BRANCHS_FOUND_L"
    };
    double aValuesResult[NumFramesResult];

    WriteNamesOrDie(handle, NumFramesConfig, aNamesConfig, aValuesConfig);

    if (numTx > 0) {
        WriteNameByteArrayOrDie(handle, "ONEWIRE_DATA_TX", numTx, (char *)txData);
    }

    WriteNameOrDie(handle, "ONEWIRE_GO", 1);

    ReadAndPrintResults(handle, NumFramesResult, aNamesResult, aValuesResult);
    *romH = aValuesResult[0];
    *romL = aValuesResult[1];
    *pathH = aValuesResult[2];
    *pathL = aValuesResult[3];

    if (numRx > 0) {
        ReadAndPrintRx(handle, "ONEWIRE_DATA_RX", numRx, rxData);
    }
}
