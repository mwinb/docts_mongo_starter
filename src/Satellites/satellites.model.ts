import SatelliteService from './satellites.service';

export type SatName = string;
export type SatLon = number;
export type SatLat = number;
export type SatId = number;
export type SatStatus = string;

interface SatelliteModel {
  id: SatId;
  name: SatName;
  lat: SatLat;
  lon: SatLon;
  status: SatStatus;
}

export const isValidSatId = (satCount: number, id: SatId): boolean => id <= satCount && id >= 0;

export default SatelliteModel;
