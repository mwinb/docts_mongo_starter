import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import morgan from 'morgan';
import { DocApp } from '@mwinberry/doc-ts';
import SatelliteController from './Satellites/satellites.controller';
dotenv.config({ path: path.resolve(process.env.NODE_ENV + '.env') });

const mongoUrl = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@localhost:${process.env.MONGO_PORT}/${process.env.MONGO_SERVER}?authSource=admin`;
const port = +process.env.SERVER_PORT;
const expressApp = express();
const appV1 = new DocApp({
  path: '/v1',
  showApi: true,
  controllers: [new SatelliteController()],
  expressApplication: expressApp,
  router: express.Router(),
  middleware: [morgan(), express.json()]
});

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

expressApp.listen(port, () => {
  console.log(`App listening on the port ${port}`);
  if (appV1.showApi) console.log(`View v1: http://localhost:${port}${appV1.path}`);
});
