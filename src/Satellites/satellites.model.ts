import mongoose, { Model } from 'mongoose';
import { BaseDocument, BaseSchemaDefinition } from '../common/BaseSchemaDefinition';
import sats from './sattelites.json';

export type SatName = string;
export type SatLon = number;
export type SatLat = number;
export type SatStatus = string;
export type IncomingSatModel = any;

interface Satellite extends BaseDocument {
  name: SatName;
  lat: SatLat;
  lon: SatLon;
  status: SatStatus;
}

export const StatusSet = new Set<string>([
  'Awaiting Maneuver',
  'Preparing Maneuver',
  'Executing Maneuver',
  'Maneuver Completed'
]);

export const statusValidator = (status: string) => StatusSet.has(status);

export const SatelliteSchema = new mongoose.Schema(
  {
    ...BaseSchemaDefinition,
    name: {
      type: String,
      unique: true,
      immutable: true,
      required: [true, 'Satellite requires name']
    },
    lat: {
      type: Number,
      required: 'Satellite must have a Latitude.'
    },
    lon: {
      type: Number,
      required: 'Satellite must have a Longitude.'
    },
    status: {
      type: String,
      validate: {
        validator: statusValidator,
        message: `Status must be one of the following: ${Array.from(StatusSet.values()).join(', ')}`
      },
      default: 'Awaiting Maneuver'
    }
  },
  { timestamps: true }
);

export const SatModel: Model<Satellite> = mongoose.model<Satellite>('Satellite', SatelliteSchema);

export const seedSats = async (): Promise<void> => {
  try {
    await SatModel.insertMany(sats as Satellite[]);
  } catch {
    console.log('Already seeded.');
  }
};
export default Satellite;
