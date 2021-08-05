import middie from 'middie';
import { VaporApp } from 'vaports';
import { Mongoose } from 'mongoose';
import fastify, { InjectOptions } from 'fastify';
import SatelliteController from './satellites.controller';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDb, getMemoryServer } from '../common/dbConfig';
import SatelliteModel, { Satellite, seedSats } from './satellites.model';

let db: Mongoose;
const app = fastify();
let deletedId: string;
const path = 'satellite';
let reqOpts: InjectOptions
let memoryServer: MongoMemoryServer;
const satController = new SatelliteController();

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
  reqOpts = {
    method: 'GET',
    url: path
  }
});

describe('/satellite', () => {

  describe('getAll', () => {
    it('gets all satellites', async () => {
      const sats = JSON.parse((await app.inject(reqOpts)).body);
      expect(sats.length).toBeGreaterThan(0);
    });
  });

  describe('getting satellite by id', () => {
    it('gets a satellite by id', async () => {
      const satellite = JSON.parse((await app.inject(reqOpts)).body).pop();
      reqOpts.url += `/${satellite._id}`

      const sat = JSON.parse((await app.inject(reqOpts)).body);
      expect(sat).toEqual(satellite);
    });

    it('throws a 404 if the satellite does not exist', async () => {
      reqOpts.url += `/${deletedId}`;
      expect((await app.inject(reqOpts)).statusCode).toBe(404);
    });

    it('throws a 400 if an invalid sat id is passed', async () => {
      reqOpts.url += `/I am an invalid id`;
      expect((await app.inject(reqOpts)).statusCode).toBe(400);
    });
  });

  describe('Creating a satellite', () => {

    beforeEach(() => {
      reqOpts.method = "POST"
    })

    it('creates a satellite if all fields are valid', async () => {
      reqOpts.payload = {
        name: 'New Satellite',
        lat: 10,
        lon: 10,
        status: 'Awaiting Maneuver'
      };
      const body = JSON.parse((await app.inject(reqOpts)).body);
      const { _id, __v, ...theRest } = body;
      expect(theRest).toEqual(reqOpts.payload);
    });

    it('throws a 400 if any fields are missing', async () => {
      expect(
        (
          await app.inject({
            ...reqOpts,
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
            ...reqOpts,
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
    beforeEach(async () => {
      satToPatch = JSON.parse((await app.inject({ method: 'GET', url: path })).body)[0];
      reqOpts.method = 'PATCH';
    });

    it('patches a satellite', async () => {
      satToPatch.name = 'Updated Name';
      reqOpts.payload = satToPatch;
      const patchedSat = JSON.parse((await app.inject(reqOpts)).body);
      expect(satToPatch).toEqual(patchedSat);
    });

    it('throws a 400 if an invalid id is provided', async () => {
      reqOpts.payload = {
        name: 'Updated Sat',
        id: 'I should be a valid objectId'
      };
      expect((await app.inject(reqOpts)).statusCode).toBe(400);
    });

    it('throws a 404 if the id is not found', async () => {
      reqOpts.payload = {
        name: 'Updated Sat',
        _id: deletedId
      };
      expect((await app.inject(reqOpts)).statusCode).toBe(404);
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
