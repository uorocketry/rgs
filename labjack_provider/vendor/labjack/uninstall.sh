#! /bin/bash

echo "Are you sure you want to uninstall the LabJack provider on /usr/local/share/labjack? (y/n)"
read answer

if [ "$answer" != "${answer#[Yy]}" ] ;then
    echo "Uninstalling LabJack provider on /usr/local/share/labjack"
    sudo rm -rf /usr/local/share/LabJack
    echo "Done"
else
    echo "Exiting"
    exit 1
fi