#include "sd_util.hpp"

int main(int argc, const char * argv[])
{
    if (argc != 2) {
        printf("Usage: %s directory\n", argv[0]);
        exit(1);
    }

    int handle = OpenDevice();
    GoToPath(handle, argv[1]);
    CloseOrDie(handle);

    WaitForUserIfWindows();

    return LJME_NOERROR;
}
