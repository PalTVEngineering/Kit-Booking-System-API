# Kit-Booking-System-API
---------------------------------------------------------------
Repository for the Api to query the kit booking database
---------------------------------------------------------------
Running API locally(assuming you have git installed)
---------------------------------------------------------------
 - First Install and setup Docker Desktop: https://www.docker.com/products/docker-desktop/

 - Clone the repo: git clone <repo url>

 - Navigate to the directory you cloned the repo

 - Run the following commands:
    docker-compose up -d
    npm run db:setup

 - Create a .env file and ensure this is added to your .gitignore file. Add the following variables to your .env
    EMAIL_USER=<>
    EMAIL_PASS=<>
 - I will inform you of the credentials to put in the placeholders

To verify your docker containers are running can run command "docker ps" if in linux may need to run "sudo docker ps".

Can shutdown containters in Docker Desktop GUI.

# Updating DB Schema

To make a change to the production DB create a new sql file in the migrations folder in a similar naming format to the current one and write your SQL code there, the runner will take care of the rest

# Testing
To configure your testing environment run the following commands in the CLI while in the API folder

-npm install --save-dev jest
-npm audit fix
-npm install --save-dev supertest
-npm install --save-dev babel-jest
-npm install @babel/preset-env --save-dev

# Writing new tests
Unit tests should be similar to the format of what is already there, we should be writing new/updating unit tests whenever we create or augment
the function of a section of the code.