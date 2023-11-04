#! /bin/bash

echo "Are you sure you want to install the LabJack provider on /usr/local/share/labjack? (y/n)"
read answer

if [ "$answer" != "${answer#[Yy]}" ] ;then
    echo "Installing LabJack provider on /usr/local/share/labjack"
    sudo cp -r ./share/LabJack /usr/local/share/LabJack
    sudo chown -R :users /usr/local/share/LabJack
    echo "Done"
else
    echo "Exiting"
    exit 1
fi