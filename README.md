

## Description

This is a simple Address Book application using NestJS, Mongoose, and MongoDB.

## Installation

```bash
$ npm install
```
Setup your environment variables in the .env file according to the .env.example file. Place it .env file in the root directory of the project.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

<!-- ## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
``` -->

## API Documentation
Once the server start, you will see terminal output like this:
```bash
[Nest] 1   - 2021-03-01 11:38:00   [NestFactory] Starting Nest application...
[Nest] 100372  - 14/10/2022, 00:22:31     LOG [NestApplication] Nest application successfully started +2ms
Application server listening on port 9092
```

The API base path is: api/v1
While the server is running, you can access the its API documentation at `http://localhost:9092/api/v1/docs`. Take note of the port number, it may be different from the one above.


