# OSU CS Applied Plan Portal

This is a web app that streamlines the pro-school application process for OSU Applied-CS students and advisors. The live version of the app is deployed on [Heroku](https://applied-plan-portal.herokuapp.com).

## Note to Grader

Code review responses can be found at [docs/Code-Review-Actions.pdf](docs/Code-Review-Actions.pdf).

## Deploying Locally

### Prerequisites

- A shell to run commands. [Bash](https://www.gnu.org/software/bash) is recommended. For Linux, it should already be installed. For Windows, [Git Bash](https://gitforwindows.org) is recommended.
- [Node.js](https://nodejs.org/en) version at least 12.x
- [Chrome](https://www.google.com/chrome/?brand=CHBD&gclid=EAIaIQobChMIiO2K4_Ov6QIVsiCtBh16Ug0nEAAYASABEgI39PD_BwE&gclsrc=aw.ds) version at least 80.x or [Firefox](https://www.mozilla.org/en-US/firefox/new) version at least 75.x
- [MySQL](https://dev.mysql.com/downloads) version at least 8.0

### Installation and Setup

1. Download the contents of the repo to your machine by running the following
command in the shell:

       git clone https://github.com/osu-capstone-cs72/cs-applied-plan-portal.git

2. Add a file named `.env` to the ROOT directory of the project. Copy the following block to the file:

       CSRF_SECRET_KEY='foobar'
       JWT_SECRET_KEY='foobar'
       PORT=5000
       SQL_DB_NAME='foobar'
       SQL_HOST='foobar'
       SQL_PASSWORD='foobar'
       SQL_PORT=3306
       SQL_USER='foobar'

3. Make change to the file, replacing all `foobar` strings with appropriate values. The meaning of these variables are explained below:

    `CSRF_SECRET_KEY` holds the secret key for Express to make the app more secured against Cross-site scripting attack. We recommend generating a password of at least 20 characters with all types of characters as the value of this environment variable.

    `JWT_SECRET_KEY` holds the secret key Express to parse JSON web tokens which holds login credentials. We recommend generating a password of at least 20 characters with all types of characters as the value of this environment variable.

    `PORT` holds the port that the Express server listens to when runs. The value must be `5000`.

    `SQL_DB_NAME`, `SQL_HOST`, `SQL_PASSWORD`, `SQL_PORT`, and `SQL_USER` hold the database name, the hostname, the password, the port, and the username, respectively, of the required MySQL connection to run the app. We default `SQL_PORT` to `3306`. You should configure these 5 environment variables to match with your MySQL connection.

4. Add another file, also named `.env`, but to the `client/` directory of the project. Copy the following block to the file:

       REACT_APP_API_HOST='localhost'
       REACT_APP_API_PORT=5000
       REACT_APP_HOST='localhost'
       REACT_APP_PORT=3000

5. The content of this file should not be changed. The meaning of these variables are explained below:

    `REACT_APP_API_HOST` and `REACT_APP_API_PORT` hold the hostname and the port, respectively, of the Express server that runs alongside the React server in the `client/` directory.

    `REACT_APP_HOST` and `REACT_APP_PORT` hold the hostname of the port, respectively, of this React server in the `client/` directory.

    **Note**: All environment variables in this file must be prefixed by `REACT_APP_` to be recognized by Create React App.

6. From the root directory of this repo, run

       chmod +x install.sh && ./install.sh

    Please follow the instructions produced by the script to check and install the necessary software and dependencies.

7. Make sure the port 3000 and the port specified by the `PORT` environment variable are available to be used.

8. Make sure your MySQL database is ready to be connected.

9. To start the application, from the root directory of this repo, run

       npm run dev

## Testing

Run the following command to perform unit and integration testing for plan API calls

    npm run testAPI

Run the following command to perform unit testing for the React client code (using Jest's snapshot testing)

    npm run testReact
