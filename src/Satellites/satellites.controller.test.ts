import SatelliteController from './satellites.controller';
import Satellite, { SatModel } from './satellites.model';
import { Document } from 'mongoose';
let mockResponse: any;
let mockRequest: any;
let satController: SatelliteController;
const responseSat = {
  status: 'Awaiting Maneuver',
  _id: '6001ac07f9439a66a26571b6',
  name: 'I am a new Satellite',
  lat: 479,
  lon: 243,
  __v: 0
};

beforeEach(() => {
  mockResponse = {
    status: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis()
  };
  mockRequest = {};

  satController = new SatelliteController();
});
describe('Satellites Controller', () => {
  it('should get all satellites', async () => {
    jest.spyOn(SatModel, 'find').mockResolvedValueOnce([responseSat] as any);
    await satController.getAllSats(mockRequest, mockResponse);
    expect(mockResponse.send).toHaveBeenCalledWith([responseSat]);
  });

  describe('Adding Sat', () => {
    it('can add a satellite', async () => {
      jest.spyOn(SatModel.prototype, 'save').mockResolvedValueOnce(responseSat);
      mockRequest = { body: { name: 'I am a new Satellite', lat: 479, lon: 243 } };
      await satController.addSat(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith(responseSat);
    });

    it('should send a 422 with a failure message if the required fields are not provided when adding a satellite', async () => {
      mockRequest = { body: {} };
      jest.spyOn(SatModel.prototype, 'save').mockRejectedValue({
        message:
          '"Satellite validation failed: lon: Satellite must have a Longitude., lat: Satellite must have a Latitude., name: Satellite must have a name.'
      });
      await satController.addSat(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(422);
    });
  });

  describe('patching satellite', () => {
    let satToPatch: Document<Satellite>;
    beforeEach(() => {
      satToPatch = { ...responseSat, name: 'New Name' } as any;
    });
    it('returns the updated sat object if successful', async () => {
      jest.spyOn(SatModel, 'findOneAndUpdate').mockResolvedValueOnce(satToPatch);
      mockRequest.body = satToPatch;
      await satController.patchSat(mockRequest, mockResponse);
      expect(mockResponse.send).toHaveBeenCalledWith(satToPatch);
    });

    it('returns a 404 if the patch data id is not castable', async () => {
      jest.spyOn(SatModel, 'findOneAndUpdate').mockRejectedValueOnce('Not Castable');
      satToPatch.id = 1010101010101010101010;
      mockRequest.body = satToPatch;
      await satController.patchSat(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it('returns a 404 if findOneAndUpdate does not find resource', async () => {
      jest.spyOn(SatModel, 'findOneAndUpdate').mockResolvedValueOnce(null);
      mockRequest.body = satToPatch;
      await satController.patchSat(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe('Getting by id', () => {
    it('can get a satellite by id', async () => {
      jest.spyOn(SatModel, 'findById').mockResolvedValueOnce(responseSat as any);
      mockRequest.params = { id: responseSat._id };
      await satController.getSatById(mockRequest, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith(responseSat);
    });

    it('responds with a 404 if the sat id is not found', async () => {
      mockRequest.params = { id: 'asdlkfjaasdfj1202394' };
      jest.spyOn(SatModel, 'findById').mockRejectedValueOnce('Satellite  with provided id');
      await satController.getSatById(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenLastCalledWith(404);
    });
  });

  it('serves the model html', () => {
    satController.getModel(mockRequest, mockResponse);
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
  });
});
