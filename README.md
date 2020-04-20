# OSU CS Applied Plan Portal

This is a web app that streamlines the pro-school application process for OSU Applied-CS students and advisors.

## Prerequisites

- A shell to run commands
- Node.js version at least 12.x
- Chrome version at least 80.x or Firefox version at least 75.x
- Access to the Oregon State University network

## Installation and Setup

1. Download the contents of the repo to your machine by running the following
command with your preferred shell.

        git clone https://github.com/osu-capstone-cs72/cs-applied-plan-portal.git


2. Download the following .env file and put it in the ROOT directory of the repo.

      https://drive.google.com/file/d/1epze7tEpO4yoF5zyID8DB5dFScxRR6Ld/view?usp=sharing

   Download the following .env file and put it in the CLIENT directory of the repo.

      https://drive.google.com/file/d/1Cf0WDgirYUqg43qTEzD0RrC52VfwNDK2/view?usp=sharing

   **NOTE:** 
   You must be logged into your Oregon State University email and have been given express permission to access these files. 
   If you are unable to access these files and you believe that you should have permission, please send an email to
   thomasza@oregonstate.edu and ask to be given permission.


3. From the root directory of this repo, run

        chmod +x install.sh && ./install.sh

   Please follow the instructions produced by the script to install the necessary software and dependencies.


4. Make sure the port 3000 and the port specified by the `PORT` (5000 by default) environment variable are available to be used.


5. To access the database referenced in the API environment file, you will need to be connected to the OSU network. If you are on campus, you may not need to perform any further action. If you are away from campus, use a VPN to connect to sds.oregonstate.edu using your ONID password.


6. To start the application, from the root directory of this repo, run

        npm start

## Resources

Git Bash for Windows: https://gitforwindows.org/

Node.js download: https://nodejs.org/en/

Chrome download: https://www.google.com/chrome

Firefox download: https://www.mozilla.org/en-US/firefox/new/

Documentation for connecting to OSU's network using a VPN: https://is.oregonstate.edu/service/vpn
