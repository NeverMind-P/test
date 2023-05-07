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

You can use swagger to test API(http://localhost:${PORT}/api/docs#/)
<img width="1440" alt="image" src="https://user-images.githubusercontent.com/36449170/236677761-878887b8-b870-4da9-a685-47a39b5c7de6.png">
Also you can find schemas and dto:
<img width="1409" alt="image" src="https://user-images.githubusercontent.com/36449170/236677815-40baadc9-1e99-4b76-81f3-d1eb0e73e7be.png">
