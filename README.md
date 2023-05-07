First of all, install postgres and create database, then change .env file and start project. Sequalize will automatically create db structure. You can use docker to run project:

```bash
# Start docker
$ docker-compose up
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
