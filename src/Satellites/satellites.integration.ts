import fastify from 'fastify';
import middie from 'middie';
import { Mongoose } from 'mongoose';
import { VaporApp } from 'vaports';
import SatelliteController from './satellites.controller';
import SatelliteModel, { Satellite, seedSats } from './satellites.model';
import { connectDb, getMemoryServer } from '../common/dbConfig';
import { MongoMemoryServer } from 'mongodb-memory-server';

const path = 'satellite';
const app = fastify();
const satController = new SatelliteController();
let deletedId: string;
let db: Mongoose;
let memoryServer: MongoMemoryServer;

beforeAll(async () => {
  await app.register(middie);
  new VaporApp({
    showApi: false,
    controllers: [satController],
    expressApplication: app,
    path: '/'
  });
  memoryServer = getMemoryServer();
  db = await connectDb(await memoryServer.getUri());
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
      const sats = JSON.parse((await app.inject({ method: 'GET', url: path })).body);
      expect(sats.length).toBeGreaterThan(0);
    });
  });

  describe('getting satellite by id', () => {
    it('gets a satellite by id', async () => {
      const satellite = JSON.parse((await app.inject({ method: 'GET', url: path })).body).pop();
      const sat = JSON.parse((await app.inject({ method: 'GET', url: `${path}/${satellite._id}` })).body);
      expect(sat).toEqual(satellite);
    });

    it('throws a 404 if the satellite does not exist', async () => {
      expect((await app.inject({ method: 'GET', url: `${path}/${deletedId}` })).statusCode).toBe(404);
    });

    it('throws a 400 if an invalid sat id is passed', async () => {
      expect((await app.inject({ method: 'GET', url: `${path}/I am an invalid id` })).statusCode).toBe(400);
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
      const body = JSON.parse((await app.inject({ method: 'POST', url: path, payload: postSat })).body);
      const { _id, __v, ...theRest } = body;
      expect(theRest).toEqual(postSat);
    });

    it('throws a 400 if any fields are missing', async () => {
      expect(
        (
          await app.inject({
            method: 'POST',
            url: path,
            payload: {
              name: 'Satellite'
            }
          })
        ).statusCode
      ).toBe(400);
    });

    it('throws a 400 if invalid status', async () => {
      expect(
        (
          await app.inject({
            method: 'POST',
            url: path,
            payload: {
              name: 'Satellite',
              lat: 500,
              lon: 500,
              status: 'Invalid Status'
            }
          })
        ).statusCode
      ).toBe(400);
    });
  });

  describe('Patching a satellite', () => {
    let satToPatch: Satellite;
    let opts;
    beforeEach(async () => {
      satToPatch = JSON.parse((await app.inject({ method: 'GET', url: path })).body)[0];
      opts = { method: 'PATCH', url: path };
    });

    it('patches a satellite', async () => {
      satToPatch.name = 'Updated Name';
      opts.payload = satToPatch;
      const patchedSat = JSON.parse((await app.inject(opts)).body);
      expect(satToPatch).toEqual(patchedSat);
    });

    it('throws a 400 if an invalid id is provided', async () => {
      opts.payload = {
        name: 'Updated Sat',
        id: 'I should be a valid objectId'
      };
      expect((await app.inject(opts)).statusCode).toBe(400);
    });

    it('throws a 404 if the id is not found', async () => {
      opts.payload = {
        name: 'Updated Sat',
        _id: deletedId
      };
      expect((await app.inject(opts)).statusCode).toBe(404);
    });
  });

  describe('-api', () => {
    it('returns the html for the example model', async () => {
      const {
        body,
        headers: { 'content-type': type }
      } = await app.inject({ method: 'GET', url: `${path}-api` });
      expect(body).toContain(JSON.stringify(satController.exampleModel, null, 2));
      expect(type).toContain('text/html');
    });
  });
});
