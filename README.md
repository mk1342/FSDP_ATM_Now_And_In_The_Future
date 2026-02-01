# FSDP_ATM_Now_And_In_The_Future

<sub>ariboop/FSDP_ATM_Now_And_In_The_Future</sub>


This repositiory contains the Full Stack Development Project (FSDP) for the problem "ATM Now And In The Future" as an application.

This project is built using Vue.js, CSS, and HTML for the frontend, and Node.js with Express.js for the backend. MongoDB is used as the database to store user information and transaction data.


# important notes

This readme should contain all the necessary steps to replicate the prototype. any additional libraries or dependencies should be mentioned here.

if possible, it should be able to be built on one click on a button, for simplicity. 

Reminder: Documentation please.


## Installation Instructions
before cloning and running the project, ensure you have the following prerequisites installed on your machine:

- [Node.js](https://nodejs.org/en)

Optional (for full-stack with MongoDB):
- [MongoDB Local](https://www.mongodb.com/try/download/community) or use Docker (recommended for dev)

and the following installed from npm (and replicated in package.json):

***
Express
Dotenv
Mongoose
***

### Local development with Docker (quick)
- Start only Mongo (recommended):
  - docker: `docker compose up -d mongo`
  - verify: `docker compose ps`
- Start the app (root):
  - With Mongo: `npm run dev:with-mongo`  (starts app and expects local Mongo)
  - Demo mode (no Mongo): `npm run start:demo`  or on Windows `npm run start:demo:win`
- Tear down (remove volumes): `docker compose down -v`

Notes:
- To run the backend-only commands from the backend folder use `npm run backend:install` and `npm run backend:start`.
- To persist a permanent local Mongo for multiple projects use a dedicated Docker volume; the compose file in this repo already creates `fsdp_atm_mongo_data`.


### highly recommended for troubleshooting
[Postman](https://www.postman.com/downloads/) - for testing API endpoints

[VSCode](https://code.visualstudio.com/download) - for code editing and debugging

## How to Start the Repository

Simple. 

**Startup.Ps1**

then 

**Run.Ps1**


## Features	

[none!](https://media.tenor.com/svrKSuwrhOwAAAAj/rumia-dance.gif)