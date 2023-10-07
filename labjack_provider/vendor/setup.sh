#! /bin/bash

set -e
set -u

# LJM version in a format like 1.14.2
LJM_VERSION="1.20.1"

LIB_DESTINATION=./lib
CONSTANTS_DESTINATION=./share
HEADER_DESTINATION=./include
PROGRAM_DESTINATION=./opt
BIN_DESTINATION=./bin

LJM_MAJOR_V=${LJM_VERSION%%.*}
LJM_LIB=libLabJackM.so
LJM_REALNAME=$LJM_LIB.$LJM_VERSION
LJM_SONAME=$LJM_LIB.$LJM_MAJOR_V
LJM_LINKERNAME=$LJM_LIB
LJM_HEADER="LabJackM.h"


# Rules
RULES=90-labjack.rules
OLD_RULES=10-labjack.rules
RULES_DEST_PRIMARY=./lib/udev/rules.d
RULES_DEST_ALTERNATE=./etc/udev/rules.d

LDCONFIG_FILE=./etc/ld.so.conf


TRUE="true"
FALSE="false"

# Assume these are unneeded until otherwise
NEED_RECONNECT=$FALSE
NEED_RESTART=$FALSE
NO_RULES=$FALSE
NO_RULES_ERR=2

REMOVE_EXTRACTED=$TRUE


# Function declarations


usage ()
{
	echo "$0 is a script which is typically embedded within a Makeself script. \
		Typically, the Makeself script is named labjack_ljm_installer.run or \
		LabJackM.run."
	echo
	echo "If the script you just invoked was not named $0, you can invoke with the \
		OPTIONS below by using the following usage, where SCRIPT is the name \
		of the script:"
	echo "  SCRIPT.run -- [OPTIONS]"
	echo
	echo "Otherwise, use the following usage:"
	echo "  $0 VERSION [OPTIONS]"
	echo
	echo "OPTIONS:"
	echo "  --restart-device-rules     Restart the udev device rules. (Default)"
	echo "  --no-restart-device-rules  Don't restart the udev device rules. This"
	echo "                             is useful for Docker containers."
	echo "  --remove-extracted         Remove the extracted folder. (Default)"
	echo "  --no-remove-extracted      Don't remove the extracted folder."
	exit 1
}

success ()
{
	echo

	cd ..
	if [ $REMOVE_EXTRACTED == $TRUE ]; then
		go rm -rf "./labjack_ljm_software"
	fi

	e=0
	echo "Install finished. Please check out the README for usage help."
	if [ $NEED_RECONNECT == $TRUE ]; then
		echo
		echo "If you have any LabJack devices connected, please disconnect and"
		echo "reconnect them now for device rule changes to take effect."
	fi
	if [ $NO_RULES == $TRUE ]; then
		echo
		echo "No udev rules directory found."
		echo "Searched for $RULES_DEST_PRIMARY, $RULES_DEST_ALTERNATE."
		echo "Please copy $RULES to your device rules directory and reload the rules"
		let e=e+$NO_RULES_ERR
	fi
	if [ $NEED_RESTART == $TRUE ]; then
		echo
		echo "Please manually restart the device rules or restart your computer now."
	fi
	exit $e
}

go ()
{
	$@
	ret=$?
	if [ $ret -ne 0 ]; then
		echo "Failure on command: $@"
		echo "Exiting"
		exit $ret
	fi
}

install_ljm_lib ()
{
	echo -n "Installing ${LJM_REALNAME} to ${LIB_DESTINATION}... "
	go install labjack_ljm/${LJM_REALNAME} ${LIB_DESTINATION}
	if [ -f ${LIB_DESTINATION}/${LJM_LINKERNAME} ]; then
		go rm -f ${LIB_DESTINATION}/${LJM_LINKERNAME}
	fi
	if [ -f ${LIB_DESTINATION}/${LJM_SONAME} ]; then
		go rm -f ${LIB_DESTINATION}/${LJM_SONAME}
	fi

	# Link
	go ln -s -f ${LIB_DESTINATION}/${LJM_REALNAME} ${LIB_DESTINATION}/${LJM_SONAME}
	go ln -s -f ${LIB_DESTINATION}/${LJM_SONAME} ${LIB_DESTINATION}/${LJM_LINKERNAME}
	echo "done."
}

install_ljm_header ()
{
	echo -n "Installing ${LJM_HEADER} to ${HEADER_DESTINATION}... "
	go install labjack_ljm/${LJM_HEADER} ${HEADER_DESTINATION}
	echo "done."
}

# Remove ljm_special_addresses.config or move it to ljm_specific_ips.config
deprecate_special_addresses()
{
    if [ -f "${CONSTANTS_DESTINATION}/LabJack/LJM/ljm_special_addresses.config" ]; then
        if [ `cat ${CONSTANTS_DESTINATION}/LabJack/LJM/ljm_specific_ips.config | wc -c` -gt 1 ]; then
            echo "[Deprecation warning] Removing deprecated file:"
            echo "        ${CONSTANTS_DESTINATION}/LabJack/LJM/ljm_special_addresses.config"
            echo "    Contents were:"
            cat ${CONSTANTS_DESTINATION}/LabJack/LJM/ljm_special_addresses.config
            echo
            echo
            rm -f ${CONSTANTS_DESTINATION}/LabJack/LJM/ljm_special_addresses.config
        else
            echo "[Deprecation warning] Moving:"
            echo "        ${CONSTANTS_DESTINATION}/LabJack/LJM/ljm_special_addresses.config"
            echo "    to:"
            echo "        ${CONSTANTS_DESTINATION}/LabJack/LJM/ljm_specific_ips.config"
            mv -f \
                ${CONSTANTS_DESTINATION}/LabJack/LJM/ljm_special_addresses.config \
                ${CONSTANTS_DESTINATION}/LabJack/LJM/ljm_specific_ips.config
        fi
    fi
}

install_auto_ips_file ()
{
	AIPS_FILE="${CONSTANTS_DESTINATION}/LabJack/LJM/ljm_auto_ips.json"
	if [ ! -f ${AIPS_FILE} ]; then
		echo '{"autoIPs":[]}' > ${AIPS_FILE}
	fi
	chmod a+rw ${AIPS_FILE}
}

install_ljm_constants ()
{
	echo -n "Installing constants files to ${CONSTANTS_DESTINATION}... "
	if [ ! -d ${CONSTANTS_DESTINATION}/LabJack/LJM ]; then
		go mkdir --mode=777 -p ${CONSTANTS_DESTINATION}/LabJack
		go mkdir --mode=777 -p ${CONSTANTS_DESTINATION}/LabJack/LJM
	fi
	chmod 777 ${CONSTANTS_DESTINATION}/LabJack
	chmod 777 ${CONSTANTS_DESTINATION}/LabJack/LJM

	go install labjack_ljm/LabJack/LJM/ljm_constants.json \
		-t ${CONSTANTS_DESTINATION}/LabJack/LJM
	go install labjack_ljm/LabJack/LJM/ljm_startup_configs.json \
		-t ${CONSTANTS_DESTINATION}/LabJack/LJM
	go install labjack_ljm/LabJack/LJM/ljm.log \
		-t ${CONSTANTS_DESTINATION}/LabJack/LJM
	go install labjack_ljm/LabJack/LJM/readme.md \
		-t ${CONSTANTS_DESTINATION}/LabJack/LJM

	if [ ! -f ${CONSTANTS_DESTINATION}/LabJack/LJM/ljm_specific_ips.config ]; then
		go touch ${CONSTANTS_DESTINATION}/LabJack/LJM/ljm_specific_ips.config
	fi

	if [ ! -f ${CONSTANTS_DESTINATION}/LabJack/LJM/ljm_deep_search.config ]; then
		go touch ${CONSTANTS_DESTINATION}/LabJack/LJM/ljm_deep_search.config
	fi

	go chmod 666 ${CONSTANTS_DESTINATION}/LabJack/LJM/ljm_constants.json
	go chmod 666 ${CONSTANTS_DESTINATION}/LabJack/LJM/ljm_startup_configs.json
	go chmod 666 ${CONSTANTS_DESTINATION}/LabJack/LJM/ljm.log
	go chmod 666 ${CONSTANTS_DESTINATION}/LabJack/LJM/ljm_specific_ips.config
	go chmod 666 ${CONSTANTS_DESTINATION}/LabJack/LJM/ljm_deep_search.config

	# Sic ("addressess")
	rm -f ${CONSTANTS_DESTINATION}/LabJack/LJM/readme_ljm_special_addressess.md

	deprecate_special_addresses

	install_auto_ips_file

	echo "done."
}

setup_ldconfig ()
{
	path_exists=$FALSE
	for line in `cat $LDCONFIG_FILE`; do
		if [ $line == $LIB_DESTINATION ]; then
			path_exists=$TRUE
		fi
	done

	if [ $path_exists != $TRUE ]; then
		echo "$LIB_DESTINATION >> $LDCONFIG_FILE"
		echo $LIB_DESTINATION >> $LDCONFIG_FILE
	fi
	go ldconfig
}

setup_labjack_device_rules ()
{
	# LabJack device rules
	if [ -d $RULES_DEST_PRIMARY ]; then
		RULES_DEST=$RULES_DEST_PRIMARY
	elif [ -d $RULES_DEST_ALTERNATE ]; then
		RULES_DEST=$RULES_DEST_ALTERNATE
	else
		NO_RULES=$TRUE
	fi

	echo -n "Adding LabJack device rules... "
	if [ $NO_RULES != $TRUE ]; then
		if [ -f $RULES_DEST_ALTERNATE/$OLD_RULES ]; then
			#echo "Removing old rules: $RULES_DEST_ALTERNATE/$OLD_RULES.."
			go rm $RULES_DEST_ALTERNATE/$OLD_RULES
		fi

		#echo "Adding $RULES to $RULES_DEST.."
		go cp -f labjack_ljm/$RULES $RULES_DEST
		NEED_RECONNECT=$TRUE
	fi
	echo "done."
}

restart_device_rules ()
{
	echo -n "Restarting the device rules... "
	udevadm control --reload-rules 2> /dev/null
	ret=$?
	if [ ! $ret ]; then
		udevadm control --reload_rules 2> /dev/null
		ret=$?
	fi
	if [ ! $ret ]; then
		/etc/init.d/udev-post reload 2> /dev/null
		ret=$?
	fi
	if [ ! $ret ]; then
		udevstart 2> /dev/null
		ret=$?
	fi
	if [ ! $ret ]; then
		NEED_RESTART=$TRUE
		echo " could not restart the rules."
	else
		echo "done."
	fi
}


# Process arguments






# Begin installing/configuring

# install_ljm_lib
# install_ljm_header
# install_ljm_constants


# ldconfig setup, now that LJM is installed
setup_ldconfig

setup_labjack_device_rules

success
