#include "sd_util.hpp"

int main(int argc, const char * argv[])
{
    if (argc != 1) {
        printf("No arguments allowed\n");
        printf("Usage: %s\n", argv[0]);
        exit(1);
    }

    int handle = OpenDevice();
    PrintDiskInfo(handle);
    CloseOrDie(handle);

    WaitForUserIfWindows();

    return LJME_NOERROR;
}
