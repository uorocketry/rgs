#include "sd_util.hpp"

int main(int argc, const char * argv[])
{
    bool listRoot;
    if (argc == 1) {
        listRoot = true;
    }
    else if (argc == 2) {
        listRoot = false;
    }
    else {
        printf("Usage: %s [directory]\n", argv[0]);
        exit(1);
    }

    int handle = OpenDevice();
    const char * dirToRead;
    if (listRoot) {
        dirToRead = GetCurrentWorkingDirectory(handle);
    }
    else {
        dirToRead = argv[1];
    }
    ListDirContents(handle, dirToRead);
    CloseOrDie(handle);

    WaitForUserIfWindows();

    return LJME_NOERROR;
}
