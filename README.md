# OSU CS Applied Plan Portal

This is a web app that streamlines the pro-school application process for OSU Applied-CS students.

## Prerequisites

- Node.js version at least 12.x
- MySQL version at least 8.x
- Firefox version at least 75.x or Chrome version at least 80.x

## Installation

From the root directory of this repo, run

    chmod +x install.sh && ./install.sh

Please follow the instructions produced by the script to install the necessary software and dependencies.

## Deployment

1. A MySQL database is required for this application. To create an empty database in MySQL, e.g. `cs72`,

        mysql -u root -p -e "CREATE DATABASE cs72"

2. Import the data from the initialization script to the newly created database. For the previous example, from the root directory of this repo, run

        mysql -u root -p cs72 < services/db/db-init.sql

3. The following environment variables must be set:

        PORT
        SQL_HOST
        SQL_PORT
        SQL_USER
        SQL_PASSWORD
        SQL_DB_NAME
        JWT_SECRET_KEY
        CSRF_SECRET_KEY
        REACT_APP_API_HOST
        REACT_APP_API_PORT

    where `REACT_APP_API_PORT` must have the same value as `PORT`.

4. Make sure the port 3000 and the port specified by the `PORT` environment variable are available to be used.

5. To start the application, from the root directory of this repo, run

        npm start
