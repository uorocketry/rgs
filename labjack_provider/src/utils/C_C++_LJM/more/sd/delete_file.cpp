#include "sd_util.hpp"

int main(int argc, const char * argv[])
{
    if (argc != 2) {
        printf("Usage: %s file_to_delete\n", argv[0]);
        exit(1);
    }

    int handle = OpenDevice();
    DeleteFile(handle, argv[1]);
    CloseOrDie(handle);

    WaitForUserIfWindows();

    return LJME_NOERROR;
}
