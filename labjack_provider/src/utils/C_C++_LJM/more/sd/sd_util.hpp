/**
 * Name: sd_util.cpp
 * Desc: C++ header/source file that shows basic usage of the SD card system
 *       - Get disk info ()
 *       - List directory contents (takes an optional sd path param, defaults
 *       to the root dir)
 *       - Read single file (takes sd path param and local path param)
 *       - Delete single file (takes sd path param)
**/

#include <map>
#include <string>
#include <cstring>

#include <LabJackM.h>

#include "../../LJM_Utilities.h"

typedef struct {
    int size;
    int attributes;
} FileProperties;
typedef std::map<std::string, FileProperties> DirContents;

// This is defined in one place as a quick way to configure which device is
// opened for all of the scripts in the SD directory.
int OpenDevice(bool quiet = true);

// Prints how much free space is remaining, etc.
void PrintDiskInfo(int handle);

void ListDirContents(int handle, const char * = "/");

// Copies data from sdPath (must be absolute) to localPath
// (must be absolute path - local (computer) destination)
// Creates the destination file if it does not already exist
//     Input:
//         - handle - device handle
//         - sdPath - the absolute path of the file located on the SD card
//         - localPath - the absolute path of the destination file located on
//         the computer
void CopyFile(int handle, const char * sdPath, const char * localPath);

// Deletes the specified file from the SD card of the device.
//     Inputs:
//         - handle - device handle
//         - sdPath - absolute or relative path of the file to be deleted
void DeleteFile(int handle, const char * sdPath);

// Returns the path of the current working directory
// Caller must deallocate the returned C-string
const char * GetCurrentWorkingDirectory(int handle);

void GoToPath(int handle, const char * sdPath);

// Returns a map with the key value as the name of the file and the mapped
// value as a structure containing the size and attribute of the file
DirContents GetCurDirContents(int handle);

// Input: absolute path for a file
// Output: data within the file
// Caller must deallocate the returned C-string
const char * ReadFile(int handle, const char * sdPath);

int OpenDevice(bool quiet)
{
    // Open first found LabJack
    int handle = OpenOrDie(LJM_dtANY, LJM_ctANY, "LJM_idANY");
    // handle = OpenSOrDie("LJM_dtANY", "LJM_ctANY", "LJM_idANY");

    if (GetDeviceType(handle) == LJM_dtT4) {
        printf("The T4 does not support an SD card.\n");
        printf("Exiting now.\n");
        exit(1);
    }

    if (!quiet) {
        PrintDeviceInfoFromHandle(handle);
        GetAndPrint(handle, "FIRMWARE_VERSION");
        printf("\n");
    }
    return handle;
}

void PrintDiskInfo(int handle)
{
    double value;
    int err;

    // All disk parameters are captured when you read
    // FILE_IO_DISK_SECTOR_SIZE_BYTES
    err = LJM_eReadName(handle, "FILE_IO_DISK_SECTOR_SIZE_BYTES", &value);
    ErrorCheck(err, "eReadName(handle, FILE_IO_DISK_SECTOR_SIZE_BYTES)");
    int sectorSize = (int) value;

    err = LJM_eReadName(handle, "FILE_IO_DISK_SECTORS_PER_CLUSTER", &value);
    ErrorCheck(err, "eReadName(handle, FILE_IO_DISK_SECTORS_PER_CLUSTER)");
    int sectorsPerCluster = (int) value;

    err = LJM_eReadName(handle, "FILE_IO_DISK_TOTAL_CLUSTERS", &value);
    ErrorCheck(err, "eReadName(handle, FILE_IO_DISK_TOTAL_CLUSTERS)");
    int totalClusters = (int) value;

    err = LJM_eReadName(handle, "FILE_IO_DISK_FREE_CLUSTERS", &value);
    ErrorCheck(err, "eReadName(handle, FILE_IO_DISK_FREE_CLUSTERS)");
    int freeClusters = (int) value;

    // Total size = SECTOR_SIZE * SECTORS_PER_CLUSTER * TOTAL_CLUSTERS
    int totalSize = sectorSize * sectorsPerCluster * totalClusters;

    // Free size = SECTOR_SIZE * SECTORS_PER_CLUSTER * FREE_CLUSTERS
    int freeSize = (sectorSize * sectorsPerCluster * freeClusters);

    printf("%.3f megabytes free of %.3f total megabytes.\n",
        (double)freeSize / 1048576, (double)totalSize / 1048576);
}

void ListDirContents(int handle, const char * sdPath)
{
    // Save starting directory to later return here.
    const char * startingDirectory = GetCurrentWorkingDirectory(handle);

    // Navigate to specified/default directory
    GoToPath(handle, sdPath);

    // Get and print contents of the directory
    if (strcmp(sdPath, "/") == 0) {
        printf("Default Directory Contents:\n");
    }
    else {
        printf("%s Directory Contents:\n", sdPath);
    }
    // dir contains the contents of the directory
    DirContents dir = GetCurDirContents(handle);

    // Print results
    printf("%40.40s  %9.9s  %9s\n", "Name", "Type", "Size");
    for (DirContents::iterator it=dir.begin(); it!=dir.end(); ++it) {
        // Check 4 or 5 bit
        const char * type = "";
        // 1<<5 = 0b 0010 0000
        if (it->second.attributes & (1<<5)) {
            type = "File";
        }
        else {
            // 1<<4 = 0b 0001 0000
            if (it->second.attributes & (1<<4)) {
                type = "Folder";
            }
            else {
                type = "Other";
            }
        }
        printf("%40.40s  %9.9s", it->first.c_str(), type);
        if (strcmp(type, "File") == 0) {
            printf("  %9d bytes\n", it->second.size);
        }
        else {
            printf("\n");
        }
    }

    // Return to the starting directory
    GoToPath(handle, startingDirectory);

    delete [] startingDirectory;
}

void CopyFile(int handle, const char * sdPath, const char * localPath)
{
    // Get Data from SD Card
    const char * data = ReadFile(handle, sdPath);

    // Write Data to local
    FILE * fp;
    fp = fopen (localPath, "w+");

    if (fp == NULL) {
        printf("\nUnable to open the specified local file.\n");
    }
    else {
        fprintf(fp, "%s", data);
        printf("Copied data from %s to %s\n", sdPath, localPath);
    }
    fclose(fp);

    delete [] data;
}

void DeleteFile(int handle, const char * sdPath)
{
    int err;
    int errAddr = -1;

    // Add 1 for the null terminator
    int pathLen = strlen(sdPath) + 1;

    // 1) Write the length of the file name to FILE_IO_PATH_WRITE_LEN_BYTES
    err = LJM_eWriteName(handle, "FILE_IO_PATH_WRITE_LEN_BYTES", pathLen);
    ErrorCheck(err, "eWriteName(handle, FILE_IO_PATH_WRITE_LEN_BYTES)");

    // 2) Write the name to FILE_IO_PATH_WRITE (with null terminator)
    err = LJM_eWriteNameByteArray(handle, "FILE_IO_PATH_WRITE", pathLen,
        sdPath, &errAddr);
    ErrorCheck(err, "eWriteNameByteArray(handle, FILE_IO_PATH_WRITE)");

    printf("Deleting file at %s\n", sdPath);
    // 3) Write a value to FILE_IO_DELETE to delete the file at the specified
    // path
    err = LJM_eWriteName(handle, "FILE_IO_DELETE", 1);
    ErrorCheck(err, "eWriteName(handle, FILE_IO_DELETE, 1)");

    printf("Successfully deleted file.\n");
}

const char * GetCurrentWorkingDirectory(int handle)
{
    double value;
    int err;
    int errAddr = -1;

    // 1) Write a value of 1 to FILE_IO_DIR_CURRENT. The error returned
    // indicates whether there is a directory loaded as current. No error (0)
    // indicates a valid directory.
    err = LJM_eWriteName(handle, "FILE_IO_DIR_CURRENT", 1);
    ErrorCheck(err, "eWriteName(handle, FILE_IO_DIR_CURRENT)");

    // 2) Read  FILE_IO_PATH_READ_LEN_BYTES.
    err = LJM_eReadName(handle, "FILE_IO_PATH_READ_LEN_BYTES", &value);
    ErrorCheck(err, "LJM_eReadName(handle, FILE_IO_PATH_READ_LEN_BYTES)");
    int cwdNameLen = int(value);

    // 3) Read an array of size FILE_IO_PATH_READ_LEN_BYTES from
    // FILE_IO_NAME_READ.
    char * cwdNameAsBytes = new char[cwdNameLen];
    err = LJM_eReadNameByteArray(handle, "FILE_IO_PATH_READ", cwdNameLen,
        cwdNameAsBytes, &errAddr);

    return cwdNameAsBytes;
}

void GoToPath(int handle, const char * sdPath)
{
    int err;
    int errAddr = -1;

    // Add 1 for null terminator
    int pathLen = strlen(sdPath) + 1;

    // 1) Write the length of the file name to FILE_IO_PATH_WRITE_LEN_BYTES
    err = LJM_eWriteName(handle, "FILE_IO_PATH_WRITE_LEN_BYTES", pathLen);
    ErrorCheck(err, "eWriteName(handle, FILE_IO_PATH_WRITE_LEN_BYTES)");

    // 2) Write the directory string (converted to an array of bytes, with null
    // terminator) to FILE_IO_PATH_WRITE.  (array size = length from step 2)
    err = LJM_eWriteNameByteArray(handle, "FILE_IO_PATH_WRITE", pathLen,
        sdPath, &errAddr);
    ErrorCheck(err, "eWriteNameByteArray(handle, FILE_IO_PATH_WRITE)");

    // 3) Write a value of 1 to FILE_IO_DIR_CHANGE.
    err = LJM_eWriteName(handle, "FILE_IO_DIR_CHANGE", 1);
    ErrorCheck(err, "eWriteName(handle, FILE_IO_DIR_CHANGE)");
}

DirContents GetCurDirContents(int handle)
{
    double value;
    int err;
    int errAddr = -1;

    // 1) Write a value of 1 to FILE_IO_DIR_FIRST. The error returned indicates
    // whether anything was found.
    // No error (0) indicates that something was found.
    // FILE_IO_NOT_FOUND (2960) indicates that nothing was found.
    err = LJM_eWriteName(handle, "FILE_IO_DIR_FIRST", 1);
    ErrorCheck(err, "eWriteName(handle, FILE_IO_DIR_FIRST)");

    DirContents dir;

    // Loop, reading name and properties of one file per iteration
    bool noMoreFiles = false;
    while (!noMoreFiles) {
        // 2) Read FILE_IO_PATH_READ_LEN_BYTES, FILE_IO_ATTRIBUTES, and
        // FILE_IO_SIZE. Store the attributes and size associated with each
        // file.
        err = LJM_eReadName(handle, "FILE_IO_PATH_READ_LEN_BYTES", &value);
        ErrorCheck(err, "LJM_eReadName(handle, FILE_IO_PATH_READ_LEN_BYTES)");
        int fileNameLen = int(value);

        err = LJM_eReadName(handle, "FILE_IO_ATTRIBUTES", &value);
        ErrorCheck(err, "LJM_eReadName(handle, FILE_IO_ATTRIBUTES)");
        int fileType = int(value);

        err = LJM_eReadName(handle, "FILE_IO_SIZE_BYTES", &value);
        ErrorCheck(err, "LJM_eReadName(handle, FILE_IO_SIZE_BYTES)");
        int fileSize = int(value);

        // 3) Read an array from FILE_IO_NAME_READ of size
        // FILE_IO_PATH_READ_LEN_BYTES. This is the name of the file/folder.
        char * fileNameAsBytes = new char[fileNameLen];
        err = LJM_eReadNameByteArray(handle, "FILE_IO_PATH_READ",
            fileNameLen, fileNameAsBytes, &errAddr);
        ErrorCheck(err, "LJM_eReadNameByteArray(handle, FILE_IO_PATH_READ)");

        // Add to list
        FileProperties fileprops;
        fileprops.size = fileSize;
        fileprops.attributes = fileType;
        dir[fileNameAsBytes] = fileprops;

        delete [] fileNameAsBytes;

        // 4) Write a value of 1 to FILE_IO_DIR_NEXT. The error returned
        // indicates whether anything was found. No error (0) indicates that
        // there are more items -> go back to step 2.
        // FILE_IO_INVALID_OBJECT (2809) and potentially error code
        // FILE_IO_NOT_FOUND (2960) indicates that there are no more items.
        err = LJM_eWriteName(handle, "FILE_IO_DIR_NEXT", 1);
        if (
            err == 2966 // FILE_IO_END_OF_CWD
            || err == 2960 // FILE_IO_NOT_FOUND
            || err == 2809 // FILE_IO_INVALID_OBJECT
        ) {
            noMoreFiles = true;
        }
        else if (err != LJME_NOERROR) {
            ErrorCheck(err, "eWriteName(handle, FILE_IO_DIR_NEXT)");
        }
    }

    return dir;
}

const char * ReadFile(int handle, const char * sdPath)
{
    int err;
    int errAddr = -1;

    // Get the file size for use in step 4.
    int fileSize = 0;

    int pathLen = strlen(sdPath) + 1;
    int idx = -1;

    // Separate the path and filename
    for (int i = pathLen-1; i >= 0; i--) {
        if (sdPath[i] == '/') {
            idx = i;
            break;
        }
    }
    if (idx == -1) {
        printf("Error: path must be absolute\n");
        exit(1);
    }

    char * path = new char[idx+1];
    char * file = new char[pathLen-idx];
    if (idx == 0) {
        strncpy(path, "/\0", 2);
        strncpy(file, sdPath+1, pathLen-1);
        file[pathLen-1] = '\0';
    }
    else {
        strncpy(path, sdPath, idx);
        path[idx] = '\0';
        strncpy(file, sdPath+idx+1, pathLen-idx-1);
        file[pathLen-idx-1] = '\0';
    }

    // Navigate to the appropriate directory
    GoToPath(handle, path);

    DirContents dir = GetCurDirContents(handle);

    // Get fileSize from the directory contents
    for (DirContents::iterator it=dir.begin(); it!=dir.end(); ++it) {
        if (it->first.compare(file) == 0) {
            fileSize = it->second.size;
            break;
        }
    }
    if (fileSize == 0) {
        printf("Error: file not found\n");
        exit(1);
    }

    // Add 1 for the null terminator
    int fileNameLen = strlen(file) + 1;

    // 1) Write the length of the file name to FILE_IO_PATH_WRITE_LEN_BYTES
    err = LJM_eWriteName(handle, "FILE_IO_PATH_WRITE_LEN_BYTES",
        fileNameLen);
    ErrorCheck(err, "eWriteName(handle, FILE_IO_PATH_WRITE_LEN_BYTES)");

    // 2) Write the name to FILE_IO_PATH_WRITE (with null terminator)
    err = LJM_eWriteNameByteArray(handle, "FILE_IO_PATH_WRITE", fileNameLen,
        file, &errAddr);
    ErrorCheck(err, "eWriteNameByteArray(handle, FILE_IO_PATH_WRITE)");

    // 3) Write any value to FILE_IO_OPEN
    err = LJM_eWriteName(handle, "FILE_IO_OPEN", 1);
    ErrorCheck(err, "LJM_eWriteName(handle, FILE_IO_OPEN)");

    // 4) Read file data from FILE_IO_READ (using the size from dirContents)
    char * fileDataAsBytes = new char[fileSize + 1];
    fileDataAsBytes[fileSize] = '\0';
    err = LJM_eReadNameByteArray(handle, "FILE_IO_READ", fileSize,
        fileDataAsBytes, &errAddr);
    ErrorCheck(err, "LJM_eReadNameByteArray(handle, FILE_IO_READ)");

    // 5) Write a value of 1 to FILE_IO_CLOSE
    err = LJM_eWriteName(handle, "FILE_IO_CLOSE", 1);
    ErrorCheck(err, "eWriteName(handle, FILE_IO_CLOSE)");

    delete [] file;
    delete [] path;

    return fileDataAsBytes;
}
