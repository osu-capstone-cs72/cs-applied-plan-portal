#!/bin/bash
# One Line to install them all, One Line to build them,
# One Line to run them all, and in the environment bind them.


# Echoes the command in bold font before executing it. This is just a nice way
# to see what commands are being executed.
#
# Returns the exit status of the executed command.
exe() {
  echo -e "\033[1m$@\033[0m"
  "$@"
  return $?
}

# check required software
# if each check returns 0, the corresponding software is present and running
has_required_software=true
echo -e "\033[0;34mChecking required software\033[0m"

missing_nodejs=$(node --version > /dev/null 2>&1; echo $?)
if [[ "${missing_nodejs}" -ne 0 ]]; then
  echo -e "  Node.js \xE2\x9D\x8C" >&2
  has_required_software=false
else
  echo -e "  Node.js \xE2\x9C\x94"
fi

missing_npm=$(npm --version > /dev/null 2>&1; echo $?)
if [[ "${missing_npm}" -ne 0 ]]; then
  echo -e "  NPM \xE2\x9D\x8C" >&2
  has_required_software=false
else
  echo -e "  NPM \xE2\x9C\x94"
fi

# missing_mysql=$(mysql --version > /dev/null 2>&1; echo $?)
# if [[ "${missing_mysql}" -ne 0 ]]; then
#   echo -e "  MySQL \xE2\x9D\x8C" >&2
#   has_required_software=false
# else
#   echo -e "  MySQL \xE2\x9C\x94"
# fi

if [[ "${has_required_software}" == true ]]; then
  echo -e "\033[0;32mSoftware requirements are met.\033[0m\n"
  echo -e "\033[0;34mInstalling API server's dependencies\033[0m"
  exe npm install

  echo -e "\033[0;34mInstalling React server's dependencies\033[0m"
  exe npm --prefix client/ install client/

  echo -e "\n\033[0;32mInstallation complete. Please double-check npm's log above to ensure all packages were successfully installed.\033[0m"
else
  echo -e "\033[0;31mSoftware requirements were not met. Please install the missing software above, then rerun this script.\033[0m" >&2
  exit 1
fi
