import Satellite, { SatModel, StatusSet } from './satellites.model';
import sats from './sattelites.json';
import mongoose, { Document } from 'mongoose';
import { HttpError } from '../common/error.model';
class SatelliteService {
  sattelites: Satellite[] = [];
  private static satService: SatelliteService;

  private constructor(private satModel = SatModel) {
    sats.forEach(sat => {
      this.addOne(sat);
    });
  }

  static instance() {
    if (!this.satService) this.satService = new SatelliteService();
    return this.satService;
  }

  async getAll(): Promise<Document<Satellite>[]> {
    return await this.satModel.find({});
  }

  async getOne(id: string): Promise<mongoose.Document<Satellite> | HttpError> {
    try {
      const model = await this.satModel.findById(id);
      return model;
    } catch (err) {
      return { code: 404, message: 'Satellite with provided id not found.' };
    }
  }

  async addOne(newSat: Satellite): Promise<Document<Satellite> | HttpError> {
    const satModel = new this.satModel({ ...newSat, status: 'Awaiting Maneuver' });
    try {
      return await satModel.save();
    } catch (err) {
      return { code: 422, message: err.message };
    }
  }

  async patchOne(newSat: Satellite): Promise<Document<Satellite> | HttpError> {
    try {
      const patched = await this.satModel.findOneAndUpdate(
        { _id: newSat._id },
        { ...newSat },
        { upsert: false, returnOriginal: false, runValidators: true }
      );
      if (!patched) throw new Error('Unable to find requested resource.');
      return patched;
    } catch (err) {
      return { code: 404, message: err.message };
    }
  }
}

export default SatelliteService;
