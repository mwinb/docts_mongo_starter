import { HttpError } from '@mwinberry/doc-ts';
import SatelliteModel, { Satellite } from './satellites.model';

class SatelliteService {
  constructor(private satModel = SatelliteModel) {}

  async getAll(): Promise<Satellite[]> {
    return await this.satModel.find({});
  }

  async getOne(id: string): Promise<Satellite> {
    const sat = await this.satModel.findById(id);
    if (!sat) throw new HttpError(404, 'Satellite not found.');
    return sat;
  }

  async addOne(newSat: Satellite): Promise<Satellite> {
    try {
      const sat = new SatelliteModel(newSat);
      await sat.save();
      return sat;
    } catch (error) {
      throw new HttpError(400, error.message);
    }
  }

  async patchOne(newSat: Satellite): Promise<Satellite> {
    try {
      const patched = await this.satModel.findOneAndUpdate({ _id: newSat._id }, newSat, {
        runValidators: true,
        new: true,
        upsert: false
      });
      if (!patched) throw new HttpError(404, `No Satellite with the _id: ${newSat._id} exists.`);
      return patched;
    } catch (error) {
      throw new HttpError(error.code || 400, error.message);
    }
  }
}

export default SatelliteService;
