import express from 'express';
import supertest from 'supertest';
import { Mongoose } from 'mongoose';
import { DocApp } from '@mwinberry/doc-ts';
import SatelliteController from './satellites.controller';
import SatelliteModel, { Satellite, seedSats } from './satellites.model';
import { connectDb, getMemoryServer } from '../common/dbConfig';
import { MongoMemoryServer } from 'mongodb-memory-server';

const path = '/satellite';
const expressApp = express();
const satController = new SatelliteController();
let appRequest: any;
let deletedId: string;
let db: Mongoose;
let memoryServer: MongoMemoryServer;

new DocApp({
  showApi: false,
  controllers: [satController],
  middleware: [express.json()],
  expressApplication: expressApp
});
beforeAll(async () => {
  memoryServer = getMemoryServer();
  db = await connectDb(await memoryServer.getUri());
  appRequest = supertest(expressApp);
});

afterAll(async () => {
  await db.disconnect();
  memoryServer.stop();
});

beforeEach(async () => {
  await SatelliteModel.deleteMany({});
  await seedSats();
  const { _id } = await SatelliteModel.findOneAndDelete();
  deletedId = _id;
});

describe('/satellite', () => {
  describe('getAll', () => {
    it('gets all satellites', async () => {
      const { body: sats } = await appRequest.get(path).expect(200);
      expect(sats.length).toBeGreaterThan(0);
    });
  });

  describe('getting satellite by id', () => {
    it('gets a satellite by id', async () => {
      const satellite = (await appRequest.get(path)).body.pop();
      await appRequest.get(`${path}/${satellite._id}`).expect(200);
    });

    it('throws a 404 if the satellite does not exist', async () => {
      await appRequest.get(`${path}/${deletedId}`).expect(404);
    });

    it('throws a 400 if an invalid sat id is passed', async () => {
      await appRequest.get(`${path}/I am an invalid id`).expect(400);
    });
  });

  describe('Creating a satellite', () => {
    it('creates a satellite if all fields are valid', async () => {
      const postSat = {
        name: 'New Satellite',
        lat: 10,
        lon: 10,
        status: 'Awaiting Maneuver'
      };
      const { body } = await appRequest.post(path).send(postSat).expect(201);
      const { _id, __v, ...theRest } = body;
      expect(theRest).toEqual(postSat);
    });

    it('throws a 400 if any fields are missing', async () => {
      await appRequest
        .post(path)
        .send({
          name: 'Satellite'
        })
        .expect(400);
    });

    it('throws a 400 if invalid status', async () => {
      await appRequest.post(path).send({
        name: 'Satellite',
        lat: 500,
        lon: 500,
        status: 'Invalid Status'
      });
    });
  });

  describe('Patching a satellite', () => {
    let satToPatch: Satellite;

    beforeEach(async () => {
      satToPatch = (await appRequest.get(`${path}`)).body[0];
    });

    it('patches a satellite', async () => {
      satToPatch.name = 'Updated Name';

      const { body: patchedSat } = await appRequest
        .patch(path)
        .send({ ...satToPatch, name: 'Updated Name' })
        .expect(200);
      expect(satToPatch).toEqual(patchedSat);
    });

    it('throws a 400 if an invalid id is provided', async () => {
      await appRequest
        .patch(path)
        .send({
          name: 'Updated Sat',
          id: 'I should be a valid objectId'
        })
        .expect(400);
    });

    it('throws a 404 if the id is not found', async () => {
      await appRequest
        .patch(path)
        .send({
          name: 'Updated Sat',
          _id: deletedId
        })
        .expect(404);
    });
  });

  describe('-api', () => {
    it('returns the html for the example model', async () => {
      const { text, type } = await appRequest.get(`${path}-api`).expect(200);
      expect(type).toBe('text/html');
      expect(text).toContain(JSON.stringify(satController.exampleModel, null, 2));
    });
  });
});
