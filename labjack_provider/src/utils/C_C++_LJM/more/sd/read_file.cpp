#include "sd_util.hpp"

int main(int argc, const char * argv[])
{
    if (argc != 2) {
        printf("Usage: %s file_to_read\n", argv[0]);
        exit(1);
    }

    int handle = OpenDevice();
    const char * fileContents = ReadFile(handle, argv[1]);
    printf("%s\n", fileContents);
    delete [] fileContents;

    CloseOrDie(handle);

    WaitForUserIfWindows();

    return LJME_NOERROR;
}
