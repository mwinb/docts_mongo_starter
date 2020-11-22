import SatelliteModel, { isValidSatId, SatId } from './satellites.model';
import sats from './sattelites.json';

class SatelliteService {
  sattelites: SatelliteModel[] = [];

  constructor() {
    this.sattelites = sats.map((sat, i) => {
      return { ...sat, id: i };
    });
  }

  get satCount(): number {
    return this.sattelites.length - 1;
  }

  getAll(): SatelliteModel[] {
    return this.sattelites;
  }

  getOne(id: SatId): SatelliteModel {
    if (!isValidSatId(this.satCount, id)) {
      throw new Error('Sattelite with that id is not found.');
    }
    return this.sattelites[id];
  }
}

export default SatelliteService;
