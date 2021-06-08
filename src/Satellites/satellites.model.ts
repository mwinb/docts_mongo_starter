import sats from './satellites.json';
import mongoose, { Document, Model, Schema } from 'mongoose';
import SatelliteDefinition from '../common/Definitions/satellite.definition';

export type SatStatus = 'Awaiting Maneuver' | 'Preparing Maneuver' | 'Executing Maneuver' | 'Maneuver Completed';

export interface Satellite extends Document {
  name: string;
  status: SatStatus;
  lat: number;
  lon: number;
}

export const SatelliteSchema = new Schema(SatelliteDefinition);

export const SatelliteModel: Model<Satellite> = mongoose.model<Satellite>('Satellite', SatelliteSchema);

export const seedSats = async (): Promise<void> => {
  await SatelliteModel.insertMany(sats as Satellite[]);
};

export default SatelliteModel;
