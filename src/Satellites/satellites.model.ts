import mongoose from 'mongoose';

export type SatName = string;
export type SatLon = number;
export type SatLat = number;
export type SatStatus = string;
export type IncomingSatModel = any;

interface Satellite {
  name: SatName;
  lat: SatLat;
  lon: SatLon;
  status: SatStatus;
  _id?: string;
  _v?: string;
}

export const StatusSet = new Set<string>([
  'Awaiting Maneuver',
  'Preparing Maneuver',
  'Executing Maneuver',
  'Maneuver Completed'
]);

export const statusValidator = (status: string) => StatusSet.has(status);

export const SatelliteSchema = new mongoose.Schema({
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
});

export const SatModel = mongoose.model('Satellite', SatelliteSchema);

export default Satellite;
