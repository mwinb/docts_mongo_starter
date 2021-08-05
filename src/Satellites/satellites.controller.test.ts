import sats from './satellites.json';
import SatelliteController from './satellites.controller';
import SatelliteModel, { Satellite } from './satellites.model';

let satellites: Satellite[];
let mockRequest: any;
let satController: SatelliteController;

beforeEach(() => {
  mockRequest = {};
  satController = new SatelliteController();
  satellites = sats.map((s: any, index: number) => {
    return {
      ...s,
      _id: `${index}`
    };
  }) as Satellite[];
});
describe('Satellites Controller', () => {
  beforeEach(() => {
    jest.spyOn(SatelliteModel, 'find').mockResolvedValueOnce(satellites);
  });
  it('should get all satellites', async () => {
    expect(await satController.getAllSats()).toEqual(satellites);
  });

  describe('Getting Satellite by id', () => {
    let requestedSatellite: Satellite;
    let findByIdSpy: jest.SpyInstance<any, any>;

    beforeEach(() => {
      requestedSatellite = satellites[0];
      findByIdSpy = jest.spyOn(SatelliteModel, 'findById');
    });

    it('can get a satellite by id', async () => {
      findByIdSpy.mockResolvedValueOnce(requestedSatellite);
      mockRequest.params = { id: requestedSatellite._id };

      const sat = await satController.getSatById(mockRequest);
      expect(sat).toEqual(requestedSatellite);
    });

    it('throws a 404 HttpError if the satellite is not found', async () => {
      findByIdSpy.mockResolvedValueOnce(undefined);
      mockRequest.params = { id: '10101010' };

      let errorThrown;
      try {
        await satController.getSatById(mockRequest);
      } catch (error) {
        errorThrown = error;
      }
      expect(errorThrown.code).toBe(404);
    });
  });

  describe('Adding Satellite', () => {
    let saveSpy: jest.SpyInstance<any, any>;

    beforeEach(() => {
      saveSpy = jest.spyOn(SatelliteModel.prototype, 'save');
    });
    it('can add a satellite', async () => {
      saveSpy.mockImplementationOnce(jest.fn());
      mockRequest = { body: { name: 'Sat Name', lat: 1234, lon: 1234, status: 'Example Status' } };

      const { _id, ...newSat } = (await satController.addSat(mockRequest)).toJSON();
      expect(newSat).toEqual({
        lat: 1234,
        lon: 1234,
        name: 'Sat Name',
        status: 'Example Status'
      });
    });

    it('throws a 400 if the satellite is not added', async () => {
      saveSpy.mockRejectedValueOnce(new Error());
      mockRequest = { body: { name: 'Sat Name', lat: 1234, lon: 1234, status: 'Example Status' } };

      let thrownError;
      try {
        await satController.addSat(mockRequest);
      } catch (error) {
        thrownError = error;
      }
      expect(thrownError.code).toBe(400);
    });
  });

  describe('patching satellite', () => {
    let satToPatch: Satellite;
    let findOneAndUpdateSpy: jest.SpyInstance<any, any>;

    beforeEach(() => {
      findOneAndUpdateSpy = jest.spyOn(SatelliteModel, 'findOneAndUpdate');
      satToPatch = satellites[0];
    });

    it('returns the patched satellite', async () => {
      satToPatch.name = 'New Name';
      findOneAndUpdateSpy.mockResolvedValueOnce(satToPatch);
      mockRequest.body = satToPatch;

      const patchedSat = await satController.patchSat(mockRequest);
      expect(patchedSat.name).toEqual(satToPatch.name);
    });

    it('throws an HttpError with a 404 code if the satellite is not found.', async () => {
      findOneAndUpdateSpy.mockResolvedValueOnce(undefined);
      satToPatch._id = '101001';
      mockRequest.body = satToPatch;

      let thrownError;
      try {
        await satController.patchSat(mockRequest);
      } catch (error) {
        thrownError = error;
      }
      expect(thrownError.code).toBe(404);
    });

    it('throws an HttpError with a 400 code if an error is thrown while updating', async () => {
      findOneAndUpdateSpy.mockRejectedValueOnce(new Error('Failed Validation'));
      mockRequest.body = satToPatch;

      let thrownError;
      try {
        await satController.patchSat(mockRequest);
      } catch (error) {
        thrownError = error;
      }
      expect(thrownError.code).toBe(400);
    });
  });

  it('serves the model html', async () => {
    const type = jest.fn();
    const text = await satController.getModel({}, { type });
    expect(type).toHaveBeenLastCalledWith('text/html');
    expect(text).toContain(JSON.stringify(satController.exampleModel, null, 2));
  });
});
