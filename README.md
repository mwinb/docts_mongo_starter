# VaporTs Mongo Starter

build  
`npm build`

start - runs build then executes dist/main.js with .env.example and `NODE_ENV=production`  
`npm start`

starting dev environment with mongomemory server using .env.example and `NODE_ENV=development`  
`npm run start:dev`

starting prod with mongo container  
`npm run start:env`

starting mongo container  
`npm run start:mongo`

starting environment with docker-compose  
`docker compose up`

running unit tests on loop  
`npm test`

running unit tests once with coverage  
`npm run test:unit`

running integration tests once with coverage  
`npm run test:integration`

running all tests once with coverage  
`npm run test:all`

Building with docker:  
`npm run build && docker build -t docts_starter .`

Running docker:  
`docker run --name ts_starter -p 4000:4000 docts_starter`

### Environment Variables

- PORT
- MONGO_PORT
- NODE_ENV (production, development)
- MONGO_USERNAME
- MONGO_SERVER
- MONGO_PASSWORD
