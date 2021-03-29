import Satellite, { SatModel } from './satellites.model';
import sats from './sattelites.json';
import mongoose, { Document } from 'mongoose';
import { HttpError } from '@mwinberry/doc-ts';
class SatelliteService {
  sattelites: Satellite[] = [];
  private static satService: SatelliteService;

  private constructor(private satModel = SatModel) {
    sats.forEach(sat => {
      this.addOne(sat).catch(_e => {});
    });
  }

  static instance() {
    if (!this.satService) this.satService = new SatelliteService();
    return this.satService;
  }

  async getAll(): Promise<Document<Satellite>[]> {
    return await this.satModel.find({});
  }

  async getOne(id: string): Promise<mongoose.Document<Satellite>> {
    try {
      const model = await this.satModel.findById(id);
      return model;
    } catch (err) {
      throw new HttpError(404, 'Satellite with provided id not found.');
    }
  }

  async addOne(newSat: Satellite): Promise<Document<Satellite>> {
    const satModel = new this.satModel({ ...newSat, status: 'Awaiting Maneuver' });
    try {
      return await satModel.save();
    } catch (err) {
      throw new HttpError(422, err.message);
    }
  }

  async patchOne(newSat: Satellite): Promise<Document<Satellite>> {
    try {
      const patched = await this.satModel.findOneAndUpdate(
        { _id: newSat._id },
        { ...newSat },
        { upsert: false, returnOriginal: false, runValidators: true }
      );
      if (!patched) throw new Error('Unable to find requested resource.');
      return patched;
    } catch (err) {
      throw new HttpError(404, err.message);
    }
  }
}

export default SatelliteService;
