import Satellite, { SatModel, seedSats } from './satellites.model';
import { HttpError } from '@mwinberry/doc-ts';
class SatelliteService {
  sattelites: Satellite[] = [];
  private static satService: SatelliteService;

  private constructor(private satModel = SatModel) {
    seedSats();
  }

  static instance() {
    if (!this.satService) this.satService = new SatelliteService();
    return this.satService;
  }

  async getAll(): Promise<Satellite[]> {
    return await this.satModel.find({});
  }

  async getOne(id: string): Promise<Satellite> {
    try {
      const model = await this.satModel.findById(id);
      return model;
    } catch (err) {
      throw new HttpError(404, 'Satellite with provided id not found.');
    }
  }

  async addOne(newSat: Satellite): Promise<Satellite> {
    const satModel = new this.satModel({ ...newSat, status: 'Awaiting Maneuver' });
    try {
      return await satModel.save();
    } catch (err) {
      throw new HttpError(422, err.message);
    }
  }

  async patchOne(newSat: Satellite): Promise<Satellite> {
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
