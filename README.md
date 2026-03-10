
# Create a workspace scheduler using Bryntum Scheduler Pro and MongoDB

This starter template is an npm workspaces TypeScript monorepo that contains a Vite client app and an Express server app. The client uses [Vite](https://vite.dev/) and [Bryntum Scheduler Pro](https://bryntum.com/products/schedulerpro/). The server uses Express and MongoDB. 

## Install the dependencies

Install the dependencies by running the following command: 

```sh
npm install
```

## Add your MongoDB Atlas credentials

Create a `.env` file and add your MongoDB Atlas cluster name and connection string:

```
PORT=1339
MONGODB_URI=mongodb+srv://<dbUsername>:<dbPassword>@<cluster>.mongodb.net
MONGODB_DB=
```

## Populate the MongoDB database with example data

Run the seed script to populate your database:

```sh
npm run seed
```

## Running the client and server apps at the same time

Run the local dev servers for the client and server using the following command:

```sh
npm run dev
```

This runs the client app and server app concurrently using the npm package `concurrently`.

You can access the client app at [`http://localhost:5173`](http://localhost:5173) and the server app at [`http://localhost:1339`](http://localhost:1339).

## Adding npm packages to the client or server app

To add an npm package to the correct app, use the `--workspace` flag with the `npm install` command. For example, to add the `zod` npm package to the `server`, use the following command from the root directory:

```sh
npm install zod --workspace=server
```