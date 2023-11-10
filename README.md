<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">dotlunx Task</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

This project is a Node.js application designed to manage products with a complex structure. Each product is linked to a Unit of Measure (UOM), which in turn is linked to a UOM Image and a UOM Barcode Relation. Furthermore, each UOM is linked to an Addon, and these Addons can have multiple Addon Items.

The application implements the following CRUD operations:

1. Create a new product with multiple UOMs, Barcodes, and Images.
2. Retrieve product information along with its associated UOMs, Barcodes, and Images.
3. Update the details of a product, including its UOMs, Barcodes, and Images.
4. Delete a product and ensure the cascading deletion of associated UOMs, Barcodes, Images, Addons, and Addon Items.


The project uses the following technologies:

- Backend Framework: Node.js
- Language: TypeScript
- Server Framework: NestJS
- Database: PostgreSQL
- API Documentation: Swagger


### Running PostgreSQL with Docker

You can also run a PostgreSQL database using Docker. Here's how you can do it:

First, pull the PostgreSQL image:

```bash
$ docker pull postgres

```

Then, run the image:

```bash
$ docker run --name postgres -e POSTGRES_PASSWORD=12345678 -p 5432:5432 -d postgres

```

To access the PostgreSQL database, you can use the psql command in the PostgreSQL container:

```bash
$ docker exec -it postgres psql -U postgres
```

In the psql command-line interface, you can create a new database with the CREATE DATABASE command. For example, to create a database named dotlunx, you would use:

```bash
CREATE DATABASE dotlunx;
```

Don't forget to update your .env file with the new database information.

## Prerequisites

Before you can run this app, you need to have a PostgreSQL database set up. Create a database and add the database information to a `.env` file in the root of the project. Here's an example of what your `.env` file should look like:

```dotenv
APP_PORT=3333
DATABASE_HOST='localhost'
DATABASE_USER=postgres
DATABASE_PASSWORD=12345678
DATABASE_PORT=5432
DATABASE_NAME=dotlynx
```

In this .env file:

- APP_PORT is the port the app will run on.
- DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, - DATABASE_PORT, and DATABASE_NAME are the details of your PostgreSQL database.

## Running the app

There are two ways to run the app: directly using npm, or using Docker.

### Using npm

You can run the app in development, watch, or production mode:

```bash
npm i

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod


### Using Docker
First, build the Docker image:

```bash
$ docker build -t dotlunx .
```

Then, run the Docker container:

```bash
$ docker run -p 3000:3333 dotlunx
```

Then you can access the app Docs on http://localhost:3000/docs.


## design decisions

- **Database Choice:** I had two options for the database: NoSQL (MongoDB) and SQL. Considering the scope of the CRUD operations and the relationships between the entities, I decided to use a SQL database, specifically PostgreSQL. It is more structured and can handle a large number of users (up to millions) without slowing down, unlike MongoDB.

- **Framework Choice:** For the Node.js framework, I chose NestJS over Express. NestJS provides a more structured codebase, which makes the project more organized. It uses design patterns like dependency injection and decorators, which make the code more readable and easier to understand. Additionally, NestJS uses TypeScript, which enhances code readability.

- **Design Decisions:**
  - The first decision was about linking the database entities. I used a one-to-many relationship between Product and UOM, UOM and Barcode, UOM and Image, UOM and Addon, and Addon and Addon Item. This seemed to be the most effective way to link these entities.
  - The second decision was about the update method, which is the most complex part of the project. I had two options: create different endpoints for each part of the product or create one endpoint for all parts. I chose to create one endpoint for all parts. This approach is more efficient and easier to use. It saves many requests that would be sent to the backend for just one update operation. However, it required a slightly complex logic to update the whole object with only one request to the database. This cost is acceptable as using the ID leverages the internal index of PostgreSQL, making operations faster.
